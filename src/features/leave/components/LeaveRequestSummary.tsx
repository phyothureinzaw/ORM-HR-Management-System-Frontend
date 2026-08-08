import { LeaveStatusBadge } from './LeaveStatusBadge'
import type { LeaveRequestDetails } from '../types/leaveRequest.types'

export function LeaveRequestSummary({ details }: { details: LeaveRequestDetails }) {
  const item = details.request
  const portion = (value: number) => value === 1 ? 'Full Day' : value === 2 ? 'First Half' : 'Second Half'
  return <div className="summary-grid"><p><b>Request Number</b>{item.requestNumber ?? item.id}</p><p><b>Employee</b>{item.employee.fullName}</p><p><b>Leave Type</b>{item.leaveType.name}</p><p><b>Dates</b>{item.startDate} - {item.endDate}</p><p><b>Portions</b>{portion(item.startDayPortion)} / {portion(item.endDayPortion)}</p><p><b>Requested days</b>{item.requestedDays}</p><p><b>Status</b><LeaveStatusBadge status={item.status} /></p><p><b>Submitted</b>{new Date(item.submittedAtUtc).toLocaleString()}</p><p className="summary-wide"><b>Reason</b>{details.reason}</p>{details.cancellationReason && <p className="summary-wide"><b>Cancellation reason</b>{details.cancellationReason}</p>}</div>
}
