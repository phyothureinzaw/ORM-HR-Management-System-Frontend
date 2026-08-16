import { AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/common/PageHeader'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { Permissions } from '../../../lib/permissions'
import { usePermission } from '../../auth/hooks/usePermission'
import { useMyOvertimeRequest, useOvertimeRequestMutations } from '../hooks/useOvertimeRequests'
import { OvertimeNavigation } from '../components/OvertimeNavigation'
import { approvalStatusLabels, approverTypeLabels, dateText, dayCategoryLabels, durationText, localRange, requestStatusLabels, segmentLabels } from '../utils/overtimeRequestFormatters'

function Detail({ label, value }: { label: string; value: string }) { return <div className="overtime-detail-item"><small>{label}</small><strong>{value}</strong></div> }

export function OvertimeRequestDetailsPage() {
  const { overtimeRequestId } = useParams()
  const navigate = useNavigate()
  const query = useMyOvertimeRequest(overtimeRequestId)
  const mutations = useOvertimeRequestMutations()
  const canRequest = usePermission(Permissions.Overtime.Request)
  const [reason, setReason] = useState('')
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (query.fetchStatus === 'fetching') return <main className="overtime-page"><div className="overtime-loading" role="status">Loading request details...</div></main>
  if (query.isError || !query.data) return <PermissionGuard permission={Permissions.Overtime.View} fallback={<UnauthorizedPage />}><main className="overtime-page"><div className="overtime-alert" role="alert">Request details could not be loaded. <Link className="text-link" to="/overtime">Back to My Overtime</Link></div></main></PermissionGuard>

  const details = canRequest ? query.data : { ...query.data, canEdit: false, canCancel: false }
  const request = details.request
  async function cancel() {
    setConfirmCancel(false)
    try {
      await mutations.cancel.mutateAsync({ id: request.id, request: { cancellationReason: reason.trim() || null, rowVersion: request.rowVersion } })
      toast.success('Overtime request cancelled.')
      void query.refetch()
    } catch (cause) { toast.error(cause instanceof Error ? cause.message : 'Cancellation is no longer available.') }
  }

  return <PermissionGuard permission={Permissions.Overtime.View} fallback={<UnauthorizedPage />}><main className="overtime-page"><OvertimeNavigation /><PageHeader eyebrow="Overtime request" title={request.requestNumber ?? 'Request details'} description="Review request information, relationships, and approval progress." /><div className="overtime-detail-actions"><Link className="text-link" to="/overtime">Back to My Overtime</Link><div className="action-row">{details.canEdit && <Button variant="secondary" onClick={() => navigate(`/overtime/requests/${request.id}/edit`)}>Edit request</Button>}{details.canCancel && <><input aria-label="Cancellation reason" placeholder="Cancellation reason (optional)" value={reason} onChange={(event) => setReason(event.target.value)} /><Button variant="ghost" disabled={mutations.cancel.isPending} onClick={() => setConfirmCancel(true)}>Cancel request</Button></>}</div></div><Card><CardContent><div className="overtime-detail-grid"><Detail label="Status" value={requestStatusLabels[request.status]} /><Detail label="Overtime type" value={request.type.name} /><Detail label="Project" value={request.projectNameSnapshot ?? '—'} /><Detail label="Day category" value={dayCategoryLabels[request.dayCategory]} /><Detail label="Segment" value={segmentLabels[request.segmentType]} /><Detail label="Local date/time" value={localRange(request.startDate, request.startTime, request.endDate, request.endTime)} /><Detail label="Requested duration" value={durationText(request.requestedMinutes)} /><Detail label="Approved duration" value={durationText(request.approvedMinutes)} /><Detail label="Submitted" value={dateText(request.submittedAtUtc.slice(0, 10))} /><Detail label="Cancellation reason" value={details.cancellationReason ?? '—'} /><div className="overtime-detail-wide"><Detail label="Reason" value={details.reason} /><Detail label="Work description" value={details.workDescription ?? '—'} /></div></div></CardContent></Card><div className="overtime-related-grid">{details.parent && <Card><CardContent><h2>Parent evening request</h2><p>{details.parent.requestNumber ?? details.parent.id} · {localRange(details.parent.startDate, details.parent.startTime, details.parent.endDate, details.parent.endTime)} · {details.parent.projectNameSnapshot ?? 'No project'}</p></CardContent></Card>}{details.continuations.length > 0 && <Card><CardContent><h2>Morning continuations</h2>{details.continuations.map((item) => <p key={item.id}>{item.requestNumber ?? item.id} · {localRange(item.startDate, item.startTime, item.endDate, item.endTime)}</p>)}</CardContent></Card>}</div><Card><CardContent><h2>Approval timeline</h2><div className="overtime-timeline">{details.approvals.map((approval) => <div key={approval.id}><strong>Level {approval.levelNumber} · {approverTypeLabels[approval.approverType]}</strong><span>{approvalStatusLabels[approval.status]} · {approval.actedAtUtc ? dateText(approval.actedAtUtc.slice(0, 10)) : 'Pending'}</span><p>{approval.comment ?? '—'}</p></div>)}</div></CardContent></Card>{confirmCancel && <div className="dialog-backdrop"><section className="dialog-panel overtime-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="cancel-overtime-title"><header className="dialog-header"><div><h2 id="cancel-overtime-title">Cancel {request.requestNumber ?? 'this request'}?</h2><p>This will cancel the pending Overtime request and preserve its history.</p></div></header><div className="confirm-copy"><AlertTriangle size={18} aria-hidden="true" />{reason.trim() ? `Reason: ${reason.trim()}` : 'No cancellation reason was provided.'}</div><div className="dialog-actions"><Button type="button" variant="secondary" onClick={() => setConfirmCancel(false)} disabled={mutations.cancel.isPending}>Keep request</Button><Button type="button" className="button-danger" onClick={() => void cancel()} disabled={mutations.cancel.isPending}>{mutations.cancel.isPending ? 'Cancelling…' : 'Confirm cancellation'}</Button></div></section></div>}</main></PermissionGuard>
}
