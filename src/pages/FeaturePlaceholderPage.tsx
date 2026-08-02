import { Construction } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { PageHeader } from '../components/common/PageHeader'

export function FeaturePlaceholderPage({ title }: { title: string }) {
  return <div><PageHeader eyebrow="Planned module" title={title} description={`${title} is planned for a later milestone.`} /><Card><CardContent><div className="empty-state"><div className="empty-icon"><Construction size={22} aria-hidden="true" /></div><h2>Not available yet</h2><p>This navigation item is shown to establish the application structure. No business functionality is enabled.</p></div></CardContent></Card></div>
}
