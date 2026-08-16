import type { NotificationModule, NotificationPriority, NotificationSummary } from '../types/notification.types'

const labels: Record<string, string> = {
  SystemMessage: 'System message', LeaveRequestSubmitted: 'Leave request submitted', LeaveRequestApproved: 'Leave request approved', LeaveRequestDeclined: 'Leave request declined', LeaveRequestCancelled: 'Leave request cancelled',
  AttendanceCorrectionSubmitted: 'Correction submitted', AttendanceCorrectionApproved: 'Correction approved', AttendanceCorrectionDeclined: 'Correction declined', AttendanceCorrectionCancelled: 'Correction cancelled',
  OvertimeRequestSubmitted: 'Overtime request submitted', OvertimeRequestApproved: 'Overtime request approved', OvertimeRequestDeclined: 'Overtime request declined', OvertimeRequestCancelled: 'Overtime request cancelled',
}
export const moduleLabels: Record<NotificationModule, string> = { System: 'System', Leave: 'Leave', Attendance: 'Attendance', Overtime: 'Overtime' }
export function eventLabel(event: string) { return labels[event] ?? event.replace(/([a-z])([A-Z])/g, '$1 $2') }
export function priorityLabel(priority: NotificationPriority) { return priority === 3 ? 'Urgent' : priority === 2 ? 'Important' : 'Normal' }
export function isSafeActionUrl(value: string | null | undefined): value is string { return Boolean(value && /^\/(?!\/)/.test(value) && !/[\\]/.test(value) && !/^(?:\/\/|https?:|javascript:)/i.test(value)) }
export function relativeTime(value: string | null | undefined) { if (!value) return 'Unknown time'; const date = new Date(value); if (Number.isNaN(date.getTime())) return 'Unknown time'; const seconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000)); if (seconds < 60) return 'Just now'; if (seconds < 3600) return `${Math.floor(seconds / 60)} minute${Math.floor(seconds / 60) === 1 ? '' : 's'} ago`; if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) === 1 ? '' : 's'} ago`; if (seconds < 172800) return 'Yesterday'; return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }
export function exactTime(value: string | null | undefined) { const date = value ? new Date(value) : null; return date && !Number.isNaN(date.getTime()) ? date.toLocaleString() : 'Unknown time' }
export function moduleClass(module: NotificationModule) { return `notification-module-${module.toLowerCase()}` }
export function summaryText(notification: NotificationSummary) { return `${notification.title}: ${notification.message}` }
