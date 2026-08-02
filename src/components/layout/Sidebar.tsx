import { Building2, ChevronRight, CircleHelp } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from '../../config/navigation'
import { cn } from '../../lib/utils'
import { Separator } from '../ui/Separator'
import { usePermission } from '../../features/auth/hooks/usePermission'
import { Permissions } from '../../lib/permissions'

type SidebarProps = { onNavigate?: () => void }

export function Sidebar({ onNavigate }: SidebarProps) {
  const canViewDepartments = usePermission(Permissions.Departments.View)
  const canViewEmployees = usePermission(Permissions.Employees.View)
  const visibleItems = navigationItems.filter((item) => (item.label !== 'Departments' || canViewDepartments) && (item.label !== 'Employees' || canViewEmployees))
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand-lockup">
        <div className="brand-mark"><Building2 size={18} aria-hidden="true" /></div>
        <div><strong>Workforce</strong><span>Customer Web</span></div>
      </div>
      <Separator />
      <nav className="navigation-list">
        <p className="nav-label">Workspace</p>
        {visibleItems.slice(0, 7).map((item) => {
          const Icon = item.icon
          return item.status === 'ready' ? (
            <NavLink key={item.label} to={item.href} onClick={onNavigate} className={({ isActive }) => cn('navigation-link', isActive && 'navigation-link-active')}>
              <Icon size={17} aria-hidden="true" /><span>{item.label}</span><ChevronRight className="nav-chevron" size={14} aria-hidden="true" />
            </NavLink>
          ) : <div key={item.label} className="navigation-link navigation-link-disabled" aria-disabled="true"><Icon size={17} aria-hidden="true" /><span>{item.label}</span><span className="planned-label">Soon</span></div>
        })}
        <p className="nav-label nav-label-spaced">Administration</p>
        {navigationItems.slice(7).map((item) => {
          const Icon = item.icon
          return <div key={item.label} className="navigation-link navigation-link-disabled" aria-disabled="true"><Icon size={17} aria-hidden="true" /><span>{item.label}</span><span className="planned-label">Soon</span></div>
        })}
      </nav>
      <div className="sidebar-footer"><CircleHelp size={16} aria-hidden="true" /><span>Help centre</span></div>
    </aside>
  )
}
