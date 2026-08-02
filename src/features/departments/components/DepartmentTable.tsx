import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { DepartmentStatusBadge } from './DepartmentStatusBadge'
import type { Department, DepartmentSortField } from '../types/department.types'

type SortableColumn = { label: string; field: DepartmentSortField }
const sortableColumns: SortableColumn[] = [
  { label: 'Code', field: 'Code' },
  { label: 'Department name', field: 'Name' },
  { label: 'Status', field: 'IsActive' },
  { label: 'Updated', field: 'UpdatedAtUtc' },
]

function formatDate(value: string | null) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
}

export function DepartmentTable({ departments, sortBy, sortDirection, onSort, onView, onEdit, onDeactivate, onReactivate, canManage }: {
  departments: Department[]
  sortBy?: DepartmentSortField
  sortDirection: 'asc' | 'desc'
  onSort: (field: DepartmentSortField) => void
  onView: (department: Department) => void
  onEdit: (department: Department) => void
  onDeactivate: (department: Department) => void
  onReactivate: (department: Department) => void
  canManage: boolean
}) {
  function sortIcon(field: DepartmentSortField) {
    if (field !== sortBy) return <ArrowUpDown size={14} aria-hidden="true" />
    return sortDirection === 'asc' ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />
  }

  return <div className="department-table-wrap"><table className="department-table"><caption className="sr-only">Departments</caption><thead><tr>{sortableColumns.map((column) => <th scope="col" key={column.field}><button type="button" className="sort-button" onClick={() => onSort(column.field)} aria-label={`Sort by ${column.label}`} aria-pressed={sortBy === column.field}>{column.label}{sortIcon(column.field)}</button></th>)}<th scope="col">Description</th><th scope="col" className="actions-column">Actions</th></tr></thead><tbody>{departments.map((department) => <tr key={department.id}><td className="department-code">{department.code}</td><th scope="row">{department.name}</th><td><DepartmentStatusBadge active={department.isActive} /></td><td>{formatDate(department.updatedAtUtc)}</td><td className="description-cell">{department.description || '—'}</td><td className="actions-column"><details className="row-actions"><summary aria-label={`Actions for ${department.name}`}><MoreHorizontal size={17} aria-hidden="true" /></summary><div className="row-actions-menu"><button type="button" onClick={() => onView(department)}>View</button>{canManage && <button type="button" onClick={() => onEdit(department)}>Edit</button>}{canManage && (department.isActive ? <button type="button" onClick={() => onDeactivate(department)}>Deactivate</button> : <button type="button" onClick={() => onReactivate(department)}>Reactivate</button>)}</div></details></td></tr>)}</tbody></table></div>
}
