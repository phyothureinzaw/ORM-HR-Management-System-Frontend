import { http, HttpResponse } from 'msw'
import userEvent from '@testing-library/user-event'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { App } from '../app/App'
import { getApiBaseUrl } from '../lib/env'
import { BackendStatus } from '../components/feedback/BackendStatus'
import { server } from './server'
import { renderWithProviders } from './testUtils'
import { markAuthSessionActive } from '../features/auth/session/authSession'

describe('Customer Web foundation', () => {
  it('renders the home page and provider-backed health status', async () => {
    renderWithProviders(<App />)

    expect(await screen.findByRole('heading', { name: /organize your workforce/i })).toBeInTheDocument()
    expect(await screen.findByText('Backend connected')).toBeInTheDocument()
  })

  it('requires login before opening workspace actions without a refresh session', async () => {
    const client = userEvent.setup()
    renderWithProviders(<App />)

    await screen.findByRole('heading', { name: /organize your workforce/i })
    await client.click(screen.getByRole('link', { name: /view workspace preview/i }))
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()

    await client.click(screen.getByRole('link', { name: /back to foundation/i }))
    await screen.findByRole('heading', { name: /organize your workforce/i })
    await client.click(screen.getByRole('link', { name: /open sign-in placeholder/i }))
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
  })

  it('shows health loading and unavailable states, then retries successfully', async () => {
    let attempts = 0
    server.use(http.get('http://localhost:5278/health', () => {
      attempts += 1
      return attempts === 1 ? HttpResponse.json({ title: 'Unavailable' }, { status: 503 }) : HttpResponse.text('Healthy')
    }))

    renderWithProviders(<BackendStatus />)
    expect(await screen.findByText('Backend unavailable')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('Backend connected')).toBeInTheDocument()
    expect(attempts).toBe(2)
  })

  it('renders placeholder routes and not found state', async () => {
    const { unmount } = renderWithProviders(<App />, '/login')
    expect(await screen.findByRole('heading', { name: 'Sign in to your workspace' })).toBeInTheDocument()
    unmount()

    renderWithProviders(<App />, '/unknown-page')
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument()
  })

  it('renders the application shell with accessible mobile navigation controls', async () => {
    server.use(
      http.post('http://localhost:5278/api/auth/refresh-token', () => HttpResponse.json({ accessToken: 'shell-token', accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z' })),
      http.get('http://localhost:5278/api/auth/me', () => HttpResponse.json({ userId: 'user-1', companyId: 'company-1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR', userName: 'admin', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin', roles: ['Company Admin'], permissions: ['departments.view'] })),
    )
    markAuthSessionActive()
    renderWithProviders(<App />, '/dashboard')

    expect(await screen.findByRole('heading', { name: /good to see you/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    expect(screen.getByRole('button', { name: 'Close navigation' })).toBeInTheDocument()
  })

  it('fails clearly when the API URL is missing or invalid', () => {
    expect(() => getApiBaseUrl('')).toThrow(/VITE_API_BASE_URL is missing/)
    expect(() => getApiBaseUrl('not-a-url')).toThrow(/valid absolute URL/)
  })

  it('keeps health failure separate from authentication state', async () => {
    server.use(http.get('http://localhost:5278/health', () => HttpResponse.text('Service unavailable', { status: 503 })))

    renderWithProviders(<BackendStatus />)

    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Backend unavailable'))
    expect(screen.queryByText(/sign in/i)).not.toBeInTheDocument()
  })
})
