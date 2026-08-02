import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../components/ui/Card'

export function LoginPlaceholderPage() {
  return <main className="auth-placeholder-page"><Card className="auth-placeholder-card"><CardContent><div className="auth-placeholder-icon"><LockKeyhole size={22} aria-hidden="true" /></div><p className="eyebrow">Authentication</p><h1>Sign in</h1><p className="page-description">The sign-in form will be connected to the existing API in the next milestone.</p><div className="placeholder-fields" aria-label="Sign-in form preview"><div className="placeholder-field"><span>Company abbreviation</span></div><div className="placeholder-field"><span>Username or email</span></div><div className="placeholder-field"><span>Password</span></div><button className="button button-primary" disabled>Sign in coming soon</button></div><Link to="/" className="back-link"><ArrowLeft size={15} aria-hidden="true" /> Back to foundation</Link></CardContent></Card></main>
}
