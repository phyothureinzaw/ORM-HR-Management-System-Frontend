import { ArrowRight, ClipboardList, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../components/ui/Card'
import { PageHeader } from '../components/common/PageHeader'
import { useAuth } from '../features/auth/hooks/useAuth'

export function DashboardPlaceholderPage() {
  const { user } = useAuth()
  return <div><PageHeader eyebrow="Workspace overview" title={`Good to see you, ${user?.firstName ?? 'there'}.`} description={`${user?.companyName ?? 'Your company workspace'} is ready for daily workforce administration.`} /><div className="dashboard-grid"><Card><CardHeader><div className="section-icon"><ClipboardList size={18} aria-hidden="true" /></div><h2>Available workflow</h2><p>Department Management is the first connected business module.</p></CardHeader><CardContent><Link className="text-link" to="/departments">Open departments <ArrowRight size={15} aria-hidden="true" /></Link></CardContent></Card><Card><CardHeader><div className="section-icon section-icon-green"><ShieldCheck size={18} aria-hidden="true" /></div><h2>Access</h2><p>{user?.roles[0] ?? 'Workspace user'} access for {user?.companyName ?? 'your company'}.</p></CardHeader></Card></div></div>
}
