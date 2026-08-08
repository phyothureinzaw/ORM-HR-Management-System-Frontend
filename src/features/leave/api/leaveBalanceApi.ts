import { apiClient } from '../../../lib/api/apiClient'
import type { AssignLeaveBalanceRequest, LeaveBalance, LeaveBalanceListParams, PagedResponse, UpdateLeaveBalanceRequest } from '../types/leave.types'
export async function getLeaveBalances(params: LeaveBalanceListParams, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<LeaveBalance>>('/api/LeaveBalance/GetLeaveBalances', { params, signal })).data }
export async function getEmployeeLeaveBalances(id: string, year?: number, signal?: AbortSignal) { return (await apiClient.get<LeaveBalance[]>(`/api/LeaveBalance/GetEmployeeLeaveBalances/${encodeURIComponent(id)}`, { params: year ? { year } : undefined, signal })).data }
export async function assignLeaveBalance(request: AssignLeaveBalanceRequest) { return (await apiClient.post<LeaveBalance>('/api/LeaveBalance/AssignLeaveBalance', request)).data }
export async function updateLeaveBalance(id: string, request: UpdateLeaveBalanceRequest) { return (await apiClient.put<LeaveBalance>(`/api/LeaveBalance/UpdateLeaveBalance/${encodeURIComponent(id)}`, request)).data }
