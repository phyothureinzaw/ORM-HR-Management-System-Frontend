import { ArrowRight, Building2, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BackendStatus } from '../components/feedback/BackendStatus'
import { Card, CardContent } from '../components/ui/Card'

export function HomePage() {
  return (
    <main className="foundation-page">
      <div className="foundation-topbar"><div className="brand-mark"><Building2 size={18} aria-hidden="true" /></div><strong>Workforce <span>Customer Web</span></strong><Link to="/login" className="text-link">Open sign-in placeholder <ArrowRight size={15} aria-hidden="true" /></Link></div>
      <section className="foundation-hero">
        <div className="hero-copy"><p className="eyebrow">Customer workspace foundation</p><h1>Organize your workforce with clarity.</h1><p className="hero-description">A practical administration workspace for company structure, people, and daily operations. Authentication and business workflows will be connected in later milestones.</p><div className="hero-actions"><Link to="/dashboard" className="button button-primary">View workspace preview <ArrowRight size={16} aria-hidden="true" /></Link><Link to="/register-company" className="button button-secondary">Register company placeholder</Link></div></div>
        <Card className="connection-card"><CardContent><div className="connection-card-heading"><ShieldCheck size={18} aria-hidden="true" /><div><h2>Development connection</h2><p>Verify the local API before wiring features.</p></div></div><BackendStatus /></CardContent></Card>
      </section>
      <div className="foundation-footer"><span>Frontend foundation</span><span>React · TypeScript · Vite</span></div>
    </main>
  )
}
