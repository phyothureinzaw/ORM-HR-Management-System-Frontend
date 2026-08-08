import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { LeaveTypesPage } from '../features/leave/pages/LeaveTypesPage'
import { LeaveBalancesPage } from '../features/leave/pages/LeaveBalancesPage'
import { LeaveApprovalQueuePage } from '../features/leave/pages/LeaveApprovalQueuePage'
import { clearAuth, setAuthenticated } from '../features/auth/store/authSlice'
import { Permissions } from '../lib/permissions'
import { store } from '../app/store'
import { renderWithProviders } from './testUtils'
import { server } from './server'

const user = { userId: 'u1', companyId: 'c1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR', userName: 'admin', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin', roles: ['Company Admin'], permissions: [Permissions.Leaves.Manage, Permissions.Leaves.View] }
const type = { id: 'type-1', code: 'ANNUAL', name: 'Annual Leave', description: null, defaultDaysPerYear: 20, isPaid: true, allowHalfDay: true, allowNegativeBalance: false, requiresAttachment: false, isActive: true, createdAtUtc: '2026-01-01T00:00:00Z', updatedAtUtc: null }

describe('leave configuration frontend', () => {
  beforeEach(() => { store.dispatch(clearAuth()); store.dispatch(setAuthenticated({ accessToken: 'token', user })) })
  it('loads Leave Types and opens an accessible add form', async () => {
    server.use(http.get('http://localhost:5278/api/LeaveType/GetLeaveTypes', () => HttpResponse.json({ items: [type], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false })))
    const client = userEvent.setup(); renderWithProviders(<LeaveTypesPage />)
    expect(await screen.findByText('Annual Leave')).toBeInTheDocument()
    await client.click(screen.getByRole('button', { name: /add leave type/i }))
    expect(screen.getByRole('dialog', { name: /add leave type/i })).toBeInTheDocument()
    await client.click(within(screen.getByRole('dialog')).getByRole('button', { name: /add leave type/i }))
    await waitFor(() => expect(within(screen.getByRole('dialog')).getByLabelText(/Code/)).toHaveAttribute('aria-invalid', 'true'))
  })
  it('shows an unauthorized state without the manage permission', () => {
    store.dispatch(setAuthenticated({ accessToken: 'token', user: { ...user, permissions: [] } }))
    renderWithProviders(<LeaveTypesPage />)
    expect(screen.getByRole('heading', { name: 'Access not available' })).toBeInTheDocument()
  })
  it('keeps used and pending balance values read-only in the update form', async () => {
    server.use(
      http.get('http://localhost:5278/api/LeaveBalance/GetLeaveBalances', () => HttpResponse.json({ items: [{ id: 'b1', employee: { id: 'e1', employeeCode: 'EMP-1', fullName: 'Ada Employee', jobTitle: 'Analyst', isActive: true }, leaveType: { id: 't1', code: 'ANNUAL', name: 'Annual Leave', isActive: true, allowNegativeBalance: false }, balanceYear: 2026, entitledDays: 20, carriedForwardDays: 2, adjustedDays: 0, usedDays: 3, pendingDays: 1, totalAllocatedDays: 22, availableDays: 18, createdAtUtc: '2026-01-01T00:00:00Z', updatedAtUtc: null }], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false })),
      http.get('http://localhost:5278/api/Employee/GetEmployees', () => HttpResponse.json({ items: [], page: 1, pageSize: 100, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false })),
      http.get('http://localhost:5278/api/LeaveType/GetLeaveTypes', () => HttpResponse.json({ items: [type], page: 1, pageSize: 100, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false })),
    )
    const client = userEvent.setup(); renderWithProviders(<LeaveBalancesPage />); await screen.findByText('Ada Employee'); await client.click(screen.getByRole('button', { name: 'Edit' })); expect(screen.getByText(/Used 3 · Pending 1 · Available 18/)).toBeInTheDocument(); await waitFor(() => expect(screen.getByRole('dialog')).toBeInTheDocument()); expect(screen.queryByLabelText(/used days/i)).not.toBeInTheDocument()
  })
  it('does not load admin configuration options for an approver queue', async () => {
    let configurationCalled = false
    store.dispatch(setAuthenticated({ accessToken: 'token', user: { ...user, permissions: [Permissions.Leaves.View, Permissions.Leaves.Approve] } }))
    server.use(
      http.get('http://localhost:5278/api/LeaveRequest/GetLeaveApprovalQueue', () => HttpResponse.json({ items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false })),
      http.get('http://localhost:5278/api/LeaveSetting/GetLeaveConfigurationOptions', () => { configurationCalled = true; return HttpResponse.json({ title: 'Should not be called' }, { status: 500 }) }),
    )
    renderWithProviders(<LeaveApprovalQueuePage />, '/leave/approvals')
    expect(await screen.findByText('No requests awaiting your approval')).toBeInTheDocument()
    expect(configurationCalled).toBe(false)
    expect(screen.queryByText('Leave Settings')).not.toBeInTheDocument()
  })
})
