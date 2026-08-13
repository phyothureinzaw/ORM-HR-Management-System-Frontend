import type { ApproverType, OvertimeApprovalStatus, OvertimeDayCategory, OvertimeRequestStatus, OvertimeSegmentType } from '../types/overtime.types'

export const requestStatusLabels: Record<OvertimeRequestStatus, string> = { 1: 'Pending', 2: 'Approved', 3: 'Declined', 4: 'Cancelled' }
export const dayCategoryLabels: Record<OvertimeDayCategory, string> = { 1: 'Working day', 2: 'Rest day', 3: 'Holiday' }
export const segmentLabels: Record<OvertimeSegmentType, string> = { 1: 'Standard', 2: 'Evening', 3: 'Morning continuation' }
export const approvalStatusLabels: Record<OvertimeApprovalStatus, string> = { 1: 'Pending', 2: 'Approved', 3: 'Declined', 4: 'Skipped/Cancelled' }
export const approverTypeLabels: Record<ApproverType, string> = { 1: 'Employee manager', 2: 'Role', 3: 'Specific employee' }
export function durationText(minutes: number | null | undefined) { if (!minutes || minutes <= 0) return '0m'; const hours = Math.floor(minutes / 60); const remainder = minutes % 60; return hours ? `${hours}h ${remainder}m` : `${remainder}m` }
export function statusClass(status: number) { return `overtime-status overtime-request-status-${status}` }
export function dateText(value: string | null | undefined) { if (!value) return '—'; const [year, month, day] = value.split('-').map(Number); return Number.isFinite(year) ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(year, month - 1, day)) : value }
export function localRange(startDate: string, startTime: string, endDate: string | undefined, endTime: string) { return `${dateText(startDate)} ${startTime.slice(0, 5)} – ${dateText(endDate ?? startDate)} ${endTime.slice(0, 5)}` }
