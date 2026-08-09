import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { getAssignmentOptions } from '../api/attendanceApi'
import { attendanceKeys } from '../api/attendanceEmployeeKeys'
import { getAttendanceDashboardSummary, getCompanyAttendance, getCompanyAttendanceById } from '../api/attendanceApi'
import type { CompanyAttendanceFilters } from '../types/attendance.types'
import type { AuthState } from '../../auth/types/auth.types'

function canManageAttendance(auth: AuthState) {
  return auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.manage'))
}

export function useAttendanceDashboardSummary(date?: string) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = canManageAttendance(auth)
  return useQuery({ queryKey: attendanceKeys.dashboardSummary(date ?? 'current'), queryFn: ({ signal }) => getAttendanceDashboardSummary(date, signal), enabled, staleTime: 30_000 })
}

export function useCompanyAttendance(filters: CompanyAttendanceFilters) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = canManageAttendance(auth)
  return useQuery({ queryKey: attendanceKeys.companyList(filters), queryFn: ({ signal }) => getCompanyAttendance(filters, signal), enabled, placeholderData: keepPreviousData })
}

export function useCompanyAttendanceDetails(id: string | undefined) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = Boolean(id) && canManageAttendance(auth)
  return useQuery({ queryKey: attendanceKeys.companyDetails(id ?? ''), queryFn: ({ signal }) => getCompanyAttendanceById(id as string, signal), enabled })
}

export function useCompanyAttendanceOptions() {
  const auth = useAppSelector((state) => state.auth)
  const enabled = canManageAttendance(auth)
  return useQuery({ queryKey: [...attendanceKeys.all, 'company-options'], queryFn: ({ signal }) => getAssignmentOptions(signal), enabled, staleTime: 5 * 60 * 1000 })
}
