import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { useDepartment } from '../hooks/useDepartments'
import { useDepartmentMutations } from '../hooks/useDepartmentMutations'
import { defaultDepartmentForm, departmentSchema, type DepartmentFormValues } from '../schemas/departmentSchema'
import { DepartmentStatusBadge } from './DepartmentStatusBadge'
import type { Department } from '../types/department.types'
import type { ApiError } from '../../../lib/api/apiError'
import { toast } from 'sonner'

type DialogProps = { onClose: () => void }
const departmentFields = ['code', 'name', 'description', 'isActive'] as const

function mapDepartmentValidation(error: unknown, setError: ReturnType<typeof useForm<DepartmentFormValues>>['setError']) {
  const errors = (error as ApiError).problem?.errors
  if (!errors) return false
  let mapped = false
  Object.entries(errors).forEach(([key, messages]) => {
    const field = departmentFields.find((candidate) => candidate.toLowerCase() === key.toLowerCase())
    if (field) {
      setError(field, { type: 'server', message: messages?.[0] ?? 'Check this value.' })
      mapped = true
    }
  })
  return mapped
}

function DialogFrame({ title, description, onClose, children }: DialogProps & { title: string; description: string; children: ReactNode }) {
  const panelRef = useRef<HTMLElement>(null)
  useEffect(() => {
    const panel = panelRef.current
    const focusable = panel?.querySelector<HTMLElement>('button, input, textarea, select, [tabindex]:not([tabindex="-1"])')
    focusable?.focus()
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panel) return
      const elements = Array.from(panel.querySelectorAll<HTMLElement>('button, input, textarea, select, [tabindex]:not([tabindex="-1"])'))
      if (!elements.length) return
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="dialog-backdrop" role="presentation"><section ref={panelRef} className="dialog-panel" role="dialog" aria-modal="true" aria-labelledby="department-dialog-title" aria-describedby="department-dialog-description"><div className="dialog-header"><div><h2 id="department-dialog-title">{title}</h2><p id="department-dialog-description">{description}</p></div><button type="button" className="icon-button" aria-label="Close dialog" onClick={onClose}><X size={18} /></button></div>{children}</section></div>
}

function Field({ label, name, register, error, maxLength, value, required = false }: { label: string; name: 'code' | 'name' | 'description'; register: ReturnType<typeof useForm<DepartmentFormValues>>['register']; error?: string; maxLength: number; value?: string; required?: boolean }) {
  const id = `department-${name}`
  return <div className="form-field"><label htmlFor={id}>{label}{required && <span className="required-mark">*</span>}</label>{name === 'description' ? <textarea id={id} rows={4} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...register(name)} /> : <input id={id} autoFocus={name === 'code'} maxLength={maxLength} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...register(name)} />}{value !== undefined && <small className="character-count">{value.length}/{maxLength}</small>}{error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}</div>
}

export function DepartmentFormDialog({ department, onClose }: DialogProps & { department?: Department }) {
  const { add, update } = useDepartmentMutations()
  const isEdit = Boolean(department)
  const form = useForm<DepartmentFormValues>({ resolver: zodResolver(departmentSchema), defaultValues: department ? { code: department.code, name: department.name, description: department.description ?? '', isActive: department.isActive } : defaultDepartmentForm, mode: 'onBlur' })
  const description = form.watch('description')

  useEffect(() => { form.reset(department ? { code: department.code, name: department.name, description: department.description ?? '', isActive: department.isActive } : defaultDepartmentForm) }, [department, form])

  async function submit(values: DepartmentFormValues) {
    form.clearErrors('root')
    const request = { code: values.code.trim().toUpperCase(), name: values.name.trim(), description: values.description.trim() || null }
    try {
      if (department) await update.mutateAsync({ id: department.id, request: { ...request, isActive: values.isActive } })
      else await add.mutateAsync(request)
      toast.success(department ? 'Department updated.' : 'Department added.')
      onClose()
    } catch (error) {
      if (mapDepartmentValidation(error, form.setError)) return
      const apiError = error as ApiError
      form.setError('root', { type: 'server', message: apiError.status === 409 ? (apiError.message || 'A department with the same code or name already exists.') : apiError.status === 403 ? 'You do not have permission to manage departments.' : 'The department could not be saved. Please try again.' })
    }
  }

  const rootError = form.formState.errors.root?.message
  return <DialogFrame title={isEdit ? 'Edit department' : 'Add department'} description={isEdit ? 'Update department details and status.' : 'Add a department to your company structure.'} onClose={onClose}><form className="department-form" onSubmit={(event) => void form.handleSubmit(submit)(event)} noValidate aria-busy={form.formState.isSubmitting}>{rootError && <Alert className="form-alert">{rootError}</Alert>}<Field label="Code" name="code" register={form.register} error={form.formState.errors.code?.message} maxLength={30} required /><Field label="Name" name="name" register={form.register} error={form.formState.errors.name?.message} maxLength={150} required /><Field label="Description" name="description" register={form.register} error={form.formState.errors.description?.message} maxLength={300} value={description} />{isEdit && <label className="checkbox-field"><input type="checkbox" {...form.register('isActive')} /> Active department</label>}<div className="dialog-actions"><Button type="button" variant="secondary" onClick={onClose}>Cancel</Button><Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Saving…' : isEdit ? 'Save changes' : 'Add department'}</Button></div></form></DialogFrame>
}

