import type { PropsWithChildren } from 'react'
import { useEffect, useRef } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthLoadingScreen } from './AuthLoadingScreen'
import { AuthUnavailable } from './AuthUnavailable'

export function AuthBootstrap({ children }: PropsWithChildren) {
  const { status, bootstrapError, bootstrap } = useAuth()
  const started = useRef(false)

  useEffect(() => {
    if (!started.current) {
      started.current = true
      void bootstrap()
    }
  }, [bootstrap])

  if (status === 'idle' || status === 'bootstrapping') return <AuthLoadingScreen />
  if (status === 'error') return <AuthUnavailable message={bootstrapError ?? undefined} onRetry={bootstrap} />
  return <>{children}</>
}
