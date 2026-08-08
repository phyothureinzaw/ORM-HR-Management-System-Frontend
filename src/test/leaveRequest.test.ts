import { describe, expect, it } from 'vitest'
import { estimateLeaveDays, leaveRequestSchema } from '../features/leave/schemas/leaveRequestSchema'
import { addLeaveRequest } from '../features/leave/api/leaveRequestApi'
import { http, HttpResponse } from 'msw'
import { server } from './server'

describe('leave request client rules', () => {
  it('estimates weekdays and same-day half days', () => {
    expect(estimateLeaveDays('2026-08-03', '2026-08-05', 1)).toBe(3)
    expect(estimateLeaveDays('2026-08-03', '2026-08-03', 2)).toBe(0.5)
    expect(estimateLeaveDays('2026-08-08', '2026-08-09', 1)).toBe(0)
  })
  it('rejects cross-year and non-weekday periods', () => {
    const crossYear = leaveRequestSchema.safeParse({ leaveTypeId: 'annual', startDate: '2026-12-31', endDate: '2027-01-01', startDayPortion: 1, endDayPortion: 1, reason: 'Travel' })
    const weekend = leaveRequestSchema.safeParse({ leaveTypeId: 'annual', startDate: '2026-08-08', endDate: '2026-08-09', startDayPortion: 1, endDayPortion: 1, reason: 'Travel' })
    expect(crossYear.success).toBe(false)
    expect(weekend.success).toBe(false)
  })
  it('requires full portions for multi-day requests', () => {
    const result = leaveRequestSchema.safeParse({ leaveTypeId: 'annual', startDate: '2026-08-03', endDate: '2026-08-04', startDayPortion: 2, endDayPortion: 1, reason: 'Travel' })
    expect(result.success).toBe(false)
  })
  it('keeps date-only values unchanged in the add payload', async () => {
    let received: unknown
    server.use(http.post('http://localhost:5278/api/LeaveRequest/AddLeaveRequest', async ({ request }) => { received = await request.json(); return HttpResponse.json({ request: { status: 1, id: 'request-1' }, balance: null, approvals: [], reason: 'Travel', cancellationReason: null, canEdit: true, canCancel: true, canApprove: false, canDecline: false }) }))
    await addLeaveRequest({ leaveTypeId: 'type-1', startDate: '2026-01-01', endDate: '2026-01-02', startDayPortion: 1, endDayPortion: 1, reason: 'Travel' })
    expect(received).toEqual({ leaveTypeId: 'type-1', startDate: '2026-01-01', endDate: '2026-01-02', startDayPortion: 1, endDayPortion: 1, reason: 'Travel' })
  })
})
