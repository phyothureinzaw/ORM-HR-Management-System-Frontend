export type EmploymentStatus = 1 | 2 | 3

export type DepartmentOption = { id: string; code: string; name: string }
export type ManagerOption = { id: string; employeeCode: string; fullName: string; jobTitle: string | null }
export type RoleOption = { id: string; name: string; normalizedName: string }
export type EmploymentStatusOption = { value: EmploymentStatus; name: string }

export type EmployeeLogin = {
  hasLoginAccount: boolean
  userId: string | null
  userName: string | null
  email: string | null
  isActive: boolean | null
  roles: string[]
  lastLoginAtUtc: string | null
}

export type EmployeeSummary = { id: string; employeeCode: string; fullName: string; jobTitle: string | null }

export type Employee = {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  fullName: string
  workEmail: string | null
  phoneNumber: string | null
  jobTitle: string | null
  employmentDate: string | null
  terminationDate: string | null
  employmentStatus: EmploymentStatus
  isActive: boolean
  hasLoginAccount: boolean
  department: DepartmentOption | null
  manager: EmployeeSummary | null
  loginAccount: EmployeeLogin
  roles: string[]
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type EmployeeFormOptions = {
  departments: DepartmentOption[]
  managers: ManagerOption[]
  roles: RoleOption[]
  employmentStatuses: EmploymentStatusOption[]
}

export type EmployeeListParams = {
  search?: string
  page: number
  pageSize: number
  departmentId?: string
  managerId?: string
  roleId?: string
  employmentStatus?: EmploymentStatus
  hasLoginAccount?: boolean
  includeInactive: boolean
  sortBy: EmployeeSortField
  sortDirection: 'asc' | 'desc'
}

export type EmployeeSortField = 'EmployeeCode' | 'FirstName' | 'LastName' | 'WorkEmail' | 'JobTitle' | 'EmploymentDate' | 'EmploymentStatus' | 'CreatedAtUtc' | 'UpdatedAtUtc'
export type PagedEmployeeResponse = { items: Employee[]; page: number; pageSize: number; totalCount: number; totalPages: number; hasPreviousPage: boolean; hasNextPage: boolean }

export type AddEmployeeRequest = {
  employeeCode: string; firstName: string; lastName: string; workEmail: string | null; phoneNumber: string | null; jobTitle: string | null; employmentDate: string | null; departmentId: string | null; managerId: string | null; employmentStatus?: EmploymentStatus; createLoginAccount: boolean; loginAccount?: CreateEmployeeLoginRequest
}
export type UpdateEmployeeRequest = Omit<AddEmployeeRequest, 'createLoginAccount' | 'loginAccount'> & { employmentStatus: EmploymentStatus }
export type CreateEmployeeLoginRequest = { userName: string; email: string; password: string; confirmPassword: string; roleId: string }
export type UpdateEmployeeLoginRequest = { userName: string; email: string; roleId: string }
