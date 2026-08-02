import { Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { useAuth } from '../../features/auth/hooks/useAuth'

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
}

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const pageName = pageNames[location.pathname] ?? 'Workspace'

  return (
    <div className="app-shell">
      <div className="desktop-sidebar"><Sidebar /></div>
      {mobileOpen && <div className="mobile-drawer-backdrop" onClick={() => setMobileOpen(false)} aria-hidden="true" />}
      <div className={mobileOpen ? 'mobile-sidebar mobile-sidebar-open' : 'mobile-sidebar'}>
        <div className="mobile-sidebar-close"><button className="icon-button" aria-label="Close navigation" onClick={() => setMobileOpen(false)}><X size={20} /></button></div>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>
      <div className="shell-main">
        <header className="topbar">
          <button className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>{pageName}</strong></div>
          <details className="account-menu"><summary className="account-trigger"><span className="user-avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</span><span className="account-copy"><strong>{user?.fullName}</strong><small>{user?.companyName}</small></span><UserRound size={15} aria-hidden="true" /></summary><div className="account-popover"><p className="account-role">{user?.roles[0] ?? 'Workspace user'}</p><button type="button" onClick={() => void signOut().then(() => navigate('/login', { replace: true }))}>Sign out</button></div></details>
        </header>
        <main className="shell-content"><Outlet /></main>
      </div>
    </div>
  )
}
