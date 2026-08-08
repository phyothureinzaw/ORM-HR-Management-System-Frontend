import { Outlet } from 'react-router-dom'
import { PermissionGuard } from '../../auth/components/PermissionGuard'
import { Permissions } from '../../../lib/permissions'
import { UnauthorizedPage } from '../../../pages/UnauthorizedPage'
export function LeaveSettingsLayout() { return <PermissionGuard permission={Permissions.Leaves.Manage} fallback={<UnauthorizedPage />}><Outlet /></PermissionGuard> }
