import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { Card, CardContent } from '../../../components/ui/Card'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { Permissions } from '../../../lib/permissions'
import { LeaveNavigation } from '../components/LeaveNavigation'
import { LeaveRequestForm } from '../components/LeaveRequestForm'
import { useLeaveRequestOptions } from '../hooks/useLeaveRequestOptions'
import { useLeaveRequestMutations } from '../hooks/useLeaveRequestMutations'
import type { ApiError } from '../../../lib/api/apiError'
import { toast } from 'sonner'

export function AddLeaveRequestPage() {
  const navigate = useNavigate(); const options = useLeaveRequestOptions(); const mutation = useLeaveRequestMutations(); const [error, setError] = useState<ApiError | null>(null); const data = options.data
  return <PermissionGuard permission={Permissions.Leaves.Request} fallback={<UnauthorizedPage />}><div className="leave-page"><LeaveNavigation /><PageHeader eyebrow="Leave" title="Request Leave" description="Submit time away for approval." />{options.isPending ? <div className="leave-surface leave-skeleton" role="status" aria-label="Loading leave options"><div /><div /><div /></div> : options.isError ? <div className="leave-surface inline-error" role="alert"><h2>Leave options could not be loaded</h2><p>{options.error instanceof Error ? options.error.message : 'Check your connection and try again.'}</p><button className="button button-secondary" onClick={() => void options.refetch()}>Retry</button></div> : !data?.leaveTypes.length ? <div className="leave-surface empty-state"><h2>No leave types available</h2><p>Your company has not configured an active leave type with request options yet. Contact HR or a company administrator.</p></div> : <Card className="leave-surface leave-form-surface"><CardContent><LeaveRequestForm options={data} error={error} busy={mutation.add.isPending} onSubmit={(input) => { setError(null); mutation.add.mutate(input, { onSuccess: (value) => { toast.success(value.request.status === 2 ? 'Leave request automatically approved.' : 'Leave request submitted.'); navigate(`/leave/${value.request.id}`) }, onError: (value) => setError(value as ApiError) }) }} /></CardContent></Card>}</div></PermissionGuard>
}
