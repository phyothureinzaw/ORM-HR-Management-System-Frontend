import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { AuthUnavailable } from './AuthUnavailable'
import { useAuth } from '../hooks/useAuth'

export function ProtectedRoute() {
  const auth = useAuth()
  const location = useLocation()
  if (auth.status === 'idle' || auth.status === 'bootstrapping') return <AuthLoadingScreen />
  if (auth.status === 'error') return <AuthUnavailable message={auth.bootstrapError ?? undefined} onRetry={auth.bootstrap} />
  if (auth.status === 'unauthenticated') return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}
