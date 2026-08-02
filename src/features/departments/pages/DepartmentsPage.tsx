import { Plus, RefreshCw, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/common/PageHeader'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { usePermission } from '../../auth/hooks/usePermission'
import { Permissions } from '../../../lib/permissions'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { useDepartments } from '../hooks/useDepartments'
import { DeactivateDialog, DepartmentDetailsDialog, DepartmentFormDialog } from '../components/DepartmentDialogs'
import { DepartmentTable } from '../components/DepartmentTable'
import type { Department, DepartmentListParams, DepartmentSortField } from '../types/department.types'

const sortFields: DepartmentSortField[] = ['Code', 'Name', 'CreatedAtUtc', 'UpdatedAtUtc', 'IsActive']
const pageSizes = [10, 20, 50]

function positive(value: string | null, fallback: number) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function parseState(params: URLSearchParams): DepartmentListParams {
  const sortBy = sortFields.includes(params.get('sortBy') as DepartmentSortField) ? params.get('sortBy') as DepartmentSortField : 'Name'
  const pageSize = pageSizes.includes(Number(params.get('pageSize'))) ? Number(params.get('pageSize')) : 10
  return { search: params.get('search')?.trim() || undefined, page: positive(params.get('page'), 1), pageSize, includeInactive: params.get('includeInactive') === 'true', sortBy, sortDirection: params.get('sortDirection') === 'desc' ? 'desc' : 'asc' }
}

function writeState(params: DepartmentListParams) {
  const next = new URLSearchParams()
  if (params.search) next.set('search', params.search)
  next.set('page', String(params.page))
  next.set('pageSize', String(params.pageSize))
  next.set('includeInactive', String(params.includeInactive))
  next.set('sortBy', params.sortBy ?? 'Name')
  next.set('sortDirection', params.sortDirection)
  return next
}

export function DepartmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const parsed = useMemo(() => parseState(searchParams), [searchParams])
  const [searchText, setSearchText] = useState(parsed.search ?? '')
  const [dialog, setDialog] = useState<{ type: 'add' | 'view' | 'edit' | 'deactivate' | 'reactivate'; department?: Department } | null>(null)
  const canManage = usePermission(Permissions.Departments.Manage)
  const query = useDepartments(parsed)

  useEffect(() => { setSearchText(parsed.search ?? '') }, [parsed.search])
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchText.trim() === (parsed.search ?? '')) return
      setSearchParams(writeState({ ...parsed, search: searchText.trim() || undefined, page: 1 }), { replace: true })
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchText, parsed, setSearchParams])
  useEffect(() => {
    if (query.data && query.data.totalPages > 0 && parsed.page > query.data.totalPages) {
      setSearchParams(writeState({ ...parsed, page: query.data.totalPages }), { replace: true })
    }
  }, [parsed, query.data, setSearchParams])

  function updateState(change: Partial<DepartmentListParams>) {
    setSearchParams(writeState({ ...parsed, ...change }), { replace: true })
  }

  function sort(field: DepartmentSortField) {
    updateState({ sortBy: field, sortDirection: parsed.sortBy === field && parsed.sortDirection === 'asc' ? 'desc' : 'asc', page: 1 })
  }

  const apiStatus = (query.error as { status?: number } | null)?.status
  return <PermissionGuard permission={Permissions.Departments.View} fallback={<UnauthorizedPage />}><div><PageHeader eyebrow="Organization" title="Departments" description="Manage your company’s departments and organizational structure." action={canManage ? <Button onClick={() => setDialog({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Add department</Button> : undefined} /><Card><CardContent><div className="department-toolbar"><label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search departments</span><input value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search by code or name" aria-label="Search departments" />{searchText && <button type="button" aria-label="Clear search" onClick={() => setSearchText('')}>×</button>}</label><label className="filter-field"><SlidersHorizontal size={16} aria-hidden="true" /><span className="sr-only">Department status</span><select aria-label="Department status" value={parsed.includeInactive ? 'all' : 'active'} onChange={(event) => updateState({ includeInactive: event.target.value === 'all', page: 1 })}><option value="active">Active only</option><option value="all">All departments</option></select></label>{query.isFetching && <span className="fetching-indicator" role="status"><RefreshCw size={14} className="spin" aria-hidden="true" /> Updating</span>}</div>{query.isError ? apiStatus === 403 ? <UnauthorizedPage /> : <div className="inline-error" role="alert"><h2>Departments could not be loaded</h2><p>{apiStatus ? 'The server could not complete this request.' : 'Check your connection and try again.'}</p><Button variant="secondary" onClick={() => void query.refetch()}>Retry</Button></div> : query.isPending ? <div className="department-table-wrap"><DepartmentSkeleton /></div> : query.data && query.data.items.length === 0 ? <div className="empty-state"><div className="empty-icon"><SlidersHorizontal size={21} aria-hidden="true" /></div><h2>{parsed.search || parsed.includeInactive ? 'No departments found' : 'No departments yet'}</h2><p>{parsed.search || parsed.includeInactive ? 'Try adjusting your search or filters.' : 'Create your first department to begin organizing employees.'}</p>{(parsed.search || parsed.includeInactive) ? <Button variant="secondary" onClick={() => { setSearchText(''); updateState({ search: undefined, includeInactive: false, page: 1 }) }}>Clear filters</Button> : canManage ? <Button onClick={() => setDialog({ type: 'add' })}><Plus size={16} aria-hidden="true" /> Add department</Button> : null}</div> : <><DepartmentTable departments={query.data?.items ?? []} sortBy={parsed.sortBy} sortDirection={parsed.sortDirection} onSort={sort} onView={(department) => setDialog({ type: 'view', department })} onEdit={(department) => setDialog({ type: 'edit', department })} onDeactivate={(department) => setDialog({ type: 'deactivate', department })} onReactivate={(department) => setDialog({ type: 'reactivate', department })} canManage={canManage} /><div className="department-pagination"><span>{query.data.totalCount} department{query.data.totalCount === 1 ? '' : 's'} · Page {query.data.page} of {Math.max(query.data.totalPages, 1)}</span><label>Rows <select aria-label="Rows per page" value={parsed.pageSize} onChange={(event) => updateState({ pageSize: Number(event.target.value), page: 1 })}>{pageSizes.map((size) => <option value={size} key={size}>{size}</option>)}</select></label><div className="pagination-buttons"><Button size="sm" variant="secondary" disabled={!query.data.hasPreviousPage} onClick={() => updateState({ page: Math.max(1, query.data.page - 1) })}>Previous</Button><Button size="sm" variant="secondary" disabled={!query.data.hasNextPage} onClick={() => updateState({ page: query.data.page + 1 })}>Next</Button></div></div></>}</CardContent></Card>{dialog?.type === 'add' && canManage && <DepartmentFormDialog onClose={() => setDialog(null)} />}{dialog?.type === 'edit' && dialog.department && canManage && <DepartmentFormDialog department={dialog.department} onClose={() => setDialog(null)} />}{dialog?.type === 'view' && dialog.department && <DepartmentDetailsDialog department={dialog.department} canManage={canManage} onEdit={(department) => setDialog({ type: 'edit', department })} onClose={() => setDialog(null)} />}{dialog?.type === 'deactivate' && dialog.department && canManage && <DeactivateDialog department={dialog.department} onClose={() => setDialog(null)} />}{dialog?.type === 'reactivate' && dialog.department && canManage && <DeactivateDialog department={dialog.department} onReactivate onClose={() => setDialog(null)} />}</div></PermissionGuard>
}

function DepartmentSkeleton() {
  return <div className="department-skeleton" aria-label="Loading departments" role="status">{Array.from({ length: 5 }, (_, index) => <div className="skeleton-row" key={index}><span /><span /><span /><span /><span /><span /></div>)}</div>
}
