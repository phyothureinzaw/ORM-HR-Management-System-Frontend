import { useAppSelector } from '../../../app/hooks'

export function usePermission(permission: string): boolean {
  const permissions = useAppSelector((state) => state.auth.user?.permissions ?? [])
  return permissions.includes(permission)
}
