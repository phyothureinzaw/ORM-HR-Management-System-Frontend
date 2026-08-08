import { Badge } from '../../../components/ui/Badge'; import type { LeaveRequestStatus } from '../types/leaveRequest.types'
const leaveStatusLabel = (status: LeaveRequestStatus) => ({ 1: 'Pending', 2: 'Approved', 3: 'Declined', 4: 'Cancelled' }[status] ?? 'Unknown')
export function LeaveStatusBadge({ status }: { status: LeaveRequestStatus }) { return <Badge>{leaveStatusLabel(status)}</Badge> }
