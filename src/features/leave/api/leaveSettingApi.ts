import { apiClient } from '../../../lib/api/apiClient'
import type { LeaveApprovalLevel, LeaveApprovalSetting, LeaveConfigurationOptions, UpdateLeaveApprovalLevelRequest, UpdateLeaveApprovalSettingRequest } from '../types/leave.types'
export async function getApprovalSetting(signal?: AbortSignal) { return (await apiClient.get<LeaveApprovalSetting>('/api/LeaveSetting/GetLeaveApprovalSetting', { signal })).data }
export async function updateApprovalSetting(request: UpdateLeaveApprovalSettingRequest) { return (await apiClient.put<LeaveApprovalSetting>('/api/LeaveSetting/UpdateLeaveApprovalSetting', request)).data }
export async function getApprovalLevels(signal?: AbortSignal) { return (await apiClient.get<LeaveApprovalLevel[]>('/api/LeaveSetting/GetLeaveApprovalLevels', { signal })).data }
export async function updateApprovalLevels(request: UpdateLeaveApprovalLevelRequest[]) { return (await apiClient.put<LeaveApprovalLevel[]>('/api/LeaveSetting/UpdateLeaveApprovalLevels', request)).data }
export async function getConfigurationOptions(signal?: AbortSignal) { return (await apiClient.get<LeaveConfigurationOptions>('/api/LeaveSetting/GetLeaveConfigurationOptions', { signal })).data }