export function DepartmentDetailsDialog({ department, onClose, canManage, onEdit }: DialogProps & { department: Department; canManage: boolean; onEdit: (department: Department) => void }) {
  const detail = useDepartment(department.id)
  const value = detail.data ?? department
  const detailStatus = (detail.error as ApiError | null)?.status
  return <DialogFrame title={value.name} description="Department details" onClose={onClose}>{detail.isLoading ? <div className="dialog-loading" role="status">Loading department details…</div> : detail.isError ? <Alert className="form-alert">{detailStatus === 404 ? 'This department no longer exists.' : 'This department could not be loaded. Please close and try again.'}</Alert> : <div className="detail-list"><div><dt>Code</dt><dd>{value.code}</dd></div><div><dt>Status</dt><dd><DepartmentStatusBadge active={value.isActive} /></dd></div><div><dt>Description</dt><dd>{value.description || '—'}</dd></div><div><dt>Created</dt><dd>{new Date(value.createdAtUtc).toLocaleString()}</dd></div><div><dt>Updated</dt><dd>{value.updatedAtUtc ? new Date(value.updatedAtUtc).toLocaleString() : '—'}</dd></div></div>}{canManage && <div className="dialog-actions"><Button type="button" variant="secondary" onClick={() => onEdit(value)}>Edit</Button><Button type="button" onClick={onClose}>Close</Button></div>}</DialogFrame>
}

export function DeactivateDialog({ department, onClose, onReactivate }: DialogProps & { department: Department; onReactivate?: boolean }) {
  const { deactivate, update } = useDepartmentMutations()
  const isReactivate = Boolean(onReactivate)
  const [error, setError] = useState('')
  async function confirm() {
    setError('')
    try {
      if (isReactivate) await update.mutateAsync({ id: department.id, request: { code: department.code, name: department.name, description: department.description, isActive: true } })
      else await deactivate.mutateAsync(department.id)
      toast.success(isReactivate ? 'Department reactivated.' : 'Department deactivated.')
      onClose()
    } catch (value) {
      const apiError = value as ApiError
      setError(apiError.status === 409 ? (apiError.message || (isReactivate ? 'The department could not be reactivated.' : 'This department cannot be deactivated while it contains active employees.')) : apiError.status === 403 ? 'You do not have permission to manage departments.' : 'The department action could not be completed.')
    }
  }
  const pending = deactivate.isPending || update.isPending
  return <DialogFrame title={`${isReactivate ? 'Reactivate' : 'Deactivate'} ${department.name}?`} description={isReactivate ? 'This department will return to active department lists.' : 'This department will no longer appear in active lists. Existing records will be preserved.'} onClose={onClose}><div className="confirm-copy"><AlertTriangle size={22} aria-hidden="true" /><p>{error || (isReactivate ? `Reactivate ${department.code}?` : `Deactivate ${department.code}?`)}</p></div><div className="dialog-actions"><Button type="button" variant="secondary" onClick={onClose} disabled={pending}>Cancel</Button><Button type="button" className="button-danger" onClick={() => void confirm()} disabled={pending}>{pending ? 'Working…' : isReactivate ? 'Reactivate' : 'Deactivate'}</Button></div></DialogFrame>
}
