import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { useAuth } from '../hooks/useAuth'

export function GuestRoute() {
  const { status } = useAuth()
  if (status === 'idle' || status === 'bootstrapping') return <AuthLoadingScreen />
  if (status === 'authenticated') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
