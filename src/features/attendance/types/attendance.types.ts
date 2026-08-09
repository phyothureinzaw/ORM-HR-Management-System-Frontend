export type PagedResponse<T> = {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type WorkShift = {
  id: string
  code: string
  name: string
  description: string | null
  startTime: string
  endTime: string
  breakMinutes: number
  gracePeriodMinutes: number
  earlyCheckInMinutes: number
  workDaysMask: number
  workingDays: string[]
  crossesMidnight: boolean
  isDefault: boolean
  isActive: boolean
  rowVersion: string
}
export type WorkShiftInput = Pick<WorkShift, 'code' | 'name' | 'description' | 'startTime' | 'endTime' | 'breakMinutes' | 'gracePeriodMinutes' | 'earlyCheckInMinutes' | 'workDaysMask' | 'crossesMidnight' | 'isDefault'>
export type UpdateWorkShiftInput = WorkShiftInput & Pick<WorkShift, 'isActive' | 'rowVersion'>
export type WorkShiftFilters = { search?: string; isActive?: boolean; isDefault?: boolean; page: number; pageSize: number }
export type WorkShiftOption = { id: string; code: string; name: string; isDefault: boolean }

export type AttendanceLocation = { id: string; code: string; name: string; address: string | null; latitude: number; longitude: number; allowedRadiusMeters: number; isDefault: boolean; isActive: boolean; rowVersion: string }
export type AttendanceLocationInput = Pick<AttendanceLocation, 'code' | 'name' | 'address' | 'latitude' | 'longitude' | 'allowedRadiusMeters' | 'isDefault'>
export type UpdateAttendanceLocationInput = AttendanceLocationInput & Pick<AttendanceLocation, 'isActive' | 'rowVersion'>
export type AttendanceLocationFilters = { search?: string; isActive?: boolean; isDefault?: boolean; page: number; pageSize: number }
export type SettingsLocationOption = { id: string; code: string; name: string; isDefault: boolean }

export type AttendanceSettings = { id: string | null; defaultShiftId: string | null; requireLocation: boolean; allowOutsideLocation: boolean; requireOutsideLocationReason: boolean; requireCheckInRemark: boolean; requireCheckOutRemark: boolean; allowCorrectionRequests: boolean; autoMarkIncomplete: boolean; incompleteAfterMinutes: number; isActive: boolean; rowVersion: string | null }
export type UpdateAttendanceSettingsInput = Omit<AttendanceSettings, 'id' | 'rowVersion'> & { rowVersion?: string | null }
export type AttendanceSettingsOptions = { currentSettings: AttendanceSettings; activeShifts: WorkShiftOption[]; activeLocations: SettingsLocationOption[] }

export type EmployeeSummary = { id: string; employeeCode: string; fullName: string; jobTitle: string | null; isActive: boolean }
export type AssignmentShiftSummary = { id: string; code: string; name: string; isActive: boolean }
export type EmployeeShiftAssignment = { id: string; employee: EmployeeSummary; workShift: AssignmentShiftSummary; effectiveFrom: string; effectiveTo: string | null; isActive: boolean; rowVersion: string }
export type EmployeeShiftAssignmentInput = { employeeId: string; workShiftId: string; effectiveFrom: string; effectiveTo: string | null }
export type UpdateEmployeeShiftAssignmentInput = EmployeeShiftAssignmentInput & { isActive: boolean; rowVersion: string }
export type AssignmentFilters = { search?: string; employeeId?: string; workShiftId?: string; departmentId?: string; isActive?: boolean; effectiveDate?: string; page: number; pageSize: number }
export type DepartmentOption = { id: string; code: string; name: string }
export type AssignmentOptions = { employees: EmployeeSummary[]; workShifts: WorkShiftOption[]; departments: DepartmentOption[] }

export type AttendanceEmployeeSummary = { id: string; employeeCode: string; fullName: string; jobTitle: string | null; isActive: boolean }
export type AttendanceShiftSummary = { id: string; code: string; name: string; isActive: boolean }
export type AttendanceLocationSummary = { id: string; code: string; name: string }
export type AttendanceStatus = 1 | 2 | 3 | 4 | 5
export type AttendanceSource = 1 | 2 | 3 | 4 | 5
export type AttendanceRecord = { id: string; employee: AttendanceEmployeeSummary; attendanceDate: string; shift: AttendanceShiftSummary | null; scheduledStartDateTimeUtc: string | null; scheduledEndDateTimeUtc: string | null; checkInDateTimeUtc: string | null; checkOutDateTimeUtc: string | null; status: AttendanceStatus; source: AttendanceSource; lateMinutes: number; earlyLeaveMinutes: number; workMinutes: number; isCheckInOutsideLocation: boolean; isCheckOutOutsideLocation: boolean; checkInLatitude: number | null; checkInLongitude: number | null; checkOutLatitude: number | null; checkOutLongitude: number | null; checkInDistanceMeters: number | null; checkOutDistanceMeters: number | null; checkInLocation: AttendanceLocationSummary | null; checkOutLocation: AttendanceLocationSummary | null; checkInRemark: string | null; checkOutRemark: string | null; outsideCheckInReason: string | null; outsideCheckOutReason: string | null; isManuallyAdjusted: boolean; rowVersion: string }
export type AttendanceToday = { employee: AttendanceEmployeeSummary; companyLocalDate: string; attendance: AttendanceRecord | null; resolvedShift: AttendanceShiftSummary | null; scheduledStartDateTimeLocal: string | null; scheduledEndDateTimeLocal: string | null; canCheckIn: boolean; canCheckOut: boolean; blockingReason: string | null }
export type CheckInLocationOption = { id: string; code: string; name: string; allowedRadiusMeters: number }
export type CheckInSettings = { requireLocation: boolean; allowOutsideLocation: boolean; requireOutsideLocationReason: boolean; requireCheckInRemark: boolean; requireCheckOutRemark: boolean }
export type CheckInOptions = { serverUtcNow: string; companyLocalNow: string; companyLocalDate: string; employee: AttendanceEmployeeSummary; openAttendance: AttendanceRecord | null; canCheckIn: boolean; canCheckOut: boolean; blockingReason: string | null; resolvedShift: AttendanceShiftSummary | null; scheduledStartDateTimeLocal: string | null; scheduledEndDateTimeLocal: string | null; settings: CheckInSettings; activeLocations: CheckInLocationOption[] }
export type AddCheckInInput = { latitude?: number | null; longitude?: number | null; remark?: string | null; outsideLocationReason?: string | null }
export type UpdateCheckOutInput = { latitude?: number | null; longitude?: number | null; remark?: string | null; outsideLocationReason?: string | null; rowVersion?: string | null }
export type AttendanceHistoryFilters = { startDate?: string; endDate?: string; status?: AttendanceStatus; page: number; pageSize: number }

export type AttendanceDashboardSummary = {
  attendanceDate: string
  totalActiveEmployees: number
  checkedIn: number
  completed: number
  notCheckedIn: number
  late: number
  outsideLocation: number
  incomplete: number
  onApprovedFullDayLeave: number
  totalWorkMinutes: number
}

export type CompanyAttendanceFilters = {
  attendanceDate?: string
  startDate?: string
  endDate?: string
  search?: string
  employeeId?: string
  departmentId?: string
  workShiftId?: string
  status?: AttendanceStatus
  lateOnly: boolean
  outsideLocationOnly: boolean
  incompleteOnly: boolean
  page: number
  pageSize: number
}

export type DepartmentSummary = DepartmentOption
