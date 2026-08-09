import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { addCheckIn, getCheckInOptions, getMyAttendanceById, getMyAttendanceHistory, getMyAttendanceToday, updateCheckOut } from '../api/attendanceApi'
import { attendanceKeys } from '../api/attendanceEmployeeKeys'
import type { AttendanceHistoryFilters } from '../types/attendance.types'

export function useAttendanceEmployeeQueries() {
  const auth = useAppSelector((state) => state.auth)
  const canView = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  const canCheck = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.check'))
  const today = useQuery({ queryKey: attendanceKeys.today(), queryFn: ({ signal }) => getMyAttendanceToday(signal), enabled: canView })
  const options = useQuery({ queryKey: attendanceKeys.checkInOptions(), queryFn: ({ signal }) => getCheckInOptions(signal), enabled: canCheck })
  return { today, options }
}

export function useMyAttendanceHistory(filters: AttendanceHistoryFilters) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  return useQuery({ queryKey: attendanceKeys.myHistory(filters), queryFn: ({ signal }) => getMyAttendanceHistory(filters, signal), enabled, placeholderData: keepPreviousData })
}

export function useMyAttendanceDetails(id: string | undefined) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = Boolean(id) && auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  return useQuery({ queryKey: attendanceKeys.myDetails(id ?? ''), queryFn: ({ signal }) => getMyAttendanceById(id as string, signal), enabled })
}

export function useAttendanceEmployeeMutations() {
  const client = useQueryClient()
  const refresh = async (id?: string) => { await Promise.all([client.invalidateQueries({ queryKey: attendanceKeys.today() }), client.invalidateQueries({ queryKey: attendanceKeys.checkInOptions() }), client.invalidateQueries({ queryKey: attendanceKeys.myHistory({ page: 1, pageSize: 20 }) }), ...(id ? [client.invalidateQueries({ queryKey: attendanceKeys.myDetails(id) }), client.invalidateQueries({ queryKey: attendanceKeys.companyDetails(id) })] : []), client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'company-list'] }), client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'dashboard-summary'] })]) }
  return {
    checkIn: useMutation({ mutationFn: addCheckIn, onSuccess: async (record) => refresh(record.id) }),
    checkOut: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof updateCheckOut>[1] }) => updateCheckOut(id, request), onSuccess: async (record) => refresh(record.id) }),
  }
}
