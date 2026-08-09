import { apiClient } from '../../../lib/api/apiClient'
import type { AddAttendanceCorrectionInput, AddCheckInInput, AssignmentFilters, AssignmentOptions, AttendanceCorrectionDecisionInput, AttendanceCorrectionOptions, AttendanceCorrectionQueueFilters, AttendanceCorrectionQueueOptions, AttendanceCorrectionReviewDetails, AttendanceCorrectionSummary, AttendanceCorrectionsFilters, AttendanceDashboardSummary, AttendanceHistoryFilters, AttendanceLocation, AttendanceLocationFilters, AttendanceLocationInput, AttendanceRecord, AttendanceRecordDetails, AttendanceSettings, AttendanceSettingsOptions, AttendanceToday, CancelAttendanceCorrectionInput, CheckInOptions, CompanyAttendanceFilters, EmployeeShiftAssignment, EmployeeShiftAssignmentInput, PagedResponse, UpdateAttendanceSettingsInput, UpdateEmployeeShiftAssignmentInput, UpdateAttendanceLocationInput, UpdateCheckOutInput, UpdateWorkShiftInput, WorkShift, WorkShiftFilters, WorkShiftInput, WorkShiftOption } from '../types/attendance.types'

const encode = (id: string) => encodeURIComponent(id)

export async function getWorkShifts(params: WorkShiftFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<WorkShift>>('/api/WorkShift/GetWorkShifts', { params, signal })).data }
export async function getWorkShift(id: string, signal?: AbortSignal) { return (await apiClient.get<WorkShift>(`/api/WorkShift/GetWorkShiftById/${encode(id)}`, { signal })).data }
export async function getWorkShiftOptions(signal?: AbortSignal) { return (await apiClient.get<WorkShiftOption[]>('/api/WorkShift/GetWorkShiftFormOptions', { signal })).data }
export async function addWorkShift(request: WorkShiftInput) { return (await apiClient.post<WorkShift>('/api/WorkShift/AddWorkShift', request)).data }
export async function updateWorkShift(id: string, request: UpdateWorkShiftInput) { return (await apiClient.put<WorkShift>(`/api/WorkShift/UpdateWorkShift/${encode(id)}`, request)).data }
export async function activateWorkShift(id: string) { return (await apiClient.post<WorkShift>(`/api/WorkShift/ActivateWorkShift/${encode(id)}`)).data }
export async function deactivateWorkShift(id: string) { await apiClient.post<void>(`/api/WorkShift/DeactivateWorkShift/${encode(id)}`) }

export async function getLocations(params: AttendanceLocationFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<AttendanceLocation>>('/api/AttendanceLocation/GetAttendanceLocations', { params, signal })).data }
export async function getLocation(id: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceLocation>(`/api/AttendanceLocation/GetAttendanceLocationById/${encode(id)}`, { signal })).data }
export async function addLocation(request: AttendanceLocationInput) { return (await apiClient.post<AttendanceLocation>('/api/AttendanceLocation/AddAttendanceLocation', request)).data }
export async function updateLocation(id: string, request: UpdateAttendanceLocationInput) { return (await apiClient.put<AttendanceLocation>(`/api/AttendanceLocation/UpdateAttendanceLocation/${encode(id)}`, request)).data }
export async function activateLocation(id: string) { return (await apiClient.post<AttendanceLocation>(`/api/AttendanceLocation/ActivateAttendanceLocation/${encode(id)}`)).data }
export async function deactivateLocation(id: string) { await apiClient.post<void>(`/api/AttendanceLocation/DeactivateAttendanceLocation/${encode(id)}`) }

export async function getSettings(signal?: AbortSignal) { return (await apiClient.get<AttendanceSettings>('/api/AttendanceSetting/GetAttendanceSettings', { signal })).data }
export async function getSettingOptions(signal?: AbortSignal) { return (await apiClient.get<AttendanceSettingsOptions>('/api/AttendanceSetting/GetAttendanceSettingOptions', { signal })).data }
export async function updateSettings(request: UpdateAttendanceSettingsInput) { return (await apiClient.put<AttendanceSettings>('/api/AttendanceSetting/UpdateAttendanceSettings', request)).data }

export async function getAssignments(params: AssignmentFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<EmployeeShiftAssignment>>('/api/EmployeeShiftAssignment/GetEmployeeShiftAssignments', { params, signal })).data }
export async function getAssignment(id: string, signal?: AbortSignal) { return (await apiClient.get<EmployeeShiftAssignment>(`/api/EmployeeShiftAssignment/GetEmployeeShiftAssignmentById/${encode(id)}`, { signal })).data }
export async function getAssignmentOptions(signal?: AbortSignal) { return (await apiClient.get<AssignmentOptions>('/api/EmployeeShiftAssignment/GetEmployeeShiftAssignmentOptions', { signal })).data }
export async function addAssignment(request: EmployeeShiftAssignmentInput) { return (await apiClient.post<EmployeeShiftAssignment>('/api/EmployeeShiftAssignment/AddEmployeeShiftAssignment', request)).data }
export async function updateAssignment(id: string, request: UpdateEmployeeShiftAssignmentInput) { return (await apiClient.put<EmployeeShiftAssignment>(`/api/EmployeeShiftAssignment/UpdateEmployeeShiftAssignment/${encode(id)}`, request)).data }
export async function activateAssignment(id: string) { return (await apiClient.post<EmployeeShiftAssignment>(`/api/EmployeeShiftAssignment/ActivateEmployeeShiftAssignment/${encode(id)}`)).data }
export async function deactivateAssignment(id: string) { await apiClient.post<void>(`/api/EmployeeShiftAssignment/DeactivateEmployeeShiftAssignment/${encode(id)}`) }

