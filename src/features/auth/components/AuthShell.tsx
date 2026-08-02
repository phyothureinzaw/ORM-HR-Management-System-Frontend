import { Building2, ShieldCheck } from 'lucide-react'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

export function AuthShell({ children }: PropsWithChildren) {
  return <main className="auth-layout"><section className="auth-aside"><Link to="/" className="auth-brand"><span className="brand-mark"><Building2 size={18} aria-hidden="true" /></span><strong>Workforce <em>Customer Web</em></strong></Link><div className="auth-aside-copy"><p className="eyebrow">Workforce administration</p><h1>Keep your people operations organized.</h1><p>Secure company access for the daily work of administrators, HR teams, managers, and employees.</p></div><div className="auth-aside-note"><ShieldCheck size={18} aria-hidden="true" /><span>Security and access are managed by your company workspace.</span></div></section><section className="auth-panel">{children}</section></main>
}
