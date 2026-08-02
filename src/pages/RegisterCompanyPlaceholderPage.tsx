import { ArrowLeft, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'

export function RegisterCompanyPlaceholderPage() {
  return <main className="auth-placeholder-page"><Card className="auth-placeholder-card"><CardContent><div className="auth-placeholder-icon"><Building2 size={22} aria-hidden="true" /></div><p className="eyebrow">Company setup</p><h1>Register your company</h1><p className="page-description">Company registration will be connected to the existing API in a later milestone.</p><div className="placeholder-fields" aria-label="Company registration form preview"><div className="placeholder-field"><span>Company details</span></div><div className="placeholder-field"><span>Administrator details</span></div><div className="placeholder-field"><span>Password</span></div><button className="button button-primary" disabled>Registration coming soon</button></div><Link to="/" className="back-link"><ArrowLeft size={15} aria-hidden="true" /> Back to foundation</Link></CardContent></Card></main>
}
