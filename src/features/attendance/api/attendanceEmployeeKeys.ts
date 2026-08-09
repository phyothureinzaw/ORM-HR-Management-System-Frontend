import type { AttendanceHistoryFilters, CompanyAttendanceFilters } from '../types/attendance.types'

export const attendanceKeys = {
  all: ['attendance'] as const,
  today: () => [...attendanceKeys.all, 'today'] as const,
  checkInOptions: () => [...attendanceKeys.all, 'check-in-options'] as const,
  myHistory: (filters: AttendanceHistoryFilters) => [...attendanceKeys.all, 'my-history', filters] as const,
  myDetails: (id: string) => [...attendanceKeys.all, 'my-details', id] as const,
  companyLists: () => [...attendanceKeys.all, 'company-lists'] as const,
  companyList: (filters: CompanyAttendanceFilters) => [...attendanceKeys.all, 'company-list', normalizeCompanyFilters(filters)] as const,
  companyDetails: (id: string) => [...attendanceKeys.all, 'company-details', id] as const,
  dashboardSummary: (date: string) => [...attendanceKeys.all, 'dashboard-summary', date] as const,
}

function normalizeCompanyFilters(filters: CompanyAttendanceFilters) {
  return {
    attendanceDate: filters.attendanceDate ?? '', startDate: filters.startDate ?? '', endDate: filters.endDate ?? '', search: filters.search ?? '',
    employeeId: filters.employeeId ?? '', departmentId: filters.departmentId ?? '', workShiftId: filters.workShiftId ?? '', status: filters.status ?? null,
    lateOnly: filters.lateOnly, outsideLocationOnly: filters.outsideLocationOnly, incompleteOnly: filters.incompleteOnly,
    page: filters.page, pageSize: filters.pageSize,
  }
}
