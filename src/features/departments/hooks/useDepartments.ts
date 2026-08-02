import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getDepartmentById, getDepartments } from '../api/departmentApi'
import { departmentKeys } from '../api/departmentKeys'
import type { DepartmentListParams } from '../types/department.types'

export function useDepartments(params: DepartmentListParams) {
  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: ({ signal }) => getDepartments(params, signal),
    placeholderData: keepPreviousData,
  })
}

export function useDepartment(id: string | null, enabled = true) {
  return useQuery({
    queryKey: departmentKeys.detail(id ?? ''),
    queryFn: ({ signal }) => getDepartmentById(id as string, signal),
    enabled: enabled && Boolean(id),
  })
}
