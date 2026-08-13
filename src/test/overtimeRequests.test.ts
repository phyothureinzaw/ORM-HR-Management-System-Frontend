import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { addOvertimeRequest, approveOvertimeRequest, calculateOvertimeRequest, cancelOvertimeRequest, getCompanyOvertime, getOvertimeDashboardSummary } from '../features/overtime/api/overtimeApi'
import { overtimeKeys } from '../features/overtime/api/overtimeKeys'
import { durationText, requestStatusLabels } from '../features/overtime/utils/overtimeRequestFormatters'
import { validDateRange } from '../features/overtime/utils/companyOvertimeFormatters'
import { server } from './server'

const input = { overtimeTypeId: 'type-1', projectId: 'project-1', parentOvertimeRequestId: null, segmentType: 2 as const, startDate: '2026-08-10', endDate: '2026-08-11', startTime: '19:00:00', endTime: '02:00:00', reason: 'Release work', workDescription: null }
describe('Overtime request contracts', () => {
  it('uses request and approval query namespaces', () => {
    expect(overtimeKeys.requestOptions()).toEqual(['overtime', 'requests', 'options'])
    expect(overtimeKeys.myRequests({ page: 1, pageSize: 10 })).toEqual(['overtime', 'requests', 'mine', { page: 1, pageSize: 10 }])
    expect(overtimeKeys.approvalQueue({ page: 1, pageSize: 10 })).toEqual(['overtime', 'approvals', 'queue', { page: 1, pageSize: 10 }])
  })
  it('preserves DateOnly and TimeOnly fields without identity or derived values', async () => {
    let body: Record<string, unknown> = {}
    server.use(http.post('http://localhost:5278/api/OvertimeRequest/AddOvertimeRequest', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json({ request: { ...body }, canEdit: true }, { status: 201 }) }))
    await addOvertimeRequest(input)
    expect(body.startDate).toBe('2026-08-10')
    expect(body.startTime).toBe('19:00:00')
    expect(body).not.toHaveProperty('companyId')
    expect(body).not.toHaveProperty('employeeId')
    expect(body).not.toHaveProperty('requestedMinutes')
    expect(body).not.toHaveProperty('dayCategory')
  })
  it('uses the backend calculation and decision payloads exactly', async () => {
    let calculation: Record<string, unknown> = {}; let decision: Record<string, unknown> = {}
    server.use(
      http.post('http://localhost:5278/api/OvertimeRequest/CalculateOvertimeRequest', async ({ request }) => { calculation = await request.json() as Record<string, unknown>; return HttpResponse.json({ isValid: true, requestedMinutes: 420, durationText: '7h 0m' }) }),
      http.post('http://localhost:5278/api/OvertimeRequest/ApproveOvertimeRequest/request-1', async ({ request }) => { decision = await request.json() as Record<string, unknown>; return HttpResponse.json({}) }),
    )
    await calculateOvertimeRequest(input)
    await approveOvertimeRequest('request-1', { rowVersion: 'request-version', approvalRowVersion: 'approval-version', comment: null })
    expect(calculation.segmentType).toBe(2)
    expect(decision).toEqual({ rowVersion: 'request-version', approvalRowVersion: 'approval-version', comment: null })
  })
  it('sends cancellation RowVersion and exposes readable status/duration values', async () => {
    let body: Record<string, unknown> = {}
    server.use(http.post('http://localhost:5278/api/OvertimeRequest/CancelOvertimeRequest/request-1', async ({ request }) => { body = await request.json() as Record<string, unknown>; return new HttpResponse(null, { status: 204 }) }))
    await cancelOvertimeRequest('request-1', { cancellationReason: 'No longer needed', rowVersion: 'version' })
    expect(body).toEqual({ cancellationReason: 'No longer needed', rowVersion: 'version' })
    expect(requestStatusLabels[4]).toBe('Cancelled')
    expect(durationText(90)).toBe('1h 30m')
  })

  it('serializes monitoring filters with server pagination and omits empty values', async () => {
    let search = ''
    server.use(http.get('http://localhost:5278/api/OvertimeRequest/GetCompanyOvertimeRequests', ({ request }) => { search = new URL(request.url).search; return HttpResponse.json({ items: [], page: 1, pageSize: 20, totalCount: 0, totalPages: 0, hasPreviousPage: false, hasNextPage: false }) }))
    await getCompanyOvertime({ search: 'Ada', employeeId: 'employee-1', departmentId: '', status: 2, fromDate: '2026-08-01', toDate: '2026-08-31', page: 2, pageSize: 20 })
    const params = new URLSearchParams(search)
    expect(params.get('search')).toBe('Ada')
    expect(params.get('employeeId')).toBe('employee-1')
    expect(params.get('status')).toBe('2')
    expect(params.get('fromDate')).toBe('2026-08-01')
    expect(params.get('toDate')).toBe('2026-08-31')
    expect(params.get('page')).toBe('2')
    expect(params.get('pageSize')).toBe('20')
    expect(params.has('departmentId')).toBe(false)
  })

  it('uses a separate stable company list, details, options, and summary namespace', () => {
    expect(overtimeKeys.companyList({ page: 1, pageSize: 20 })).toEqual(['overtime', 'company', 'list', { page: 1, pageSize: 20 }])
    expect(overtimeKeys.companyDetails('request-1')).toEqual(['overtime', 'company', 'detail', 'request-1'])
    expect(overtimeKeys.companyOptions()).toEqual(['overtime', 'company', 'options'])
    expect(overtimeKeys.dashboardSummary({ fromDate: '2026-08-01', toDate: '2026-08-31' })).toEqual(['overtime', 'company', 'summary', { fromDate: '2026-08-01', toDate: '2026-08-31' }])
  })

  it('serializes summary date filters as date-only query values', async () => {
    let search = ''
    server.use(http.get('http://localhost:5278/api/OvertimeRequest/GetOvertimeDashboardSummary', ({ request }) => { search = new URL(request.url).search; return HttpResponse.json({ startDate: '2026-08-01', endDate: '2026-08-31', pendingCount: 0, pendingMinutes: 0, approvedCount: 0, approvedMinutes: 0, declinedCount: 0, cancelledCount: 0, workingDayApprovedMinutes: 0, restDayApprovedMinutes: 0, holidayApprovedMinutes: 0 }) }))
    await getOvertimeDashboardSummary({ fromDate: '2026-08-01', toDate: '2026-08-31' })
    expect(search).toBe('?fromDate=2026-08-01&toDate=2026-08-31')
  })

  it('rejects an inverted monitoring date range before querying', () => {
    expect(validDateRange({ fromDate: '2026-08-31', toDate: '2026-08-01', page: 1, pageSize: 20 })).toBe('From date cannot be later than To date.')
    expect(validDateRange({ fromDate: '2026-08-01', toDate: '2026-08-31', page: 1, pageSize: 20 })).toBeNull()
  })
})