export async function getMyAttendanceToday(signal?: AbortSignal) { return (await apiClient.get<AttendanceToday>('/api/Attendance/GetMyAttendanceToday', { signal })).data }
export async function getCheckInOptions(signal?: AbortSignal) { return (await apiClient.get<CheckInOptions>('/api/Attendance/GetCheckInOptions', { signal })).data }
export async function getMyAttendanceHistory(params: AttendanceHistoryFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<AttendanceRecord>>('/api/Attendance/GetMyAttendanceHistory', { params, signal })).data }
export async function getMyAttendanceById(id: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceRecord>(`/api/Attendance/GetMyAttendanceById/${encode(id)}`, { signal })).data }
export async function getCompanyAttendance(params: CompanyAttendanceFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<AttendanceRecord>>('/api/Attendance/GetCompanyAttendance', { params: { ...params, employeeId: params.employeeId || undefined, departmentId: params.departmentId || undefined, workShiftId: params.workShiftId || undefined, status: params.status || undefined, search: params.search || undefined }, signal })).data }
export async function getCompanyAttendanceById(id: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceRecord>(`/api/Attendance/GetCompanyAttendanceById/${encode(id)}`, { signal })).data }
export async function getAttendanceDashboardSummary(attendanceDate?: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceDashboardSummary>('/api/Attendance/GetAttendanceDashboardSummary', { params: attendanceDate ? { attendanceDate } : undefined, signal })).data }
export async function addCheckIn(request: AddCheckInInput) { return (await apiClient.post<AttendanceRecord>('/api/Attendance/AddCheckIn', request)).data }
export async function updateCheckOut(id: string, request: UpdateCheckOutInput) { return (await apiClient.put<AttendanceRecord>(`/api/Attendance/UpdateCheckOut/${encode(id)}`, request)).data }

const correctionParams = (value: AttendanceCorrectionsFilters | AttendanceCorrectionQueueFilters) => Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== ''))
export async function getAttendanceCorrectionOptions(recordId: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceCorrectionOptions>(`/api/AttendanceCorrection/GetAttendanceCorrectionOptions/${encode(recordId)}`, { signal })).data }
export async function getAttendanceCorrectionQueueOptions(signal?: AbortSignal) { return (await apiClient.get<AttendanceCorrectionQueueOptions>('/api/AttendanceCorrection/GetAttendanceCorrectionQueueOptions', { signal })).data }
export async function getMyAttendanceCorrections(filters: AttendanceCorrectionsFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<AttendanceCorrectionSummary>>('/api/AttendanceCorrection/GetMyAttendanceCorrections', { params: correctionParams(filters), signal })).data }
export async function getMyAttendanceCorrectionById(id: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceRecordDetails>(`/api/AttendanceCorrection/GetMyAttendanceCorrectionById/${encode(id)}`, { signal })).data }
export async function addAttendanceCorrection(request: AddAttendanceCorrectionInput) { return (await apiClient.post<AttendanceRecordDetails>('/api/AttendanceCorrection/AddAttendanceCorrection', request)).data }
export async function cancelAttendanceCorrection(id: string, request: CancelAttendanceCorrectionInput) { return (await apiClient.post<AttendanceRecordDetails>(`/api/AttendanceCorrection/CancelAttendanceCorrection/${encode(id)}`, request)).data }
export async function getAttendanceCorrectionQueue(filters: AttendanceCorrectionQueueFilters, signal?: AbortSignal) { return (await apiClient.get<PagedResponse<AttendanceCorrectionSummary>>('/api/AttendanceCorrection/GetAttendanceCorrectionQueue', { params: correctionParams(filters), signal })).data }
export async function getAttendanceCorrectionById(id: string, signal?: AbortSignal) { return (await apiClient.get<AttendanceCorrectionReviewDetails>(`/api/AttendanceCorrection/GetAttendanceCorrectionById/${encode(id)}`, { signal })).data }
export async function approveAttendanceCorrection(id: string, request: AttendanceCorrectionDecisionInput) { return (await apiClient.post<AttendanceCorrectionReviewDetails>(`/api/AttendanceCorrection/ApproveAttendanceCorrection/${encode(id)}`, request)).data }
export async function declineAttendanceCorrection(id: string, request: AttendanceCorrectionDecisionInput) { return (await apiClient.post<AttendanceCorrectionReviewDetails>(`/api/AttendanceCorrection/DeclineAttendanceCorrection/${encode(id)}`, request)).data }
