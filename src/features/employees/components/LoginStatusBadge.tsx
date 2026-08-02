import { Badge } from '../../../components/ui/Badge'
import type { EmployeeLogin } from '../types/employee.types'

export function LoginStatusBadge({ login }: { login: EmployeeLogin }) { return login.hasLoginAccount ? <Badge className={login.isActive ? 'status-active' : 'status-inactive'}>{login.isActive ? 'Enabled' : 'Disabled'}</Badge> : <Badge className="status-neutral">No account</Badge> }
