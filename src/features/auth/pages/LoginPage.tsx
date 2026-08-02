import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Alert } from '../../../components/ui/Alert'
import { AuthShell } from '../components/AuthShell'
import { PasswordField } from '../components/PasswordField'
import { mapServerValidation } from '../api/formErrors'
import { useAuth } from '../hooks/useAuth'
import { loginSchema, type LoginFormValues } from '../schemas/loginSchema'

type LocationState = { from?: { pathname?: string; search?: string; hash?: string }; registered?: boolean; companyAbbreviation?: string }

function safeReturnPath(state: LocationState | null): string {
  const path = state?.from?.pathname
  if (!path || !path.startsWith('/') || path.startsWith('//') || path === '/login') return '/dashboard'
  return `${path}${state.from?.search ?? ''}${state.from?.hash ?? ''}`
}

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = (location.state as LocationState | null) ?? null
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { CompanyAbbreviation: state?.companyAbbreviation ?? '', UserNameOrEmail: '', Password: '' },
    mode: 'onBlur',
    shouldFocusError: true,
  })
  const serverError = form.formState.errors.root?.message

  async function onSubmit(values: LoginFormValues) {
    form.clearErrors('root')
    try {
      await signIn({ CompanyAbbreviation: values.CompanyAbbreviation.trim().toUpperCase(), UserNameOrEmail: values.UserNameOrEmail.trim(), Password: values.Password })
      navigate(safeReturnPath(state), { replace: true })
    } catch (error) {
      form.setValue('Password', '')
      if (mapServerValidation(error, form.setError)) return
      const status = (error as { status?: number }).status
      form.setError('root', { type: 'server', message: status === 401 ? 'The company, username/email, or password is incorrect.' : 'Sign in could not be completed. Please try again.' })
    }
  }

  return <AuthShell><div className="auth-form-card"><p className="eyebrow">Welcome back</p><h1>Sign in to your workspace</h1><p className="auth-form-description">Use your company workspace credentials to continue.</p>{state?.registered && <Alert className="success-alert"><CheckCircle2 size={16} aria-hidden="true" /> Company registered. You can sign in now.</Alert>}{serverError && <Alert className="form-alert">{serverError}</Alert>}<form className="auth-form" onSubmit={(event) => void form.handleSubmit(onSubmit)(event)} noValidate aria-busy={form.formState.isSubmitting}><div className="form-field"><label htmlFor="CompanyAbbreviation">Company abbreviation<span className="required-mark">*</span></label><input id="CompanyAbbreviation" autoComplete="organization" aria-invalid={Boolean(form.formState.errors.CompanyAbbreviation)} aria-describedby={form.formState.errors.CompanyAbbreviation ? 'CompanyAbbreviation-error' : undefined} {...form.register('CompanyAbbreviation')} onChange={(event) => form.setValue('CompanyAbbreviation', event.target.value.toUpperCase(), { shouldValidate: true })} />{form.formState.errors.CompanyAbbreviation && <p className="field-error" id="CompanyAbbreviation-error" role="alert">{form.formState.errors.CompanyAbbreviation.message}</p>}</div><div className="form-field"><label htmlFor="UserNameOrEmail">Username or email<span className="required-mark">*</span></label><input id="UserNameOrEmail" autoComplete="username" aria-invalid={Boolean(form.formState.errors.UserNameOrEmail)} {...form.register('UserNameOrEmail')} />{form.formState.errors.UserNameOrEmail && <p className="field-error" role="alert">{form.formState.errors.UserNameOrEmail.message}</p>}</div><PasswordField label="Password" autoComplete="current-password" registration={form.register('Password')} error={form.formState.errors.Password} /><Button type="submit" className="auth-submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Signing in…' : <>Sign in <ArrowRight size={16} aria-hidden="true" /></>}</Button></form><p className="auth-switch">Need a company workspace? <Link to="/register-company">Register Company</Link></p><Link className="back-link" to="/"><ArrowRight className="back-link-icon" size={15} aria-hidden="true" /> Back to foundation</Link></div></AuthShell>
}
