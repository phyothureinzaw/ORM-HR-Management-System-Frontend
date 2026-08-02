import { Badge } from '../../../components/ui/Badge'
import type { EmploymentStatus } from '../types/employee.types'

const labels: Record<EmploymentStatus, string> = { 1: 'Active', 2: 'On leave', 3: 'Terminated' }
export function EmployeeStatusBadge({ status, active }: { status: EmploymentStatus; active: boolean }) { return <Badge className={active ? status === 2 ? 'status-onleave' : 'status-active' : 'status-inactive'}>{labels[status]}{!active && status !== 3 ? ' · Inactive' : ''}</Badge> }
