import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import { addAttendanceCorrection, approveAttendanceCorrection, cancelAttendanceCorrection, declineAttendanceCorrection, getAttendanceCorrectionById, getAttendanceCorrectionOptions, getAttendanceCorrectionQueue, getAttendanceCorrectionQueueOptions, getMyAttendanceCorrectionById, getMyAttendanceCorrections } from '../api/attendanceApi'
import { attendanceKeys } from '../api/attendanceEmployeeKeys'
import type { AddAttendanceCorrectionInput, AttendanceCorrectionDecisionInput, AttendanceCorrectionQueueFilters, AttendanceCorrectionsFilters, CancelAttendanceCorrectionInput } from '../types/attendance.types'

export function useAttendanceCorrectionOptions(id: string | undefined) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = Boolean(id) && auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  return useQuery({ queryKey: attendanceKeys.correctionOptions(id ?? ''), queryFn: ({ signal }) => getAttendanceCorrectionOptions(id as string, signal), enabled })
}

export function useMyAttendanceCorrections(filters: AttendanceCorrectionsFilters) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  return useQuery({ queryKey: attendanceKeys.myCorrections(filters), queryFn: ({ signal }) => getMyAttendanceCorrections(filters, signal), enabled, placeholderData: keepPreviousData })
}

export function useMyAttendanceCorrectionDetails(id: string | undefined) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = Boolean(id) && auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.view'))
  return useQuery({ queryKey: attendanceKeys.myCorrectionDetails(id ?? ''), queryFn: ({ signal }) => getMyAttendanceCorrectionById(id as string, signal), enabled })
}

export function useAttendanceCorrectionQueue(filters: AttendanceCorrectionQueueFilters) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.correct'))
  return useQuery({ queryKey: attendanceKeys.correctionQueue(filters), queryFn: ({ signal }) => getAttendanceCorrectionQueue(filters, signal), enabled, placeholderData: keepPreviousData })
}

export function useAttendanceCorrectionQueueOptions() {
  const auth = useAppSelector((state) => state.auth)
  const enabled = auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.correct'))
  return useQuery({ queryKey: attendanceKeys.correctionQueueOptions(), queryFn: ({ signal }) => getAttendanceCorrectionQueueOptions(signal), enabled, staleTime: 5 * 60 * 1000 })
}

export function useAttendanceCorrectionReviewDetails(id: string | undefined) {
  const auth = useAppSelector((state) => state.auth)
  const enabled = Boolean(id) && auth.status === 'authenticated' && Boolean(auth.user?.permissions.includes('attendance.correct'))
  return useQuery({ queryKey: attendanceKeys.correctionReviewDetails(id ?? ''), queryFn: ({ signal }) => getAttendanceCorrectionById(id as string, signal), enabled })
}

export function useAttendanceCorrectionMutations(id?: string, attendanceRecordId?: string) {
  const client = useQueryClient()
  const refreshEmployee = () => Promise.all([
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-corrections'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-correction-details'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'correction-options'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'correction-queue'] }),
    ...(attendanceRecordId ? [client.invalidateQueries({ queryKey: attendanceKeys.correctionOptions(attendanceRecordId) }), client.invalidateQueries({ queryKey: attendanceKeys.myDetails(attendanceRecordId) })] : []),
  ])
  const refreshReview = () => Promise.all([
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'correction-queue'] }),
    ...(id ? [client.invalidateQueries({ queryKey: attendanceKeys.correctionReviewDetails(id) })] : []),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-corrections'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-correction-details'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'correction-options'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'today'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-history'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'my-details'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'company-list'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'company-details'] }),
    client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'dashboard-summary'] }),
  ])
  return {
    add: useMutation({ mutationFn: (request: AddAttendanceCorrectionInput) => addAttendanceCorrection(request), onSuccess: async () => { await refreshEmployee(); await client.invalidateQueries({ queryKey: [...attendanceKeys.all, 'correction-queue'] }) } }),
    cancel: useMutation({ mutationFn: ({ id: correctionId, request }: { id: string; request: CancelAttendanceCorrectionInput }) => cancelAttendanceCorrection(correctionId, request), onSuccess: refreshEmployee }),
    approve: useMutation({ mutationFn: ({ id: correctionId, request }: { id: string; request: AttendanceCorrectionDecisionInput }) => approveAttendanceCorrection(correctionId, request), onSuccess: refreshReview }),
    decline: useMutation({ mutationFn: ({ id: correctionId, request }: { id: string; request: AttendanceCorrectionDecisionInput }) => declineAttendanceCorrection(correctionId, request), onSuccess: refreshReview }),
  }
}
