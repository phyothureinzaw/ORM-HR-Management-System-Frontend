import type { AttendanceCorrectionStatus } from '../types/attendance.types'
import { formatUtc } from './attendanceFormatters'

export const correctionStatusLabels: Record<AttendanceCorrectionStatus, string> = { 1: 'Pending', 2: 'Approved', 3: 'Declined', 4: 'Cancelled' }
export function correctionStatusLabel(status: AttendanceCorrectionStatus) { return correctionStatusLabels[status] ?? 'Unknown' }
export function formatCorrectionTime(value: string | null, timeZone: string) { return formatUtc(value, timeZone) }
