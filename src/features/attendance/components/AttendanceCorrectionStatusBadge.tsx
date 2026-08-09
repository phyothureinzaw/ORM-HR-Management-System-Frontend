import type { AttendanceCorrectionStatus } from '../types/attendance.types'
import { correctionStatusLabel } from '../utils/attendanceCorrectionFormatters'

export function AttendanceCorrectionStatusBadge({ status }: { status: AttendanceCorrectionStatus }) { return <span className={`badge correction-status correction-status-${status}`}>{correctionStatusLabel(status)}</span> }
