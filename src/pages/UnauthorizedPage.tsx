import { ArrowLeft, ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function UnauthorizedPage() {
  return <main className="not-found-page"><div className="empty-icon"><ShieldAlert size={22} aria-hidden="true" /></div><p className="eyebrow">403</p><h1>Access not available</h1><p>You are signed in, but your account does not have permission to view this area.</p><Link to="/dashboard"><Button><ArrowLeft size={15} aria-hidden="true" /> Back to dashboard</Button></Link></main>
}
