export const Permissions = {
  Departments: { View: 'departments.view', Manage: 'departments.manage' },
  Employees: { View: 'employees.view', Manage: 'employees.manage' },
  Leaves: { Manage: 'leaves.manage', View: 'leaves.view', Request: 'leaves.request', Approve: 'leaves.approve' },
} as const
