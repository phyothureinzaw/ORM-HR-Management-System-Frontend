export const Permissions = {
  Departments: { View: 'departments.view', Manage: 'departments.manage' },
  Employees: { View: 'employees.view', Manage: 'employees.manage' },
  Leaves: { Manage: 'leaves.manage', View: 'leaves.view', Request: 'leaves.request', Approve: 'leaves.approve' },
  Attendance: { Manage: 'attendance.manage', View: 'attendance.view', Check: 'attendance.check', Correct: 'attendance.correct' },
} as const
