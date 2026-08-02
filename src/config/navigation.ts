import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  FileBarChart,
  LayoutDashboard,
  Settings,
  Users,
  WalletCards,
} from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
  status: 'ready' | 'planned'
}

export const navigationItems: NavigationItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, status: 'ready' },
  { label: 'Departments', href: '/departments', icon: BriefcaseBusiness, status: 'ready' },
  { label: 'Employees', href: '/employees', icon: Users, status: 'planned' },
  { label: 'Leave', href: '/leave', icon: CalendarDays, status: 'planned' },
  { label: 'Overtime', href: '/overtime', icon: Clock3, status: 'planned' },
  { label: 'Attendance', href: '/attendance', icon: BarChart3, status: 'planned' },
  { label: 'Petty Cash', href: '/petty-cash', icon: WalletCards, status: 'planned' },
  { label: 'Reports', href: '/reports', icon: FileBarChart, status: 'planned' },
  { label: 'Settings', href: '/settings', icon: Settings, status: 'planned' },
]
