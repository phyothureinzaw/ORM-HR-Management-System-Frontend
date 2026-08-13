import { Edit3, Plus, ToggleLeft, ToggleRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '../../../components/ui/Button'
import { Card, CardContent } from '../../../components/ui/Card'
import { PageHeader } from '../../../components/common/PageHeader'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { Permissions } from '../../../lib/permissions'
import { useOvertimeApproval, useOvertimeConfigurationMutations } from '../hooks/useOvertimeConfiguration'
import type { ApprovalLevelInput, ApprovalSettingsInput, ApproverType } from '../types/overtime.types'

const approverNames: Record<ApproverType, string> = { 1: 'Employee manager', 2: 'Role', 3: 'Specific employee' }
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'The request could not be completed.'

export function OvertimeApprovalPage() {
  const navigate = useNavigate()
  const query = useOvertimeApproval()
  const mutations = useOvertimeConfigurationMutations()
  const [settings, setSettings] = useState<ApprovalSettingsInput | null>(null)
  const [error, setError] = useState('')
  useEffect(() => { if (query.settings.data) setSettings(query.settings.data) }, [query.settings.data])
  async function saveSettings(event: React.FormEvent) {
    event.preventDefault()
    if (!settings) return
    setError('')
    try { await mutations.updateApprovalSettings.mutateAsync(settings); toast.success('Approval settings saved.') } catch (cause) { setError(errorMessage(cause)) }
  }
  const levels = query.levels.data ?? []
  return <PermissionGuard permission={Permissions.Overtime.Manage}><main className="overtime-page">
    <PageHeader eyebrow="Configuration" title="Overtime Approval" description="Configure approval levels for Overtime requests." action={<Button onClick={() => navigate('/overtime/approval/levels/new')}><Plus size={16} /> Add Level</Button>} />
    {error && <div className="overtime-alert" role="alert">{error}</div>}
    <Card><CardContent><form className="overtime-approval-settings" onSubmit={(event) => void saveSettings(event)}>
      <label className="overtime-toggle"><span><strong>Enable approval</strong><small>Requests follow the configured active levels.</small></span><input type="checkbox" checked={settings?.isEnabled ?? false} onChange={(event) => setSettings((value) => value ? { ...value, isEnabled: event.target.checked } : value)} /></label>
      <label>Required levels<input type="number" min="1" max="5" value={settings?.requiredLevels ?? 1} onChange={(event) => setSettings((value) => value ? { ...value, requiredLevels: Number(event.target.value) } : value)} /></label>
      <Button type="submit" disabled={!settings}>Save Approval Settings</Button>
    </form></CardContent></Card>
    <Card><CardContent><div className="overtime-table-wrap"><table className="overtime-table"><thead><tr><th>Level</th><th>Name</th><th>Approver type</th><th>Reference</th><th>Status</th><th /></tr></thead><tbody>
      {levels.map((level) => <tr key={level.id}><td>{level.levelNumber}</td><td>{level.name}</td><td>{approverNames[level.approverType]}</td><td>{level.approverEmployee?.fullName ?? level.approverRole?.name ?? 'Manager relationship'}</td><td><span className={`overtime-status ${level.isActive ? 'is-active' : 'is-inactive'}`}>{level.isActive ? 'Active' : 'Inactive'}</span></td><td><div className="overtime-actions"><Button variant="ghost" aria-label={`Edit level ${level.levelNumber}`} onClick={() => navigate(`/overtime/approval/levels/${level.id}/edit`)}><Edit3 size={16} /></Button><Button variant="ghost" aria-label={`${level.isActive ? 'Deactivate' : 'Activate'} level ${level.levelNumber}`} onClick={() => void (level.isActive ? mutations.deactivateLevel.mutateAsync(level.id) : mutations.activateLevel.mutateAsync(level.id)).then(() => toast.success(`Level ${level.isActive ? 'deactivated' : 'activated'}.`)).catch((cause) => setError(errorMessage(cause)))}>{level.isActive ? <ToggleLeft size={18} /> : <ToggleRight size={18} />}</Button></div></td></tr>)}
    </tbody></table>{query.levels.isPending && <div className="overtime-loading">Loading approval levels...</div>}{!query.levels.isPending && levels.length === 0 && <div className="overtime-empty">No approval levels configured.</div>}</div></CardContent></Card>
  </main></PermissionGuard>
}

export function OvertimeApprovalLevelFormPage() {
  const navigate = useNavigate()
  const { approvalLevelId } = useParams()
  const query = useOvertimeApproval()
  const mutations = useOvertimeConfigurationMutations()
  const existing = query.levels.data?.find((level) => level.id === approvalLevelId)
  const [form, setForm] = useState<ApprovalLevelInput & { isActive: boolean; rowVersion: string }>({ levelNumber: 1, name: '', approverType: 1, approverRoleId: null, approverEmployeeId: null, isActive: true, rowVersion: '' })
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [error, setError] = useState('')
  const options = query.options.data
  useEffect(() => { if (existing) { const validRoleId = options?.roles.some((role) => role.id === existing.approverRole?.id) ? existing.approverRole?.id ?? null : null; const validEmployeeId = options?.employees.some((employee) => employee.id === existing.approverEmployee?.id) ? existing.approverEmployee?.id ?? null : null; setForm({ levelNumber: existing.levelNumber, name: existing.name, approverType: existing.approverType, approverRoleId: validRoleId, approverEmployeeId: validEmployeeId, isActive: existing.isActive, rowVersion: existing.rowVersion }); setEmployeeSearch(validEmployeeId ? existing.approverEmployee?.fullName ?? '' : '') } }, [existing, options])
  const employees = (options?.employees ?? []).filter((employee) => `${employee.employeeCode} ${employee.fullName} ${employee.jobTitle ?? ''}`.toLowerCase().includes(employeeSearch.toLowerCase()))
  const changeType = (approverType: ApproverType) => setForm((value) => ({ ...value, approverType, approverRoleId: null, approverEmployeeId: null }))
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError('')
    if (!form.name.trim()) return setError('Level name is required.')
    if (form.levelNumber < 1 || form.levelNumber > 5) return setError('Approval level must be between 1 and 5.')
    if (form.approverType === 2 && !form.approverRoleId) return setError('Select a role.')
    if (form.approverType === 3 && !form.approverEmployeeId) return setError('Select an employee.')
    const request = approvalLevelId
      ? { levelNumber: form.levelNumber, name: form.name.trim(), approverType: form.approverType, approverRoleId: form.approverType === 2 ? form.approverRoleId : null, approverEmployeeId: form.approverType === 3 ? form.approverEmployeeId : null, isActive: form.isActive, rowVersion: form.rowVersion }
      : { levelNumber: form.levelNumber, name: form.name.trim(), approverType: form.approverType, approverRoleId: form.approverType === 2 ? form.approverRoleId : null, approverEmployeeId: form.approverType === 3 ? form.approverEmployeeId : null }
    try { if (approvalLevelId) await mutations.updateLevel.mutateAsync({ id: approvalLevelId, request: request as ApprovalLevelInput & { isActive: boolean; rowVersion: string } }); else await mutations.addLevel.mutateAsync(request); toast.success(`Approval level ${approvalLevelId ? 'updated' : 'created'}.`); navigate('/overtime/approval') } catch (cause) { setError(errorMessage(cause)) }
  }
  return <PermissionGuard permission={Permissions.Overtime.Manage}><main className="overtime-page"><PageHeader eyebrow="Overtime Approval" title={approvalLevelId ? 'Edit Approval Level' : 'Add Approval Level'} description="Levels must remain contiguous and use valid company-scoped approvers." /><Card><CardContent><form className="overtime-form" onSubmit={(event) => void submit(event)} noValidate>
    {error && <div className="overtime-alert" role="alert">{error}</div>}<div className="overtime-form-grid"><label>Level number<input type="number" min="1" max="5" value={form.levelNumber} onChange={(event) => setForm((value) => ({ ...value, levelNumber: Number(event.target.value) }))} /></label><label>Level name<input value={form.name} maxLength={100} onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))} /></label><label>Approver type<select value={form.approverType} onChange={(event) => changeType(Number(event.target.value) as ApproverType)}><option value="1">Employee manager</option><option value="2">Role</option><option value="3">Specific employee</option></select></label>
    {form.approverType === 2 && <label>Role<select value={form.approverRoleId ?? ''} onChange={(event) => setForm((value) => ({ ...value, approverRoleId: event.target.value || null }))}><option value="">Select a role</option>{(options?.roles ?? []).map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label>}
    {form.approverType === 3 && <label>Employee<input list="overtime-approver-employees" value={employeeSearch} placeholder="Search employee code or name" onChange={(event) => { setEmployeeSearch(event.target.value); const selected = (options?.employees ?? []).find((employee) => `${employee.employeeCode} - ${employee.fullName}` === event.target.value); setForm((value) => ({ ...value, approverEmployeeId: selected?.id ?? null })) }} /><datalist id="overtime-approver-employees">{employees.map((employee) => <option key={employee.id} value={`${employee.employeeCode} - ${employee.fullName}`} />)}</datalist></label>}
    {approvalLevelId && <label className="overtime-check"><input type="checkbox" checked={form.isActive} onChange={(event) => setForm((value) => ({ ...value, isActive: event.target.checked }))} />Active</label>}</div><div className="overtime-form-actions"><Button type="button" variant="ghost" onClick={() => navigate('/overtime/approval')}>Cancel</Button><Button type="submit">Save level</Button></div>
  </form></CardContent></Card></main></PermissionGuard>
}
