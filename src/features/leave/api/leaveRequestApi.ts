import { apiClient } from '../../../lib/api/apiClient'
import type { LeaveRequestDetails, LeaveRequestFilters, LeaveRequestInput, LeaveRequestOptions, LeaveDecisionInput, LeaveListResponse } from '../types/leaveRequest.types'
import type { LeaveBalance } from '../types/leave.types'
const params = (value: LeaveRequestFilters) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''))
export async function getLeaveRequestOptions(year?: number, signal?: AbortSignal) { return (await apiClient.get<LeaveRequestOptions>('/api/LeaveRequest/GetLeaveRequestOptions', { params: year ? { balanceYear: year } : undefined, signal })).data }
export async function getMyLeaveBalances(year?: number, signal?: AbortSignal) { return (await apiClient.get<LeaveBalance[]>('/api/LeaveRequest/GetMyLeaveBalances', { params: year ? { balanceYear: year } : undefined, signal })).data }
export async function getMyLeaveRequests(filters: LeaveRequestFilters, signal?: AbortSignal) { return (await apiClient.get<LeaveListResponse>('/api/LeaveRequest/GetMyLeaveRequests', { params: params(filters), signal })).data }
export async function getCompanyLeaveRequests(filters: LeaveRequestFilters, signal?: AbortSignal) { return (await apiClient.get<LeaveListResponse>('/api/LeaveRequest/GetCompanyLeaveRequests', { params: params(filters), signal })).data }
export async function getLeaveApprovalQueue(filters: LeaveRequestFilters, signal?: AbortSignal) { return (await apiClient.get<LeaveListResponse>('/api/LeaveRequest/GetLeaveApprovalQueue', { params: params(filters), signal })).data }
export async function getLeaveRequest(id: string, signal?: AbortSignal) { return (await apiClient.get<LeaveRequestDetails>(`/api/LeaveRequest/GetLeaveRequestById/${encodeURIComponent(id)}`, { signal })).data }
export async function addLeaveRequest(input: LeaveRequestInput) { return (await apiClient.post<LeaveRequestDetails>('/api/LeaveRequest/AddLeaveRequest', input)).data }
export async function updateLeaveRequest(id: string, input: LeaveRequestInput) { return (await apiClient.put<LeaveRequestDetails>(`/api/LeaveRequest/UpdateLeaveRequest/${encodeURIComponent(id)}`, input)).data }
export async function cancelLeaveRequest(id: string, cancellationReason?: string) { return (await apiClient.post<LeaveRequestDetails>(`/api/LeaveRequest/CancelLeaveRequest/${encodeURIComponent(id)}`, { cancellationReason })).data }
export async function approveLeaveRequest(id: string, input: LeaveDecisionInput) { return (await apiClient.post<LeaveRequestDetails>(`/api/LeaveRequest/ApproveLeaveRequest/${encodeURIComponent(id)}`, input)).data }
export async function declineLeaveRequest(id: string, input: { comment: string }) { return (await apiClient.post<LeaveRequestDetails>(`/api/LeaveRequest/DeclineLeaveRequest/${encodeURIComponent(id)}`, input)).data }
