import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { createPortal } from 'react-dom'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
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

  return <div className="department-table-wrap"><table className="department-table"><caption className="sr-only">Departments</caption><thead><tr>{sortableColumns.map((column) => <th scope="col" key={column.field}><button type="button" className="sort-button" onClick={() => onSort(column.field)} aria-label={`Sort by ${column.label}`} aria-pressed={sortBy === column.field}>{column.label}{sortIcon(column.field)}</button></th>)}<th scope="col">Description</th><th scope="col" className="actions-column">Actions</th></tr></thead><tbody>{departments.map((department) => <tr key={department.id}><td className="department-code">{department.code}</td><th scope="row">{department.name}</th><td><DepartmentStatusBadge active={department.isActive} /></td><td>{formatDate(department.updatedAtUtc)}</td><td className="description-cell">{department.description || '—'}</td><td className="actions-column"><ActionMenu department={department} canManage={canManage} onView={onView} onEdit={onEdit} onDeactivate={onDeactivate} onReactivate={onReactivate} /></td></tr>)}</tbody></table></div>
}

function ActionMenu({ department, canManage, onView, onEdit, onDeactivate, onReactivate }: {
  department: Department
  canManage: boolean
  onView: (department: Department) => void
  onEdit: (department: Department) => void
  onDeactivate: (department: Department) => void
  onReactivate: (department: Department) => void
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!open || !triggerRef.current || !menuRef.current) return
    const trigger = triggerRef.current.getBoundingClientRect()
    const menu = menuRef.current.getBoundingClientRect()
    const gap = 6
    const top = trigger.bottom + gap + menu.height <= window.innerHeight ? trigger.bottom + gap : trigger.top - menu.height - gap
    const left = Math.min(Math.max(8, trigger.right - menu.width), window.innerWidth - menu.width - 8)
    setPosition({ top: Math.max(8, top), left })
  }, [open])

  useEffect(() => {
    if (!open) return
    function closeOnOutside(event: MouseEvent) {
      const target = event.target as Node
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false)
    }
    function closeOnKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setOpen(false); triggerRef.current?.focus() }
    }
    function closeOnScroll() { setOpen(false) }
    document.addEventListener('mousedown', closeOnOutside)
    document.addEventListener('keydown', closeOnKey)
    window.addEventListener('scroll', closeOnScroll, true)
    return () => {
      document.removeEventListener('mousedown', closeOnOutside)
      document.removeEventListener('keydown', closeOnKey)
      window.removeEventListener('scroll', closeOnScroll, true)
    }
  }, [open])

  function choose(action: () => void) {
    setOpen(false)
    action()
  }

  return <><button ref={triggerRef} type="button" className="row-actions-trigger" aria-label={`Actions for ${department.name}`} aria-expanded={open} onClick={() => setOpen((value) => !value)}><MoreHorizontal size={17} aria-hidden="true" /></button>{open && createPortal(<div ref={menuRef} className="row-actions-menu row-actions-menu-floating" role="menu" style={{ top: position.top, left: position.left }}><button type="button" role="menuitem" onClick={() => choose(() => onView(department))}>View</button>{canManage && <button type="button" role="menuitem" onClick={() => choose(() => onEdit(department))}>Edit</button>}{canManage && (department.isActive ? <button type="button" role="menuitem" onClick={() => choose(() => onDeactivate(department))}>Deactivate</button> : <button type="button" role="menuitem" onClick={() => choose(() => onReactivate(department))}>Reactivate</button>)}</div>, document.body)}</>
}
