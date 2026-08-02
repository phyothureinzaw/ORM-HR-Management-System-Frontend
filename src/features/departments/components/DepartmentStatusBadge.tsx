import { Badge } from '../../../components/ui/Badge'

export function DepartmentStatusBadge({ active }: { active: boolean }) {
  return <Badge className={active ? 'status-active' : 'status-inactive'}>{active ? 'Active' : 'Inactive'}</Badge>
}
