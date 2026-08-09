import { cn } from '../../../lib/utils'
import type { AttendanceStatus } from '../types/attendance.types'
import { statusLabel } from '../utils/attendanceFormatters'

export function AttendanceStatusBadge({ status }: { status: AttendanceStatus }) { return <span className={cn('badge attendance-record-status', `attendance-record-status-${status}`)}>{statusLabel(status)}</span> }
