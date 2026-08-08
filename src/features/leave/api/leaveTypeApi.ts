import { apiClient } from '../../../lib/api/apiClient'
import type { AddLeaveTypeRequest, LeaveType, LeaveTypeListParams, PagedResponse, UpdateLeaveTypeRequest } from '../types/leave.types'
export async function getLeaveTypes(params: LeaveTypeListParams, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<LeaveType>>('/api/LeaveType/GetLeaveTypes', { params, signal })).data }
export async function getLeaveType(id: string, signal?: AbortSignal) { return (await apiClient.get<LeaveType>(`/api/LeaveType/GetLeaveTypeById/${encodeURIComponent(id)}`, { signal })).data }
export async function addLeaveType(request: AddLeaveTypeRequest) { return (await apiClient.post<LeaveType>('/api/LeaveType/AddLeaveType', request)).data }
export async function updateLeaveType(id: string, request: UpdateLeaveTypeRequest) { return (await apiClient.put<LeaveType>(`/api/LeaveType/UpdateLeaveType/${encodeURIComponent(id)}`, request)).data }
export async function deactivateLeaveType(id: string) { await apiClient.delete(`/api/LeaveType/DeleteLeaveType/${encodeURIComponent(id)}`) }
