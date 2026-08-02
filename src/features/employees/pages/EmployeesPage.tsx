import { Filter, Plus, RefreshCw, Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/common/PageHeader'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { usePermission } from '../../auth/hooks/usePermission'
import { Permissions } from '../../../lib/permissions'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { useEmployeeFormOptions, useEmployees } from '../hooks/useEmployees'
import { EmployeeTable } from '../components/EmployeeTable'
import { EmployeeLifecycleDialog, EmployeeLoginDialog, EmployeeLoginStateDialog } from '../components/EmployeeDialogs'
import type { Employee, EmployeeListParams, EmployeeSortField, EmploymentStatus } from '../types/employee.types'

const pageSizes = [10, 20, 50]
const sortFields: EmployeeSortField[] = ['EmployeeCode', 'FirstName', 'LastName', 'WorkEmail', 'JobTitle', 'EmploymentDate', 'EmploymentStatus', 'CreatedAtUtc', 'UpdatedAtUtc']

function parse(params: URLSearchParams): EmployeeListParams {
  const status = Number(params.get('employmentStatus'))
  return {
    search: params.get('search')?.trim() || undefined,
    page: Number.isInteger(Number(params.get('page'))) && Number(params.get('page')) > 0 ? Number(params.get('page')) : 1,
    pageSize: pageSizes.includes(Number(params.get('pageSize'))) ? Number(params.get('pageSize')) : 10,
    departmentId: params.get('departmentId') || undefined,
    managerId: params.get('managerId') || undefined,
    roleId: params.get('roleId') || undefined,
    employmentStatus: [1, 2, 3].includes(status) ? status as EmploymentStatus : undefined,
    hasLoginAccount: params.get('hasLoginAccount') === 'true' ? true : params.get('hasLoginAccount') === 'false' ? false : undefined,
    includeInactive: params.get('includeInactive') === 'true',
    sortBy: sortFields.includes(params.get('sortBy') as EmployeeSortField) ? params.get('sortBy') as EmployeeSortField : 'EmployeeCode',
    sortDirection: params.get('sortDirection') === 'desc' ? 'desc' : 'asc',
  }
}

function write(params: EmployeeListParams) {
  const next = new URLSearchParams()
  if (params.search) next.set('search', params.search)
  if (params.departmentId) next.set('departmentId', params.departmentId)
  if (params.managerId) next.set('managerId', params.managerId)
  if (params.roleId) next.set('roleId', params.roleId)
  if (params.employmentStatus) next.set('employmentStatus', String(params.employmentStatus))
  if (params.hasLoginAccount !== undefined) next.set('hasLoginAccount', String(params.hasLoginAccount))
  next.set('includeInactive', String(params.includeInactive)); next.set('page', String(params.page)); next.set('pageSize', String(params.pageSize)); next.set('sortBy', params.sortBy); next.set('sortDirection', params.sortDirection)
  return next
}

export function EmployeesPage() {
  const [url, setUrl] = useSearchParams(); const state = useMemo(() => parse(url), [url]); const [searchText, setSearchText] = useState(state.search ?? ''); const [selected, setSelected] = useState<{ employee: Employee; action: 'deactivate' | 'reactivate' | 'create' | 'update' | 'disable' | 'enable' } | null>(null); const navigate = useNavigate(); const location = useLocation(); const canManage = usePermission(Permissions.Employees.Manage); const query = useEmployees(state); const options = useEmployeeFormOptions()
  useEffect(() => { setSearchText(state.search ?? '') }, [state.search])
  useEffect(() => { const timer = window.setTimeout(() => { if (searchText.trim() !== (state.search ?? '')) setUrl(write({ ...state, search: searchText.trim() || undefined, page: 1 }), { replace: true }) }, 350); return () => window.clearTimeout(timer) }, [searchText, state, setUrl])
  useEffect(() => { if (query.data && query.data.totalPages > 0 && state.page > query.data.totalPages) setUrl(write({ ...state, page: query.data.totalPages }), { replace: true }) }, [query.data, state, setUrl])
  function update(change: Partial<EmployeeListParams>) { setUrl(write({ ...state, ...change }), { replace: true }) }
  function navigateTo(path: string) { navigate(path, { state: { from: `${location.pathname}${location.search}` } }) }
  const activeFilterCount = [state.search, state.departmentId, state.managerId, state.roleId, state.employmentStatus, state.hasLoginAccount !== undefined ? 'login' : undefined, state.includeInactive ? 'inactive' : undefined].filter(Boolean).length
  const clearFilters = () => { setSearchText(''); update({ search: undefined, departmentId: undefined, managerId: undefined, roleId: undefined, employmentStatus: undefined, hasLoginAccount: undefined, includeInactive: false, page: 1 }) }
  const apiStatus = (query.error as { status?: number } | null)?.status
  return <PermissionGuard permission={Permissions.Employees.View} fallback={<UnauthorizedPage />}><div><PageHeader eyebrow="People" title="Employees" description="Manage employee records, assignments, and account access." action={canManage ? <Button onClick={() => navigateTo('/employees/new')}><Plus size={16} aria-hidden="true" /> Add employee</Button> : undefined} /><Card><CardContent><div className="employee-toolbar"><label className="search-field"><Search size={17} aria-hidden="true" /><span className="sr-only">Search employees</span><input aria-label="Search employees" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="Search name, code, email, or job title" />{searchText && <button type="button" aria-label="Clear search" onClick={() => setSearchText('')}><X size={15} /></button>}</label><FilterSelect label="Department filter" value={state.departmentId ?? ''} onChange={(value) => update({ departmentId: value || undefined, page: 1 })} options={(options.data?.departments ?? []).map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))} placeholder="All departments" /><FilterSelect label="Manager filter" value={state.managerId ?? ''} onChange={(value) => update({ managerId: value || undefined, page: 1 })} options={(options.data?.managers ?? []).map((item) => ({ value: item.id, label: item.fullName }))} placeholder="All managers" /><FilterSelect label="Role filter" value={state.roleId ?? ''} onChange={(value) => update({ roleId: value || undefined, page: 1 })} options={(options.data?.roles ?? []).map((item) => ({ value: item.id, label: item.name }))} placeholder="All roles" /><FilterSelect label="Employment status filter" value={state.employmentStatus ? String(state.employmentStatus) : ''} onChange={(value) => update({ employmentStatus: value ? Number(value) as EmploymentStatus : undefined, page: 1 })} options={(options.data?.employmentStatuses ?? []).map((item) => ({ value: String(item.value), label: item.name }))} placeholder="All employment statuses" /><FilterSelect label="Login account filter" value={state.hasLoginAccount === undefined ? '' : String(state.hasLoginAccount)} onChange={(value) => update({ hasLoginAccount: value === '' ? undefined : value === 'true', page: 1 })} options={[{ value: 'true', label: 'Has login account' }, { value: 'false', label: 'No login account' }]} placeholder="Any login access" /><FilterSelect label="Employee visibility" value={state.includeInactive ? 'all' : 'active'} onChange={(value) => update({ includeInactive: value === 'all', page: 1 })} options={[{ value: 'active', label: 'Active employees' }, { value: 'all', label: 'All employees' }]} /><span className="filter-icon" aria-hidden="true"><Filter size={16} /></span>{activeFilterCount > 0 && <Button size="sm" variant="ghost" onClick={clearFilters}>Clear filters</Button>}{query.isFetching && <span className="fetching-indicator" role="status"><RefreshCw size={14} className="spin" aria-hidden="true" /> Updating</span>}</div>{query.isError ? apiStatus === 403 ? <UnauthorizedPage /> : <div className="inline-error" role="alert"><h2>Employees could not be loaded</h2><p>{apiStatus ? 'The server could not complete this request.' : 'Check your connection and try again.'}</p><Button variant="secondary" onClick={() => void query.refetch()}>Retry</Button></div> : query.isPending ? <EmployeeSkeleton /> : query.data && query.data.items.length === 0 ? <div className="empty-state"><div className="empty-icon"><Filter size={21} aria-hidden="true" /></div><h2>{activeFilterCount ? 'No employees found' : 'No employees yet'}</h2><p>{activeFilterCount ? 'Try adjusting your search or filters.' : 'Add your first employee to start building your company directory.'}</p>{activeFilterCount ? <Button variant="secondary" onClick={clearFilters}>Clear filters</Button> : canManage ? <Button onClick={() => navigateTo('/employees/new')}><Plus size={16} aria-hidden="true" /> Add employee</Button> : null}</div> : <><EmployeeTable employees={query.data.items} sortBy={state.sortBy} sortDirection={state.sortDirection} canManage={canManage} onSort={(field) => update({ sortBy: field, sortDirection: state.sortBy === field && state.sortDirection === 'asc' ? 'desc' : 'asc', page: 1 })} onView={(employee) => navigateTo(`/employees/${employee.id}`)} onEdit={(employee) => navigateTo(`/employees/${employee.id}/edit`)} onDeactivate={(employee) => setSelected({ employee, action: 'deactivate' })} onReactivate={(employee) => setSelected({ employee, action: 'reactivate' })} onCreateLogin={(employee) => setSelected({ employee, action: 'create' })} onUpdateLogin={(employee) => setSelected({ employee, action: 'update' })} onDisableLogin={(employee) => setSelected({ employee, action: 'disable' })} onEnableLogin={(employee) => setSelected({ employee, action: 'enable' })} /><div className="department-pagination"><span>{query.data.totalCount} employee{query.data.totalCount === 1 ? '' : 's'} · Page {query.data.page} of {Math.max(query.data.totalPages, 1)}</span><label>Rows <select aria-label="Rows per page" value={state.pageSize} onChange={(event) => update({ pageSize: Number(event.target.value), page: 1 })}>{pageSizes.map((size) => <option value={size} key={size}>{size}</option>)}</select></label><div className="pagination-buttons"><Button size="sm" variant="secondary" disabled={!query.data.hasPreviousPage} onClick={() => update({ page: query.data.page - 1 })}>Previous</Button><Button size="sm" variant="secondary" disabled={!query.data.hasNextPage} onClick={() => update({ page: query.data.page + 1 })}>Next</Button></div></div></>}</CardContent></Card>{selected?.action === 'deactivate' && <EmployeeLifecycleDialog employee={selected.employee} action="deactivate" onClose={() => setSelected(null)} />}{selected?.action === 'reactivate' && <EmployeeLifecycleDialog employee={selected.employee} action="reactivate" onClose={() => setSelected(null)} />}{(selected?.action === 'create' || selected?.action === 'update') && options.data && <EmployeeLoginDialog employee={selected.employee} action={selected.action} options={options.data} onClose={() => setSelected(null)} />}{(selected?.action === 'disable' || selected?.action === 'enable') && <EmployeeLoginStateDialog employee={selected.employee} action={selected.action} onClose={() => setSelected(null)} />}</div></PermissionGuard>
}

function FilterSelect({ label, value, onChange, options, placeholder }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; placeholder?: string }) { return <label className="filter-field"><span className="sr-only">{label}</span><select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>{placeholder && <option value="">{placeholder}</option>}{options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label> }
function EmployeeSkeleton() { return <div className="department-skeleton" aria-label="Loading employees" role="status">{Array.from({ length: 6 }, (_, index) => <div className="employee-skeleton-row" key={index}><span /><span /><span /><span /><span /><span /><span /><span /></div>)}</div> }
