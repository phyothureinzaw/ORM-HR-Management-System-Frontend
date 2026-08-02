import { LoaderCircle, ShieldCheck } from 'lucide-react'

export function AuthLoadingScreen() {
  return <main className="auth-loading" aria-live="polite" aria-busy="true"><div className="auth-loading-mark"><ShieldCheck size={22} aria-hidden="true" /></div><LoaderCircle className="spin" size={18} aria-hidden="true" /><span>Checking your session</span></main>
}
