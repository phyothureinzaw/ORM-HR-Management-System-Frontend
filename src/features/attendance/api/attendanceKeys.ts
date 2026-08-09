import type { AssignmentFilters, AttendanceLocationFilters, WorkShiftFilters } from '../types/attendance.types'

export const attendanceConfigurationKeys = {
  all: ['attendance-configuration'] as const,
  workShifts: () => [...attendanceConfigurationKeys.all, 'work-shifts'] as const,
  workShiftList: (filters: WorkShiftFilters) => [...attendanceConfigurationKeys.workShifts(), 'list', filters] as const,
  workShiftDetails: () => [...attendanceConfigurationKeys.workShifts(), 'detail'] as const,
  workShiftDetail: (id: string) => [...attendanceConfigurationKeys.workShiftDetails(), id] as const,
  workShiftOptions: () => [...attendanceConfigurationKeys.workShifts(), 'options'] as const,
  locations: () => [...attendanceConfigurationKeys.all, 'locations'] as const,
  locationList: (filters: AttendanceLocationFilters) => [...attendanceConfigurationKeys.locations(), 'list', filters] as const,
  locationDetails: () => [...attendanceConfigurationKeys.locations(), 'detail'] as const,
  locationDetail: (id: string) => [...attendanceConfigurationKeys.locationDetails(), id] as const,
  settings: () => [...attendanceConfigurationKeys.all, 'settings'] as const,
  settingOptions: () => [...attendanceConfigurationKeys.settings(), 'options'] as const,
  assignments: () => [...attendanceConfigurationKeys.all, 'assignments'] as const,
  assignmentList: (filters: AssignmentFilters) => [...attendanceConfigurationKeys.assignments(), 'list', filters] as const,
  assignmentDetails: () => [...attendanceConfigurationKeys.assignments(), 'detail'] as const,
  assignmentDetail: (id: string) => [...attendanceConfigurationKeys.assignmentDetails(), id] as const,
  assignmentOptions: () => [...attendanceConfigurationKeys.assignments(), 'options'] as const,
} as const
