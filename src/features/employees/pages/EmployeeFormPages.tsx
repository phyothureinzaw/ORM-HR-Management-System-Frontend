import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../../components/common/PageHeader'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { Permissions } from '../../../lib/permissions'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
import { useEmployee, useEmployeeFormOptions } from '../hooks/useEmployees'
import { useEmployeeMutations } from '../hooks/useEmployeeMutations'
import { EmployeeForm } from '../components/EmployeeForm'
import type { AddEmployeeRequest, CreateEmployeeLoginRequest, UpdateEmployeeRequest } from '../types/employee.types'
import type { EmployeeFormValues } from '../schemas/employeeSchema'
import type { ApiError } from '../../../lib/api/apiError'
import { toast } from 'sonner'

function optionError(options: ReturnType<typeof useEmployeeFormOptions>) { return options.error ? <div className="inline-error" role="alert"><h2>Employee options could not be loaded</h2><p>Please retry before editing employee data.</p><Button variant="secondary" onClick={() => void options.refetch()}>Retry</Button></div> : null }
function clean(values: EmployeeFormValues) { return { employeeCode: values.employeeCode.trim().toUpperCase(), firstName: values.firstName.trim(), lastName: values.lastName.trim(), workEmail: values.workEmail?.trim() || null, phoneNumber: values.phoneNumber?.trim() || null, jobTitle: values.jobTitle?.trim() || null, employmentDate: values.employmentDate || null, departmentId: values.departmentId || null, managerId: values.managerId || null, employmentStatus: values.employmentStatus } }
function errorText(error: unknown) { const apiError = error as ApiError; return apiError.status === 409 ? apiError.message || 'This employee operation conflicts with another record.' : apiError.status === 403 ? 'You do not have permission to manage employees.' : 'The employee could not be saved. Please check the form and try again.' }
function fieldErrors(error: unknown) { const errors = (error as ApiError).problem?.errors; const names = ['employeeCode', 'firstName', 'lastName', 'workEmail', 'phoneNumber', 'jobTitle', 'employmentDate']; const result: Partial<Record<keyof EmployeeFormValues, string>> = {}; Object.entries(errors ?? {}).forEach(([key, values]) => { const field = names.find((name) => name.toLowerCase() === key.toLowerCase()); if (field) result[field as keyof EmployeeFormValues] = values?.[0] }) ; return result }

export function AddEmployeePage() {
  const options = useEmployeeFormOptions(); const { add } = useEmployeeMutations(); const navigate = useNavigate(); const [error, setError] = useState<unknown>(null); const [serverErrors, setServerErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({})
  async function submit(values: EmployeeFormValues, createLogin: boolean, loginValues?: CreateEmployeeLoginRequest) { setError(null); setServerErrors({}); const request: AddEmployeeRequest = { ...clean(values), createLoginAccount: createLogin, ...(createLogin && loginValues ? { loginAccount: loginValues } : {}) }; try { const employee = await add.mutateAsync(request); toast.success('Employee added.'); navigate(`/employees/${employee.id}`, { replace: true }) } catch (value) { setError(value); setServerErrors(fieldErrors(value)) } }
  return <PermissionGuard permission={Permissions.Employees.Manage} fallback={<UnauthorizedPage />}><div><PageHeader eyebrow="People" title="Add employee" description="Create an employee record and optionally provide login access." action={<Link className="text-link" to="/employees"><ArrowLeft size={15} aria-hidden="true" /> Back to employees</Link>} />{options.isLoading ? <div className="dialog-loading" role="status">Loading employee options…</div> : optionError(options) ?? <EmployeeForm options={options.data!} isSubmitting={add.isPending} serverError={error ? errorText(error) : undefined} serverErrors={serverErrors} onCancel={() => navigate('/employees')} onSubmit={submit} submitLabel="Add employee" />}</div></PermissionGuard>
}

export function UpdateEmployeePage() {
  const { employeeId } = useParams(); const employee = useEmployee(employeeId); const options = useEmployeeFormOptions(); const { update } = useEmployeeMutations(); const navigate = useNavigate(); const [error, setError] = useState<unknown>(null); const [serverErrors, setServerErrors] = useState<Partial<Record<keyof EmployeeFormValues, string>>>({})
  async function submit(values: EmployeeFormValues) { if (!employee.data) return; setError(null); setServerErrors({}); const request: UpdateEmployeeRequest = clean(values); try { const result = await update.mutateAsync({ id: employee.data.id, request }); toast.success('Employee updated.'); navigate(`/employees/${result.id}`, { replace: true }) } catch (value) { setError(value); setServerErrors(fieldErrors(value)) } }
  return <PermissionGuard permission={Permissions.Employees.Manage} fallback={<UnauthorizedPage />}><div>{employee.isLoading || options.isLoading ? <div className="dialog-loading" role="status">Loading employee…</div> : employee.isError ? <Alert className="form-alert">The employee could not be loaded.</Alert> : options.isError ? optionError(options) : <><PageHeader eyebrow="People" title="Update employee" description="Update the employee record without changing login credentials." action={<Link className="text-link" to={`/employees/${employeeId}`}><ArrowLeft size={15} aria-hidden="true" /> Back to details</Link>} /><EmployeeForm employee={employee.data} options={options.data!} isSubmitting={update.isPending} serverError={error ? errorText(error) : undefined} serverErrors={serverErrors} onCancel={() => navigate(`/employees/${employeeId}`)} onSubmit={(values) => void submit(values)} submitLabel="Save changes" /></>}</div></PermissionGuard>
}
