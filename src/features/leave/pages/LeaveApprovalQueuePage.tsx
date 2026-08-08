import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { PageHeader } from '../../../components/common/PageHeader'
import { LeaveNavigation } from '../components/LeaveNavigation'
import { LeaveRequestTable } from '../components/LeaveRequestTable'
import { useLeaveApprovalQueue } from '../hooks/useLeaveApprovalQueue'
import type { LeaveRequestFilters } from '../types/leaveRequest.types'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { Permissions } from '../../../lib/permissions'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'

export function LeaveApprovalQueuePage() {
  const [url, setUrl] = useSearchParams(); const filters = useMemo<LeaveRequestFilters>(() => ({ search: url.get('search') || undefined, page: Math.max(1, Number(url.get('page')) || 1), pageSize: 10 }), [url]); const [search, setSearch] = useState(filters.search ?? ''); const query = useLeaveApprovalQueue(filters)
  const update = (change: Partial<LeaveRequestFilters>) => { const next = new URLSearchParams(url); Object.entries({ ...filters, ...change }).forEach(([key, value]) => value === undefined ? next.delete(key) : next.set(key, String(value))); setUrl(next, { replace: true }) }
  return <PermissionGuard permission={Permissions.Leaves.Approve} fallback={<UnauthorizedPage />}><div className="leave-page"><LeaveNavigation /><PageHeader eyebrow="Leave" title="Leave Approval Queue" description="Review leave requests currently waiting for your decision." /><section className="leave-section"><div className="leave-section-heading"><div><h2>Requests awaiting review</h2><p>Only requests assigned to your current approval level appear here.</p></div>{query.data && <span className="section-meta">{query.data.totalCount} pending</span>}</div><Card className="leave-surface"><CardContent><div className="toolbar leave-toolbar"><label className="leave-search">Search<input aria-label="Search approval queue" value={search} onChange={(event) => setSearch(event.target.value)} onBlur={() => update({ search: search || undefined, page: 1 })} placeholder="Request, employee, or leave type" /></label></div>{query.isPending ? <div className="leave-table-skeleton" role="status" aria-label="Loading approval queue"><span /><span /><span /><span /></div> : query.isError ? <div className="inline-error" role="alert"><h2>Approval queue could not be loaded</h2><p>Try again to refresh assigned requests.</p><button className="button button-secondary" onClick={() => void query.refetch()}>Retry</button></div> : query.data?.items.length ? <><LeaveRequestTable items={query.data.items} /><div className="leave-pagination"><span>{query.data.totalCount} requests</span><div><Button size="sm" variant="secondary" disabled={!query.data.hasPreviousPage} onClick={() => update({ page: filters.page - 1 })}>Previous</Button><span>Page {query.data.page} of {Math.max(1, query.data.totalPages)}</span><Button size="sm" variant="secondary" disabled={!query.data.hasNextPage} onClick={() => update({ page: filters.page + 1 })}>Next</Button></div></div></> : <div className="empty-state leave-empty"><h2>No requests awaiting your approval</h2><p>Assigned leave requests will appear here when they need your decision.</p></div>}</CardContent></Card></section></div></PermissionGuard>
}
