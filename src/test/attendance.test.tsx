import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from './testUtils'
import { server } from './server'
import { addLocation, addAssignment, getCompanyAttendance, getCompanyAttendanceById } from '../features/attendance/api/attendanceApi'
import { attendanceConfigurationKeys } from '../features/attendance/api/attendanceKeys'
import { attendanceKeys } from '../features/attendance/api/attendanceEmployeeKeys'
import { WorkShiftsPage } from '../features/attendance/pages/WorkShiftsPage'
import { CompanyAttendancePage } from '../features/attendance/pages/CompanyAttendancePage'
import { Sidebar } from '../components/layout/Sidebar'
import { store } from '../app/store'
import { setAuthenticated } from '../features/auth/store/authSlice'

const user = { userId: 'user-1', companyId: 'company-1', companyName: 'Northstar', companyAbbreviation: 'NORTHSTAR', userName: 'admin', email: 'admin@example.com', firstName: 'Ada', lastName: 'Admin', fullName: 'Ada Admin', roles: ['Company Admin'], permissions: ['attendance.manage'] }

describe('Attendance configuration', () => {
  it('sends coordinates as JSON numbers and preserves date-only assignment values', async () => {
    let locationBody: unknown
    let assignmentBody: unknown
    server.use(
      http.post('http://localhost:5278/api/AttendanceLocation/AddAttendanceLocation', async ({ request }) => { locationBody = await request.json(); return HttpResponse.json({ id: 'location-1' }) }),
      http.post('http://localhost:5278/api/EmployeeShiftAssignment/AddEmployeeShiftAssignment', async ({ request }) => { assignmentBody = await request.json(); return HttpResponse.json({ id: 'assignment-1' }) }),
    )
    await addLocation({ code: 'HQ', name: 'Headquarters', address: null, latitude: 16.8409, longitude: 96.1735, allowedRadiusMeters: 100, isDefault: true })
    await addAssignment({ employeeId: 'employee-1', workShiftId: 'shift-1', effectiveFrom: '2026-01-05', effectiveTo: null })
    expect(locationBody).toEqual(expect.objectContaining({ latitude: 16.8409, longitude: 96.1735, allowedRadiusMeters: 100 }))
    expect(assignmentBody).toEqual({ employeeId: 'employee-1', workShiftId: 'shift-1', effectiveFrom: '2026-01-05', effectiveTo: null })
  })

  it('uses stable query key namespaces for lists and details', () => {
    const filters = { page: 1, pageSize: 10, search: 'day' }
    expect(attendanceConfigurationKeys.workShiftList(filters)).toEqual(['attendance-configuration', 'work-shifts', 'list', filters])
    expect(attendanceConfigurationKeys.workShiftDetail('shift-1')).toEqual(['attendance-configuration', 'work-shifts', 'detail', 'shift-1'])
  })

  it('renders overnight shifts and protects configuration without manage permission', async () => {
    store.dispatch(setAuthenticated({ accessToken: 'attendance-token', user }))
    server.use(http.get('http://localhost:5278/api/WorkShift/GetWorkShifts', () => HttpResponse.json({ items: [{ id: 'shift-1', code: 'NIGHT', name: 'Night coverage', description: null, startTime: '22:00:00', endTime: '06:00:00', breakMinutes: 30, gracePeriodMinutes: 10, earlyCheckInMinutes: 120, workDaysMask: 31, workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], crossesMidnight: true, isDefault: true, isActive: true, rowVersion: 'AQ==' }], page: 1, pageSize: 10, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false })))
    renderWithProviders(<WorkShiftsPage />, '/attendance/shifts')
    expect(await screen.findByText('22:00–06:00')).toBeInTheDocument()
    expect(screen.getByText('Next day')).toBeInTheDocument()
  })

  it('hides the configuration surface without attendance.manage', () => {
    store.dispatch(setAuthenticated({ accessToken: 'attendance-token', user: { ...user, permissions: [] } }))
    renderWithProviders(<WorkShiftsPage />, '/attendance/shifts')
    expect(screen.getByText('Access not available')).toBeInTheDocument()
  })

  it('renders company summary and monitoring records for attendance.manage users', async () => {
    store.dispatch(setAuthenticated({ accessToken: 'attendance-token', user }))
    server.use(
      http.get('http://localhost:5278/api/Attendance/GetAttendanceDashboardSummary', () => HttpResponse.json({ attendanceDate: '2026-08-10', totalActiveEmployees: 4, checkedIn: 2, completed: 1, notCheckedIn: 2, late: 1, outsideLocation: 0, incomplete: 0, onApprovedFullDayLeave: 1, totalWorkMinutes: 480 })),
      http.get('http://localhost:5278/api/EmployeeShiftAssignment/GetEmployeeShiftAssignmentOptions', () => HttpResponse.json({ employees: [], workShifts: [], departments: [] })),
      http.get('http://localhost:5278/api/Attendance/GetCompanyAttendance', () => HttpResponse.json({ items: [{ id: 'record-1', employee: { id: 'employee-1', employeeCode: 'E-1', fullName: 'Ada Admin', jobTitle: 'HR', isActive: true }, attendanceDate: '2026-08-10', shift: { id: 'shift-1', code: 'DAY', name: 'Day Shift', isActive: true }, scheduledStartDateTimeUtc: '2026-08-10T02:30:00Z', scheduledEndDateTimeUtc: '2026-08-10T10:30:00Z', checkInDateTimeUtc: '2026-08-10T02:35:00Z', checkOutDateTimeUtc: null, status: 1, source: 1, lateMinutes: 5, earlyLeaveMinutes: 0, workMinutes: 0, isCheckInOutsideLocation: false, isCheckOutOutsideLocation: false, checkInLatitude: null, checkInLongitude: null, checkOutLatitude: null, checkOutLongitude: null, checkInDistanceMeters: null, checkOutDistanceMeters: null, checkInLocation: null, checkOutLocation: null, checkInRemark: null, checkOutRemark: null, outsideCheckInReason: null, outsideCheckOutReason: null, isManuallyAdjusted: false, rowVersion: 'AQ==' }], page: 1, pageSize: 20, totalCount: 1, totalPages: 1, hasPreviousPage: false, hasNextPage: false })),
    )
    renderWithProviders(<CompanyAttendancePage />, '/dashboard/attendance')
    expect((await screen.findAllByText('Attendance Monitoring')).length).toBeGreaterThanOrEqual(1)
    expect(await screen.findByText('Ada Admin')).toBeInTheDocument()
    expect(await screen.findByText('Active employees')).toBeInTheDocument()
  })

  it('normalizes company query keys and omits empty identifier filters', async () => {
    expect(attendanceKeys.companyList({ page: 1, pageSize: 20, lateOnly: false, outsideLocationOnly: false, incompleteOnly: false, employeeId: '' })).toEqual(attendanceKeys.companyList({ page: 1, pageSize: 20, lateOnly: false, outsideLocationOnly: false, incompleteOnly: false }))
    let requestUrl = ''
    server.use(http.get('http://localhost:5278/api/Attendance/GetCompanyAttendance', ({ request }) => { requestUrl = request.url; return HttpResponse.json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false }) }))
    await getCompanyAttendance({ page: 1, pageSize: 20, lateOnly: false, outsideLocationOnly: false, incompleteOnly: false, employeeId: '', departmentId: '', workShiftId: '' })
    expect(requestUrl).not.toContain('employeeId=')
    expect(requestUrl).not.toContain('departmentId=')
    expect(requestUrl).not.toContain('workShiftId=')
  })

  it('uses the company-authorized details endpoint without client tenant data', async () => {
    let requestUrl = ''
    server.use(http.get('http://localhost:5278/api/Attendance/GetCompanyAttendanceById/record-2', ({ request }) => {
      requestUrl = request.url
      return HttpResponse.json({ id: 'record-2', employee: { id: 'employee-2', employeeCode: 'E-2', fullName: 'Morgan Employee', jobTitle: 'Analyst', isActive: true }, attendanceDate: '2026-08-10', shift: null, scheduledStartDateTimeUtc: null, scheduledEndDateTimeUtc: null, checkInDateTimeUtc: null, checkOutDateTimeUtc: null, status: 3, source: 3, lateMinutes: 0, earlyLeaveMinutes: 0, workMinutes: 0, isCheckInOutsideLocation: false, isCheckOutOutsideLocation: false, checkInLatitude: null, checkInLongitude: null, checkOutLatitude: null, checkOutLongitude: null, checkInDistanceMeters: null, checkOutDistanceMeters: null, checkInLocation: null, checkOutLocation: null, checkInRemark: null, checkOutRemark: null, outsideCheckInReason: null, outsideCheckOutReason: null, isManuallyAdjusted: false, rowVersion: 'AQ==' })
    }))
    const result = await getCompanyAttendanceById('record-2')
    expect(result.employee.fullName).toBe('Morgan Employee')
    expect(requestUrl).not.toContain('companyId=')
  })

  it('uses the Dashboard page for monitoring and does not add a duplicate navigation link', () => {
    store.dispatch(setAuthenticated({ accessToken: 'attendance-token', user }))
    renderWithProviders(<Sidebar />, '/dashboard')
    expect(screen.queryByRole('link', { name: 'Attendance Monitoring' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Attendance' })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/dashboard')
  })
})
