import type { AttendanceRecord, AttendanceSource, AttendanceStatus } from '../types/attendance.types'

export const statusLabels: Record<AttendanceStatus, string> = { 1: 'Checked In', 2: 'Completed', 3: 'Incomplete', 4: 'Corrected', 5: 'Voided' }
export const sourceLabels: Record<AttendanceSource, string> = { 1: 'Web', 2: 'Mobile', 3: 'Admin', 4: 'Device', 5: 'Import' }
export function statusLabel(status: AttendanceStatus) { return statusLabels[status] }
export function sourceLabel(source: AttendanceSource) { return sourceLabels[source] }
export function formatUtc(value: string | null, timeZone?: string) { if (!value) return '—'; const date = new Date(value); if (Number.isNaN(date.getTime())) return '—'; return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short', timeZone }).format(date) }
export function formatLocal(value: string | null) { if (!value) return '—'; const date = new Date(value); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date) }
export function formatDateOnly(value: string | null) { if (!value) return '—'; const date = new Date(`${value}T00:00:00`); return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date) }
export function formatDuration(minutes: number) { if (minutes <= 0) return '0 minutes'; const hours = Math.floor(minutes / 60); const remainder = minutes % 60; return hours ? `${hours}h ${remainder}m` : `${remainder}m` }
export function recordStatusClass(record: AttendanceRecord) { return `attendance-record-status attendance-record-status-${record.status}` }
