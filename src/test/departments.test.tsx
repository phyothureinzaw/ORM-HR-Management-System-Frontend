import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { DepartmentsPage } from '../features/departments/pages/DepartmentsPage'
import { clearAuth, setAuthenticated } from '../features/auth/store/authSlice'
import { store } from '../app/store'
import { server } from './server'
import { renderWithProviders } from './testUtils'

const department = { id: 'department-1', code: 'FIN', name: 'Finance', description: 'Financial operations', isActive: true, createdAtUtc: '2026-01-01T00:00:00Z', updatedAtUtc: null }
const page = { items: [department], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false }
const baseUser = { userId: 'user-1', companyId: 'company-1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR', userName: 'admin', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin', roles: ['Company Admin'], permissions: ['departments.view', 'departments.manage'] }

describe('department management', () => {
  beforeEach(() => {
    store.dispatch(clearAuth())
    store.dispatch(setAuthenticated({ accessToken: 'department-token', user: baseUser }))
  })

  it('loads departments with the backend list contract and supports URL-backed search', async () => {
    const requests: URL[] = []
    server.use(http.get('http://localhost:5278/api/Department/GetDepartments', ({ request }) => { requests.push(new URL(request.url)); return HttpResponse.json(page) }))
    const client = userEvent.setup()
    renderWithProviders(<DepartmentsPage />, '/departments?includeInactive=false&page=1&pageSize=10&sortBy=Name&sortDirection=asc')
    expect(await screen.findByText('Finance')).toBeInTheDocument()
    expect(requests[0].searchParams.get('includeInactive')).toBe('false')
    await client.type(screen.getByRole('textbox', { name: 'Search departments' }), 'FIN')
    await waitFor(() => expect(requests.some((request) => request.searchParams.get('search') === 'FIN' && request.searchParams.get('page') === '1')).toBe(true), { timeout: 1000 })
  })

  it('shows the empty search state and can clear filters', async () => {
    server.use(http.get('http://localhost:5278/api/Department/GetDepartments', ({ request }) => request.url.includes('search=missing') ? HttpResponse.json({ ...page, items: [], totalCount: 0, totalPages: 0 }) : HttpResponse.json(page)))
    const client = userEvent.setup()
    renderWithProviders(<DepartmentsPage />, '/departments?search=missing&page=1&pageSize=10&includeInactive=false&sortBy=Name&sortDirection=asc')
    expect(await screen.findByText('No departments found')).toBeInTheDocument()
    await client.click(screen.getByRole('button', { name: 'Clear filters' }))
    expect(screen.getByRole('textbox', { name: 'Search departments' })).toHaveValue('')
  })

  it('hides management actions without the manage permission', async () => {
    store.dispatch(setAuthenticated({ accessToken: 'department-token', user: { ...baseUser, permissions: ['departments.view'] } }))
    server.use(http.get('http://localhost:5278/api/Department/GetDepartments', () => HttpResponse.json(page)))
    renderWithProviders(<DepartmentsPage />, '/departments')
    expect(await screen.findByText('Finance')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add department/i })).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/actions for finance/i)).toBeInTheDocument()
    const client = userEvent.setup()
    await client.click(screen.getByLabelText(/actions for finance/i))
    expect(screen.queryByRole('button', { name: 'Edit' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Deactivate' })).not.toBeInTheDocument()
  })

  it('adds a department and invalidates the list after success', async () => {
    let addBody: Record<string, unknown> | undefined
    let listCalls = 0
    server.use(
      http.get('http://localhost:5278/api/Department/GetDepartments', () => { listCalls += 1; return HttpResponse.json(page) }),
      http.post('http://localhost:5278/api/Department/AddDepartment', async ({ request }) => { addBody = await request.json() as Record<string, unknown>; return HttpResponse.json({ ...department, id: 'department-2', code: 'OPS', name: 'Operations' }, { status: 201 }) }),
    )
    const client = userEvent.setup()
    renderWithProviders(<DepartmentsPage />, '/departments')
    await screen.findByText('Finance')
    await client.click(screen.getByRole('button', { name: /add department/i }))
    await client.type(screen.getByLabelText(/^Code/), 'ops_1')
    await client.type(screen.getByLabelText(/^Name/), 'Operations')
    await client.click(screen.getAllByRole('button', { name: /^Add department$/ })[1])
    await waitFor(() => expect(addBody).toEqual({ code: 'OPS_1', name: 'Operations', description: null }))
    await waitFor(() => expect(listCalls).toBeGreaterThan(1))
  })
})
