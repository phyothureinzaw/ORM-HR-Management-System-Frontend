import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type { ChangeEventHandler } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Alert } from '../../../components/ui/Alert'
import { Button } from '../../../components/ui/Button'
import { AuthShell } from '../components/AuthShell'
import { PasswordField } from '../components/PasswordField'
import { registerCompany } from '../api/authApi'
import { mapServerValidation } from '../api/formErrors'
import { registerCompanySchema, type RegisterCompanyFormValues } from '../schemas/registerCompanySchema'

export function RegisterCompanyPage() {
  const navigate = useNavigate()
  const form = useForm<RegisterCompanyFormValues>({ resolver: zodResolver(registerCompanySchema), mode: 'onBlur', shouldFocusError: true, defaultValues: { CompanyName: '', CompanyAbbreviation: '', CompanyEmail: '', FirstName: '', LastName: '', UserName: '', AdminEmail: '', Password: '', ConfirmPassword: '' } })
  const serverError = form.formState.errors.root?.message
  async function onSubmit(values: RegisterCompanyFormValues) {
    form.clearErrors('root')
    try {
      await registerCompany({ ...values, CompanyName: values.CompanyName.trim(), CompanyAbbreviation: values.CompanyAbbreviation.trim().toUpperCase(), CompanyEmail: values.CompanyEmail.trim(), FirstName: values.FirstName.trim(), LastName: values.LastName.trim(), UserName: values.UserName.trim(), AdminEmail: values.AdminEmail.trim() })
      toast.success('Company registered successfully.')
      navigate('/login', { replace: true, state: { registered: true, companyAbbreviation: values.CompanyAbbreviation.trim().toUpperCase() } })
    } catch (error) {
      if (mapServerValidation(error, form.setError)) return
      const status = (error as { status?: number }).status
      form.setError('root', { type: 'server', message: status === 409 ? 'That company abbreviation or email is already in use.' : 'Registration could not be completed. Please check the details and try again.' })
    }
  }
  return <AuthShell><div className="auth-form-card auth-form-card-wide"><p className="eyebrow">Company setup</p><h1>Register your company</h1><p className="auth-form-description">Create a company workspace and its first administrator account.</p>{serverError && <Alert className="form-alert">{serverError}</Alert>}<form className="auth-form" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)} noValidate aria-busy={form.formState.isSubmitting}><fieldset><legend>Company information</legend><div className="form-grid"><FormInput form={form} name="CompanyName" label="Company name" autoComplete="organization" /><FormInput form={form} name="CompanyAbbreviation" label="Company abbreviation" autoComplete="organization" onChange={(event) => form.setValue('CompanyAbbreviation', event.target.value.toUpperCase(), { shouldValidate: true })} /><FormInput form={form} name="CompanyEmail" label="Company email" autoComplete="email" optional /></div></fieldset><fieldset><legend>Administrator account</legend><div className="form-grid"><FormInput form={form} name="FirstName" label="First name" autoComplete="given-name" /><FormInput form={form} name="LastName" label="Last name" autoComplete="family-name" /><FormInput form={form} name="UserName" label="Username" autoComplete="username" /><FormInput form={form} name="AdminEmail" label="Administrator email" autoComplete="email" /></div></fieldset><fieldset><legend>Password</legend><div className="form-grid"><PasswordField label="Password" autoComplete="new-password" registration={form.register('Password')} error={form.formState.errors.Password} /><PasswordField label="Confirm password" autoComplete="new-password" registration={form.register('ConfirmPassword')} error={form.formState.errors.ConfirmPassword} /></div><p className="password-hint">At least 8 characters, including uppercase, lowercase, a number, and a special character.</p></fieldset><Button type="submit" className="auth-submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Creating workspace…' : <>Create company workspace <ArrowRight size={16} aria-hidden="true" /></>}</Button></form><p className="auth-switch">Already have a workspace? <Link to="/login">Sign in</Link></p></div></AuthShell>
}

function FormInput({ form, name, label, autoComplete, optional, onChange }: { form: ReturnType<typeof useForm<RegisterCompanyFormValues>>; name: keyof RegisterCompanyFormValues; label: string; autoComplete: string; optional?: boolean; onChange?: ChangeEventHandler<HTMLInputElement> }) {
  const error = form.formState.errors[name]
  return <div className="form-field"><label htmlFor={name}>{label}{!optional && <span className="required-mark">*</span>}</label><input id={name} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined} {...form.register(name)} onChange={onChange} />{error && <p className="field-error" id={`${name}-error`} role="alert">{error.message}</p>}</div>
}
