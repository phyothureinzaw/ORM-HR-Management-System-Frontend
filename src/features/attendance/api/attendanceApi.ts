import { apiClient } from '../../../lib/api/apiClient'
import type { AddCheckInInput, AssignmentFilters, AssignmentOptions, AttendanceDashboardSummary, AttendanceHistoryFilters, AttendanceLocation, AttendanceLocationFilters, AttendanceLocationInput, AttendanceRecord, AttendanceSettings, AttendanceSettingsOptions, AttendanceToday, CheckInOptions, CompanyAttendanceFilters, EmployeeShiftAssignment, EmployeeShiftAssignmentInput, PagedResponse, UpdateAttendanceSettingsInput, UpdateEmployeeShiftAssignmentInput, UpdateAttendanceLocationInput, UpdateCheckOutInput, UpdateWorkShiftInput, WorkShift, WorkShiftFilters, WorkShiftInput, WorkShiftOption } from '../types/attendance.types'

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
