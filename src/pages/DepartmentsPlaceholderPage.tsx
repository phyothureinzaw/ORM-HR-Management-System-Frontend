import { BriefcaseBusiness } from 'lucide-react'
import { Card, CardContent } from '../components/ui/Card'
import { PageHeader } from '../components/common/PageHeader'
import { PermissionGuard } from '../features/auth/components/PermissionGuard'
import { Permissions } from '../lib/permissions'
import { UnauthorizedPage } from './UnauthorizedPage'

export function DepartmentsPlaceholderPage() {
  return <PermissionGuard permission={Permissions.Departments.View} fallback={<UnauthorizedPage />}><div><PageHeader eyebrow="Organization" title="Departments" description="Department Management will be connected next. This page is intentionally a foundation placeholder." /><Card><CardContent><div className="empty-state"><div className="empty-icon"><BriefcaseBusiness size={22} aria-hidden="true" /></div><h2>No department data connected</h2><p>The backend contract is ready, but this frontend milestone does not submit or display department data yet.</p></div></CardContent></Card></div></PermissionGuard>
}
