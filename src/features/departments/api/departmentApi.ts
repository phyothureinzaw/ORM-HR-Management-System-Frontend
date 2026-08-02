import { apiClient } from '../../../lib/api/apiClient'
import type { AddDepartmentRequest, Department, DepartmentListParams, PagedResponse, UpdateDepartmentRequest } from '../types/department.types'

export async function getDepartments(params: DepartmentListParams, signal?: AbortSignal): Promise<PagedResponse<Department>> {
  const response = await apiClient.get<PagedResponse<Department>>('/api/Department/GetDepartments', { params, signal })
  return response.data
}

export async function getDepartmentById(id: string, signal?: AbortSignal): Promise<Department> {
  const response = await apiClient.get<Department>(`/api/Department/GetDepartmentById/${encodeURIComponent(id)}`, { signal })
  return response.data
}

export async function addDepartment(request: AddDepartmentRequest): Promise<Department> {
  const response = await apiClient.post<Department>('/api/Department/AddDepartment', request)
  return response.data
}

export async function updateDepartment(id: string, request: UpdateDepartmentRequest): Promise<Department> {
  const response = await apiClient.put<Department>(`/api/Department/UpdateDepartment/${encodeURIComponent(id)}`, request)
  return response.data
}

export async function deleteDepartment(id: string): Promise<void> {
  await apiClient.delete(`/api/Department/DeleteDepartment/${encodeURIComponent(id)}`)
}
