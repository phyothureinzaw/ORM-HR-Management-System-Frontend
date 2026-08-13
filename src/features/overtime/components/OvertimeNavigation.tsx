import { NavLink } from 'react-router-dom'
import { usePermission } from '../../auth/hooks/usePermission'
import { Permissions } from '../../../lib/permissions'

export function OvertimeNavigation() {
  const canView = usePermission(Permissions.Overtime.View)
  const canRequest = usePermission(Permissions.Overtime.Request)
  const canApprove = usePermission(Permissions.Overtime.Approve)
  const canManage = usePermission(Permissions.Overtime.Manage)
  return <nav className="overtime-navigation" aria-label="Overtime navigation">
    {canView && <NavLink end to="/overtime">My Overtime</NavLink>}
    {canRequest && <NavLink to="/overtime/new">Request Overtime</NavLink>}
    {canApprove && <NavLink to="/overtime/approvals">Approval Queue</NavLink>}
    {canManage && <><NavLink to="/overtime/types">OT Types</NavLink><NavLink to="/overtime/projects">Projects</NavLink><NavLink to="/overtime/settings">Settings</NavLink><NavLink to="/overtime/approval">Approval Setup</NavLink></>}
  </nav>
}
