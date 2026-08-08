import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { App } from '../app/App'
import { store } from '../app/store'
import { apiClient } from '../lib/api/apiClient'
import { clearAuth, setAuthenticated } from '../features/auth/store/authSlice'
import { PermissionGuard } from '../features/auth/components/PermissionGuard'
import { Permissions } from '../lib/permissions'
import { server } from './server'
import { renderWithProviders } from './testUtils'
import { AUTH_SESSION_MARKER, markAuthSessionActive } from '../features/auth/session/authSession'

const user = {
  userId: 'user-1', companyId: 'company-1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR',
  userName: 'admin', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin',
  roles: ['Company Admin'], permissions: ['departments.view', 'departments.manage'],
}

describe('authentication frontend', () => {
  beforeEach(() => {
    store.dispatch(clearAuth())
  })

  it('validates the login form and preserves no password after a failed login', async () => {
    const client = userEvent.setup()
    server.use(http.post('http://localhost:5278/api/auth/login', () => HttpResponse.json({ title: 'Authentication failed' }, { status: 401 })))
    renderWithProviders(<App />, '/login')
    await screen.findByRole('heading', { name: 'Sign in to your workspace' })
    await client.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('Company abbreviation is required.')).toBeInTheDocument()
    await client.type(screen.getByLabelText(/company abbreviation/i), 'northstar')
    await client.type(screen.getByLabelText(/username or email/i), 'admin')
    await client.type(screen.getByLabelText(/^password/i), 'WrongPassword1!')
    await client.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByText('The company, username/email, or password is incorrect.')).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toHaveValue('')
  })

  it('logs in with normalized abbreviation, loads current user, and restores the dashboard', async () => {
    const client = userEvent.setup()
    let loginBody: Record<string, string> | undefined
    let meAuthorization: string | null = null
    server.use(
      http.post('http://localhost:5278/api/auth/login', async ({ request }) => { loginBody = await request.json() as Record<string, string>; return HttpResponse.json({ accessToken: 'access-token', accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z' }) }),
      http.get('http://localhost:5278/api/auth/me', ({ request }) => { meAuthorization = request.headers.get('Authorization'); return HttpResponse.json(user) }),
    )
    renderWithProviders(<App />, '/login')
    await screen.findByRole('heading', { name: 'Sign in to your workspace' })
    await client.type(screen.getByLabelText(/company abbreviation/i), 'northstar')
    await client.type(screen.getByLabelText(/username or email/i), 'admin')
    await client.type(screen.getByLabelText(/^password/i), 'StrongPassword1!')
    await client.click(screen.getByRole('button', { name: 'Sign in' }))
    expect(await screen.findByRole('heading', { name: /good to see you, ada/i })).toBeInTheDocument()
    expect(loginBody?.CompanyAbbreviation).toBe('NORTHSTAR')
    expect(meAuthorization).toBe('Bearer access-token')
    expect(store.getState().auth.accessToken).toBe('access-token')
    expect(store.getState().auth.user?.companyName).toBe('Northstar')
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER)).toBe('active')
    expect(sessionStorage.getItem('accessToken')).toBeNull()
    expect(sessionStorage.getItem('refreshToken')).toBeNull()
  })

  it('maps registration success to Login without assuming automatic authentication', async () => {
    const client = userEvent.setup()
    server.use(http.post('http://localhost:5278/api/auth/register-company', () => HttpResponse.json({ companyId: 'company-2', userId: 'user-2' }, { status: 201 })))
    renderWithProviders(<App />, '/register-company')
    await screen.findByRole('heading', { name: 'Register your company' })
    await client.type(screen.getByLabelText(/company name/i), 'Northstar')
    await client.type(screen.getByLabelText(/company abbreviation/i), 'northstar')
    await client.type(screen.getByLabelText(/^first name/i), 'Ada')
    await client.type(screen.getByLabelText(/^last name/i), 'Admin')
    await client.type(screen.getByLabelText(/^username/i), 'admin')
    await client.type(screen.getByLabelText(/administrator email/i), 'admin@example.com')
    await client.type(screen.getByLabelText(/^password/i), 'StrongPassword1!')
    await client.type(screen.getByLabelText(/confirm password/i, { selector: 'input' }), 'StrongPassword1!')
    await client.click(screen.getByRole('button', { name: /create company workspace/i }))
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(screen.getByLabelText(/company abbreviation/i)).toHaveValue('NORTHSTAR')
  })

  it('restores a session from the HttpOnly-cookie refresh flow on bootstrap', async () => {
    let refreshCount = 0
    let meAuthorization: string | null = null
    const actions: string[] = []
    const unsubscribe = store.subscribe(() => {
      const action = store.getState().auth
      actions.push(`${action.status}:${action.accessToken ?? 'none'}`)
    })
    server.use(
      http.post('http://localhost:5278/api/auth/refresh-token', () => { refreshCount += 1; return HttpResponse.json({ accessToken: 'restored-token', accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z' }) }),
      http.get('http://localhost:5278/api/auth/me', ({ request }) => { meAuthorization = request.headers.get('Authorization'); return HttpResponse.json(user) }),
    )
    markAuthSessionActive()
    renderWithProviders(<App />, '/dashboard')
    expect(await screen.findByRole('heading', { name: /good to see you, ada/i })).toBeInTheDocument()
    unsubscribe()
    expect(refreshCount).toBe(1)
    expect(meAuthorization).toBe('Bearer restored-token')
    expect(actions.some((action) => action === 'bootstrapping:none')).toBe(true)
    expect(actions.some((action) => action === 'bootstrapping:restored-token')).toBe(true)
    expect(store.getState().auth.accessToken).toBe('restored-token')
  })

  it('waits for bootstrap before redirecting when the refresh cookie is missing', async () => {
    let refreshCount = 0
    server.use(http.post('http://localhost:5278/api/auth/refresh-token', () => { refreshCount += 1; return HttpResponse.json({ title: 'Should not be called' }, { status: 401 }) }))
    renderWithProviders(<App />, '/departments')
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(store.getState().auth.status).toBe('unauthenticated')
    expect(refreshCount).toBe(0)
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER)).toBeNull()
  })

  it('keeps a recoverable error for a temporary bootstrap network failure', async () => {
    markAuthSessionActive()
    server.use(http.post('http://localhost:5278/api/auth/refresh-token', () => HttpResponse.error()))
    renderWithProviders(<App />, '/dashboard')
    expect(await screen.findByRole('heading', { name: 'Connection unavailable' })).toBeInTheDocument()
    expect(store.getState().auth.status).toBe('error')
  })

  it('redirects an unauthenticated user away from protected content', async () => {
    renderWithProviders(<App />, '/departments')
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
  })

  it('shares one refresh request across concurrent expired-token requests', async () => {
    let refreshCount = 0
    let requestCount = 0
    store.dispatch(setAuthenticated({ accessToken: 'expired-token', user }))
    server.use(
      http.get('http://localhost:5278/api/test-resource', ({ request }) => {
        requestCount += 1
        return request.headers.get('authorization') === 'Bearer fresh-token' ? HttpResponse.json({ ok: true }) : HttpResponse.json({ title: 'Expired' }, { status: 401 })
      }),
      http.post('http://localhost:5278/api/auth/refresh-token', () => { refreshCount += 1; return HttpResponse.json({ accessToken: 'fresh-token', accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z' }) }),
    )

    await Promise.all([apiClient.get('/api/test-resource'), apiClient.get('/api/test-resource')])

    await waitFor(() => expect(refreshCount).toBe(1))
    expect(requestCount).toBe(4)
    expect(store.getState().auth.accessToken).toBe('fresh-token')
  })

  it('hides restricted content when the current user lacks permission', () => {
    store.dispatch(setAuthenticated({ accessToken: 'token', user: { ...user, permissions: [] } }))
    renderWithProviders(<PermissionGuard permission={Permissions.Departments.Manage} fallback={<span>Not authorized</span>}><span>Manage departments</span></PermissionGuard>)
    expect(screen.getByText('Not authorized')).toBeInTheDocument()
    expect(screen.queryByText('Manage departments')).not.toBeInTheDocument()
  })

  it('clears local authentication when logout is already expired server-side', async () => {
    const client = userEvent.setup()
    store.dispatch(setAuthenticated({ accessToken: 'token', user }))
    markAuthSessionActive()
    server.use(
      http.post('http://localhost:5278/api/auth/refresh-token', () => HttpResponse.json({ accessToken: 'token', accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z' })),
      http.get('http://localhost:5278/api/auth/me', () => HttpResponse.json(user)),
      http.post('http://localhost:5278/api/auth/logout', () => HttpResponse.json({ title: 'Expired' }, { status: 401 })),
    )
    renderWithProviders(<App />, '/dashboard')
    await screen.findByRole('heading', { name: /good to see you, ada/i })
    await client.click(screen.getByText('Ada Admin'))
    await client.click(screen.getByRole('button', { name: 'Sign out' }))
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(store.getState().auth.status).toBe('unauthenticated')
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER)).toBeNull()
  })

  it('removes the tab marker when a marked session has an invalid refresh token', async () => {
    markAuthSessionActive()
    renderWithProviders(<App />, '/dashboard')

    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    expect(sessionStorage.getItem(AUTH_SESSION_MARKER)).toBeNull()
  })
})
