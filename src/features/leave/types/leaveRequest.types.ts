import type { EmployeeSummary, LeaveBalance, LeaveTypeSummary, PagedResponse } from './leave.types'
export type LeaveRequestStatus = 1 | 2 | 3 | 4
export type LeaveDayPortion = 1 | 2 | 3
export type LeaveApprovalStatus = 1 | 2 | 3 | 4
export type LeaveApproverType = 1 | 2 | 3
export type LeaveRequest = { id: string; requestNumber: string | null; employee: EmployeeSummary; leaveType: LeaveTypeSummary; startDate: string; endDate: string; startDayPortion: LeaveDayPortion; endDayPortion: LeaveDayPortion; requestedDays: number; status: LeaveRequestStatus; currentApprovalLevel: number | null; submittedAtUtc: string; finalDecisionAtUtc: string | null; cancelledAtUtc: string | null; createdAtUtc: string; updatedAtUtc: string | null }
export type LeaveRequestApproval = { id: string; levelNumber: number; approverType: LeaveApproverType; approverUserId: string | null; approverRoleId: string | null; status: LeaveApprovalStatus; comment: string | null; actedAtUtc: string | null }
export type LeaveRequestDetails = { request: LeaveRequest; balance: LeaveBalance | null; approvals: LeaveRequestApproval[]; reason: string; cancellationReason: string | null; canEdit: boolean; canCancel: boolean; canApprove: boolean; canDecline: boolean }
export type LeaveRequestTypeOption = { id: string; code: string; name: string; availableDays: number; allowHalfDay: boolean; allowNegativeBalance: boolean; requiresAttachment: boolean }
export type LeaveRequestOptions = { leaveTypes: LeaveRequestTypeOption[]; balances: LeaveBalance[]; dayPortions: LeaveDayPortion[]; approvalEnabled: boolean; allowPendingCancellation: boolean; dateCalculationPolicy: string }
export type LeaveRequestFilters = { search?: string; status?: LeaveRequestStatus; employeeId?: string; departmentId?: string; leaveTypeId?: string; currentApprovalLevel?: number; year?: number; startDate?: string; endDate?: string; submittedFromUtc?: string; submittedToUtc?: string; page: number; pageSize: number; sortBy?: string; sortDirection?: 'asc' | 'desc' }
export type LeaveRequestInput = { leaveTypeId: string; startDate: string; endDate: string; startDayPortion: LeaveDayPortion; endDayPortion: LeaveDayPortion; reason: string }
export type LeaveDecisionInput = { comment?: string }
export type LeaveListResponse = PagedResponse<LeaveRequest>
