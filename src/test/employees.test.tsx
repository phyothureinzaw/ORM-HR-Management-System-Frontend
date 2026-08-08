import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { EmployeesPage } from '../features/employees/pages/EmployeesPage'
import { AddEmployeePage } from '../features/employees/pages/EmployeeFormPages'
import { clearAuth, setAuthenticated } from '../features/auth/store/authSlice'
import { store } from '../app/store'
import { server } from './server'
import { renderWithProviders } from './testUtils'

const employee = { id: 'employee-1', employeeCode: 'EMP-001', firstName: 'Alex', lastName: 'Morgan', fullName: 'Alex Morgan', workEmail: 'alex@example.test', phoneNumber: null, jobTitle: 'Analyst', employmentDate: '2026-01-01', terminationDate: null, employmentStatus: 1, isActive: true, hasLoginAccount: false, department: { id: 'department-1', code: 'OPS', name: 'Operations' }, manager: null, loginAccount: { hasLoginAccount: false, userId: null, userName: null, email: null, isActive: null, roles: [], lastLoginAtUtc: null }, roles: [], createdAtUtc: '2026-01-01T00:00:00Z', updatedAtUtc: null }
const options = { departments: [{ id: 'department-1', code: 'OPS', name: 'Operations' }], managers: [{ id: 'manager-1', employeeCode: 'MGR-001', fullName: 'Morgan Manager', jobTitle: 'Manager' }], roles: [{ id: 'role-1', name: 'Employee', normalizedName: 'EMPLOYEE' }], employmentStatuses: [{ value: 1, name: 'Active' }, { value: 2, name: 'OnLeave' }, { value: 3, name: 'Terminated' }] }
const page = { items: [employee], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false }
const user = { userId: 'user-1', companyId: 'company-1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR', userName: 'admin', email: 'admin@example.test', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin', roles: ['Company Admin'], permissions: ['employees.view', 'employees.manage'] }

describe('employee management frontend', () => {
  beforeEach(() => { store.dispatch(clearAuth()); store.dispatch(setAuthenticated({ accessToken: 'employee-token', user })) })

  it('loads the directory with filters and debounced search', async () => {
    const requests: URL[] = []
    server.use(http.get('http://localhost:5278/api/Employee/GetEmployeeFormOptions', () => HttpResponse.json(options)), http.get('http://localhost:5278/api/Employee/GetEmployees', ({ request }) => { requests.push(new URL(request.url)); return HttpResponse.json(page) }))
    const client = userEvent.setup()
    renderWithProviders(<EmployeesPage />, '/employees?includeInactive=false&page=1&pageSize=10&sortBy=EmployeeCode&sortDirection=asc')
    expect(await screen.findByText('Alex Morgan')).toBeInTheDocument()
    await client.type(screen.getByRole('textbox', { name: 'Search employees' }), 'alex')
    await waitFor(() => expect(requests.some((request) => request.searchParams.get('search') === 'alex')).toBe(true), { timeout: 1000 })
    expect(requests.at(-1)?.searchParams.get('includeInactive')).toBe('false')
  })

  it('hides management actions for a view-only user', async () => {
    store.dispatch(setAuthenticated({ accessToken: 'employee-token', user: { ...user, permissions: ['employees.view'] } }))
    server.use(http.get('http://localhost:5278/api/Employee/GetEmployeeFormOptions', () => HttpResponse.json(options)), http.get('http://localhost:5278/api/Employee/GetEmployees', () => HttpResponse.json(page)))
    renderWithProviders(<EmployeesPage />, '/employees')
    expect(await screen.findByText('Alex Morgan')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /add employee/i })).not.toBeInTheDocument()
    const client = userEvent.setup()
    await client.click(screen.getByRole('button', { name: /actions for alex morgan/i }))
    expect(screen.queryByRole('menuitem', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('renders add form with conditional login fields and sends normalized employee data', async () => {
    let body: Record<string, unknown> | undefined
    server.use(http.get('http://localhost:5278/api/Employee/GetEmployeeFormOptions', () => HttpResponse.json(options)), http.post('http://localhost:5278/api/Employee/AddEmployee', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json(employee, { status: 201 }) }))
    const client = userEvent.setup()
    renderWithProviders(<AddEmployeePage />, '/employees/new')
    await screen.findByRole('heading', { name: 'Add employee' })
    expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument()
    await client.click(await screen.findByRole('checkbox', { name: /create a login account/i }))
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument()
    await client.type(screen.getByLabelText(/employee code/i), 'emp-2')
    await client.type(screen.getByLabelText(/first name/i), 'Jamie')
    await client.type(screen.getByLabelText(/last name/i), 'Lee')
    await client.selectOptions(screen.getByLabelText(/^manager/i), 'manager-1')
    await client.type(screen.getByLabelText(/^username/i), 'jamie')
    await client.type(screen.getByLabelText(/^login email/i), 'jamie@example.test')
    await client.type(screen.getByLabelText(/^password/i), 'StrongPassword1!')
    await client.type(screen.getByLabelText(/confirm password/i), 'StrongPassword1!')
    await client.selectOptions(screen.getByLabelText(/^role/i), 'role-1')
    await client.click(screen.getByRole('button', { name: /^Add employee$/ }))
    await waitFor(() => expect(body).toMatchObject({ employeeCode: 'EMP-2', managerId: 'manager-1', createLoginAccount: true }))
    expect(body?.loginAccount).toMatchObject({ userName: 'jamie', email: 'jamie@example.test', roleId: 'role-1' })
  })

  it('handles an empty filtered directory', async () => {
    server.use(http.get('http://localhost:5278/api/Employee/GetEmployeeFormOptions', () => HttpResponse.json(options)), http.get('http://localhost:5278/api/Employee/GetEmployees', () => HttpResponse.json({ ...page, items: [], totalCount: 0, totalPages: 0 })))
    renderWithProviders(<EmployeesPage />, '/employees?search=missing')
    expect(await screen.findByText('No employees found')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Clear filters' }).length).toBeGreaterThan(0)
  })
})
