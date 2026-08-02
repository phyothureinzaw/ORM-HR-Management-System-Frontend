import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()
  if (auth.status === 'idle' || auth.status === 'bootstrapping') return <AuthLoadingScreen />
  if (auth.status === 'error') return <Navigate to="/login" replace state={{ from: location }} />
  if (auth.status !== 'authenticated') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
