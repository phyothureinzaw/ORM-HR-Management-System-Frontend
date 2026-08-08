import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { Card, CardContent } from '../../../components/ui/Card'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { LeaveNavigation } from '../components/LeaveNavigation'
import { LeaveRequestForm } from '../components/LeaveRequestForm'
import { useLeaveRequest } from '../hooks/useLeaveRequest'
import { useLeaveRequestOptions } from '../hooks/useLeaveRequestOptions'
import { useLeaveRequestMutations } from '../hooks/useLeaveRequestMutations'
import { toast } from 'sonner'

export function UpdateLeaveRequestPage() {
  const { leaveRequestId } = useParams(); const detail = useLeaveRequest(leaveRequestId); const options = useLeaveRequestOptions(); const mutation = useLeaveRequestMutations(leaveRequestId); const navigate = useNavigate()
  if (detail.isPending || options.isPending) return <p className="leave-loading" role="status">Loading request…</p>
  if (detail.isError || options.isError || !detail.data?.canEdit) return <UnauthorizedPage />
  return <div className="leave-page"><LeaveNavigation /><PageHeader eyebrow="Leave request" title="Update Leave Request" description={`Update ${detail.data.request.requestNumber ?? 'request'} before processing begins.`} /><Card className="leave-surface leave-form-surface"><CardContent><LeaveRequestForm existing={detail.data} options={options.data!} busy={mutation.update.isPending} onSubmit={(input) => mutation.update.mutate({ id: leaveRequestId!, input }, { onSuccess: () => { toast.success('Leave request updated.'); navigate(`/leave/${leaveRequestId}`) }, onError: () => toast.error('The request could not be updated because it may already be processing.') })} /></CardContent></Card></div>
}
