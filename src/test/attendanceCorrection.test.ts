import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { addAttendanceCorrection, getAttendanceCorrectionQueue, getAttendanceCorrectionQueueOptions } from '../features/attendance/api/attendanceApi'
import { attendanceKeys } from '../features/attendance/api/attendanceEmployeeKeys'
import { correctionStatusLabel } from '../features/attendance/utils/attendanceCorrectionFormatters'
import { isoToLocalDateTime, localDateTimeToIso } from '../features/attendance/utils/attendanceTime'
import { server } from './server'

describe('Attendance corrections', () => {
  it('converts company-local Yangon values to explicit UTC instants', () => {
    expect(localDateTimeToIso('2026-01-05T09:00', 'Asia/Yangon')).toBe('2026-01-05T02:30:00.000Z')
    expect(isoToLocalDateTime('2026-01-05T15:30:00Z', 'Asia/Yangon')).toBe('2026-01-05T22:00')
  })

  it('handles an overnight local shift without using the browser timezone', () => {
    const requested = localDateTimeToIso('2026-01-06T06:00', 'Asia/Yangon')
    expect(requested).toBe('2026-01-05T23:30:00.000Z')
    expect(isoToLocalDateTime(requested, 'Asia/Yangon')).toBe('2026-01-06T06:00')
  })

  it('sends only backend correction fields and preserves explicit timestamps', async () => {
    let body: Record<string, unknown> = {}
    server.use(http.post('http://localhost:5278/api/AttendanceCorrection/AddAttendanceCorrection', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json({}) }))
    await addAttendanceCorrection({ attendanceRecordId: 'record-1', requestedCheckInDateTime: '2026-01-05T02:30:00.000Z', requestedCheckOutDateTime: null, reason: 'Forgot to check in', employeeComment: null })
    expect(body).toEqual({ attendanceRecordId: 'record-1', requestedCheckInDateTime: '2026-01-05T02:30:00.000Z', requestedCheckOutDateTime: null, reason: 'Forgot to check in', employeeComment: null })
    expect(body).not.toHaveProperty('employeeId')
    expect(body).not.toHaveProperty('status')
  })

  it('uses stable correction namespaces and readable status labels', () => {
    expect(attendanceKeys.correctionOptions('record-1')).toEqual(['attendance', 'correction-options', 'record-1'])
    expect(attendanceKeys.myCorrections({ page: 1, pageSize: 20 })).toEqual(['attendance', 'my-corrections', { page: 1, pageSize: 20 }])
    expect(correctionStatusLabel(1)).toBe('Pending')
    expect(correctionStatusLabel(4)).toBe('Cancelled')
  })

  it('loads lookup options and omits empty employee and department filters', async () => {
    let requestUrl = ''
    server.use(
      http.get('http://localhost:5278/api/AttendanceCorrection/GetAttendanceCorrectionQueueOptions', () => HttpResponse.json({ employees: [{ id: 'employee-1', employeeCode: 'E-1', fullName: 'Test Employee', departmentId: 'department-1' }], departments: [{ id: 'department-1', code: 'HR', name: 'Human Resources' }] })),
      http.get('http://localhost:5278/api/AttendanceCorrection/GetAttendanceCorrectionQueue', ({ request }) => { requestUrl = request.url; return HttpResponse.json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false }) }),
    )
    const options = await getAttendanceCorrectionQueueOptions()
    await getAttendanceCorrectionQueue({ employeeId: '', departmentId: '', status: 1, page: 1, pageSize: 20 })
    expect(options.employees[0].employeeCode).toBe('E-1')
    expect(options.departments[0].name).toBe('Human Resources')
    expect(requestUrl).not.toContain('employeeId=')
    expect(requestUrl).not.toContain('departmentId=')
  })
})
