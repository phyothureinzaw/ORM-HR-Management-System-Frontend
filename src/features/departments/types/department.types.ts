export type Department = {
  id: string
  code: string
  name: string
  description: string | null
  isActive: boolean
  createdAtUtc: string
  updatedAtUtc: string | null
}

export type DepartmentListParams = {
  search?: string
  page: number
  pageSize: number
  includeInactive: boolean
  sortBy?: DepartmentSortField
  sortDirection: 'asc' | 'desc'
}

export type DepartmentSortField = 'Code' | 'Name' | 'CreatedAtUtc' | 'UpdatedAtUtc' | 'IsActive'

export type PagedResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type AddDepartmentRequest = {
  code: string
  name: string
  description: string | null
}

export type UpdateDepartmentRequest = AddDepartmentRequest & {
  isActive: boolean
}
