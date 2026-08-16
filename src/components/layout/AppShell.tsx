import { Menu, PanelLeftClose, PanelLeftOpen, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../features/auth/hooks/useAuth'
import { OvertimeNavigation } from '../../features/overtime/components/OvertimeNavigation'
import { NotificationBell } from '../../features/notifications/components/NotificationBell'

const pageNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/departments': 'Departments',
  '/employees': 'Employees',
  '/leave': 'Leave',
  '/overtime': 'Overtime',
  '/attendance': 'Attendance',
  '/petty-cash': 'Petty Cash',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/notifications': 'Notifications',
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const isAttendanceMonitoring = location.pathname === '/dashboard/attendance' || location.pathname.startsWith('/dashboard/attendance/')
  const pageName = isAttendanceMonitoring ? (location.pathname === '/dashboard/attendance' ? 'Attendance Monitoring' : 'Attendance Details') : pageNames[location.pathname] ?? 'Workspace'
  const breadcrumbRoot = isAttendanceMonitoring ? 'Dashboard' : 'Workspace'
  const isOvertimeConfiguration = ['/overtime/types', '/overtime/projects', '/overtime/settings', '/overtime/approval'].some((path) => location.pathname === path || location.pathname.startsWith(`${path}/`))

  return (
    <div className={sidebarCollapsed ? 'app-shell sidebar-collapsed' : 'app-shell'}>
      <div className="desktop-sidebar"><Sidebar /></div>
      {mobileOpen && <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={mobileOpen ? 'mobile-sidebar mobile-sidebar-open' : 'mobile-sidebar'}>
        <div className="mobile-sidebar-close"><button className="icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className="shell-main">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <button className="icon-button sidebar-toggle" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!sidebarCollapsed} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setSidebarCollapsed((value) => !value)}>{sidebarCollapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button>
           <div className="breadcrumb"><span>{breadcrumbRoot}</span><span className="breadcrumb-divider">/</span><strong>{pageName}</strong></div>
           <div className="topbar-actions"><NotificationBell /><details className="account-menu"><summary className="account-trigger"><span className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</span><span className="account-copy"><strong>{user?.fullName}</strong><small>{user?.companyName}</small></span><UserRound size={15} aria-hidden="true" /></summary><div className="account-popover"><p className="account-role">{user?.roles[0] ?? 'Workspace user'}</p><button type="button" onClick={() => void signOut().then(() => navigate('/login', { replace: true }))}>Sign out</button></div></details></div>
        </header>
       <main className="shell-content">{isOvertimeConfiguration && <OvertimeNavigation />}<Outlet /></main>
      </div>
    </div>
  )
}
