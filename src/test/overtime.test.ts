import { http, HttpResponse } from 'msw'
import { describe, expect, it } from 'vitest'
import { addOvertimeType, updateOvertimeSettings } from '../features/overtime/api/overtimeApi'
import { overtimeKeys } from '../features/overtime/api/overtimeKeys'
import { server } from './server'
import { navigationItems } from '../config/navigation'

describe('Overtime configuration contracts', () => {
  it('uses stable query namespaces for all configuration areas', () => {
    expect(overtimeKeys.typeList({ page: 1, pageSize: 10 })).toEqual(['overtime', 'types', 'list', { page: 1, pageSize: 10 }])
    expect(overtimeKeys.projectDetails('project-1')).toEqual(['overtime', 'projects', 'detail', 'project-1'])
    expect(overtimeKeys.approvalLevelDetails('level-1')).toEqual(['overtime', 'approval-levels', 'detail', 'level-1'])
    expect(navigationItems.filter((item) => item.label === 'Overtime Monitoring')).toEqual([expect.objectContaining({ href: '/dashboard/overtime', status: 'ready' })])
  })

  it('sends decimal multipliers as JSON numbers and never adds tenant fields', async () => {
    let body: Record<string, unknown> = {}
    server.use(http.post('http://localhost:5278/api/OvertimeType/AddOvertimeType', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json({ id: 'type-1', ...body, rowVersion: 'AQ==' }) }))
    await addOvertimeType({ code: 'REG', name: 'Regular', description: 'Normal', payMultiplier: 1.5, isPaid: true })
    expect(body.payMultiplier).toBe(1.5)
    expect(typeof body.payMultiplier).toBe('number')
    expect(body).not.toHaveProperty('companyId')
    expect(body).not.toHaveProperty('rowVersion')
  })

  it('preserves TimeOnly strings and rowversion on settings updates', async () => {
    let body: Record<string, unknown> = {}
    server.use(http.put('http://localhost:5278/api/OvertimeSetting/UpdateOvertimeSettings', async ({ request }) => { body = await request.json() as Record<string, unknown>; return HttpResponse.json({ ...body, id: 'settings-1' }) }))
    await updateOvertimeSettings({ isEnabled: true, requireProject: true, requireAttendanceRecord: false, allowWorkingDayOvertime: true, allowRestDayOvertime: true, allowHolidayOvertime: true, allowMorningContinuation: true, allowPendingCancellation: true, workingDayEarliestStartTime: '19:00:00', workingDayLatestEndTime: '23:59:59', morningLatestEndTime: '08:00:00', restDayEarliestStartTime: '09:00:00', restDayLatestEndTime: '18:00:00', maxMinutesPerRequest: 480, maxMinutesPerWorkDate: 480, minimumRequestMinutes: 30, isActive: true, rowVersion: 'AQ==' })
    expect(body.workingDayEarliestStartTime).toBe('19:00:00')
    expect(body.rowVersion).toBe('AQ==')
    expect(body.isEnabled).toBe(true)
    expect(body).not.toHaveProperty('id')
  })
})
