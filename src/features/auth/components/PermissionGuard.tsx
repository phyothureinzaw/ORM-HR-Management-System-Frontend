import type { PropsWithChildren, ReactNode } from 'react'
import { usePermission } from '../hooks/usePermission'

export function PermissionGuard({ permission, children, fallback = null }: PropsWithChildren<{ permission: string; fallback?: ReactNode }>) {
  return usePermission(permission) ? <>{children}</> : <>{fallback}</>
}
