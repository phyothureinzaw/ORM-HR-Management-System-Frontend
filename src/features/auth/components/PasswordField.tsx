import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'

export function PasswordField({ label, registration, error, autoComplete }: { label: string; registration: UseFormRegisterReturn; error?: FieldError; autoComplete: string }) {
  const [visible, setVisible] = useState(false)
  const id = registration.name
  return <div className="form-field"><label htmlFor={id}>{label}<span className="required-mark">*</span></label><div className="password-input-wrap"><input id={id} type={visible ? 'text' : 'password'} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...registration} /><button type="button" className="password-toggle" aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`} onClick={() => setVisible((current) => !current)}>{visible ? <EyeOff size={17} aria-hidden="true" /> : <Eye size={17} aria-hidden="true" />}</button></div>{error && <p className="field-error" id={`${id}-error`} role="alert">{error.message}</p>}</div>
}
