import { apiClient } from '../../../lib/api/apiClient'
import type { AddEmployeeRequest, CreateEmployeeLoginRequest, Employee, EmployeeFormOptions, EmployeeListParams, PagedEmployeeResponse, UpdateEmployeeLoginRequest, UpdateEmployeeRequest } from '../types/employee.types'

export async function getEmployees(params: EmployeeListParams, signal?: AbortSignal) {
  const response = await apiClient.get<PagedEmployeeResponse>('/api/Employee/GetEmployees', { params, signal })
  return response.data
}
export async function getEmployeeById(id: string, signal?: AbortSignal) {
  const response = await apiClient.get<Employee>(`/api/Employee/GetEmployeeById/${encodeURIComponent(id)}`, { signal })
  return response.data
}
export async function getEmployeeFormOptions(signal?: AbortSignal) {
  const response = await apiClient.get<EmployeeFormOptions>('/api/Employee/GetEmployeeFormOptions', { signal })
  return response.data
}
export async function addEmployee(request: AddEmployeeRequest) {
  const response = await apiClient.post<Employee>('/api/Employee/AddEmployee', request)
  return response.data
}
export async function updateEmployee(id: string, request: UpdateEmployeeRequest) {
  const response = await apiClient.put<Employee>(`/api/Employee/UpdateEmployee/${encodeURIComponent(id)}`, request)
  return response.data
}
export async function deactivateEmployee(id: string, terminationDate?: string) {
  await apiClient.delete(`/api/Employee/DeleteEmployee/${encodeURIComponent(id)}`, { params: terminationDate ? { terminationDate } : undefined })
}
export async function reactivateEmployee(id: string) {
  const response = await apiClient.post<Employee>(`/api/Employee/ReactivateEmployee/${encodeURIComponent(id)}`)
  return response.data
}
export async function createEmployeeLogin(id: string, request: CreateEmployeeLoginRequest) {
  const response = await apiClient.post<Employee>(`/api/Employee/CreateEmployeeLogin/${encodeURIComponent(id)}`, request)
  return response.data
}
export async function updateEmployeeLogin(id: string, request: UpdateEmployeeLoginRequest) {
  const response = await apiClient.put<Employee>(`/api/Employee/UpdateEmployeeLogin/${encodeURIComponent(id)}`, request)
  return response.data
}
export async function disableEmployeeLogin(id: string) {
  await apiClient.post(`/api/Employee/DisableEmployeeLogin/${encodeURIComponent(id)}`)
}
export async function enableEmployeeLogin(id: string) {
  const response = await apiClient.post<Employee>(`/api/Employee/EnableEmployeeLogin/${encodeURIComponent(id)}`)
  return response.data
}
