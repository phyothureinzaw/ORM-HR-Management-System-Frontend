import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { activateAssignment, activateLocation, activateWorkShift, addAssignment, addLocation, addWorkShift, deactivateAssignment, deactivateLocation, deactivateWorkShift, getAssignment, getAssignmentOptions, getAssignments, getLocation, getLocations, getSettingOptions, getSettings, getWorkShift, getWorkShiftOptions, getWorkShifts, updateAssignment, updateLocation, updateSettings, updateWorkShift } from '../api/attendanceApi'
import { attendanceConfigurationKeys as keys } from '../api/attendanceKeys'
import type { AssignmentFilters, AttendanceLocationFilters, WorkShiftFilters } from '../types/attendance.types'

export function useWorkShifts(filters: WorkShiftFilters) { return useQuery({ queryKey: keys.workShiftList(filters), queryFn: ({ signal }) => getWorkShifts(filters, signal), placeholderData: keepPreviousData }) }
export function useWorkShift(id: string | undefined) { return useQuery({ queryKey: keys.workShiftDetail(id ?? ''), queryFn: ({ signal }) => getWorkShift(id as string, signal), enabled: Boolean(id) }) }
export function useWorkShiftOptions() { return useQuery({ queryKey: keys.workShiftOptions(), queryFn: ({ signal }) => getWorkShiftOptions(signal), staleTime: 5 * 60 * 1000 }) }
export function useLocations(filters: AttendanceLocationFilters) { return useQuery({ queryKey: keys.locationList(filters), queryFn: ({ signal }) => getLocations(filters, signal), placeholderData: keepPreviousData }) }
export function useLocation(id: string | undefined) { return useQuery({ queryKey: keys.locationDetail(id ?? ''), queryFn: ({ signal }) => getLocation(id as string, signal), enabled: Boolean(id) }) }
export function useAttendanceSettings() { return useQuery({ queryKey: keys.settings(), queryFn: ({ signal }) => getSettings(signal) }) }
export function useAttendanceSettingOptions() { return useQuery({ queryKey: keys.settingOptions(), queryFn: ({ signal }) => getSettingOptions(signal), staleTime: 5 * 60 * 1000 }) }
export function useAssignments(filters: AssignmentFilters) { return useQuery({ queryKey: keys.assignmentList(filters), queryFn: ({ signal }) => getAssignments(filters, signal), placeholderData: keepPreviousData }) }
export function useAssignment(id: string | undefined) { return useQuery({ queryKey: keys.assignmentDetail(id ?? ''), queryFn: ({ signal }) => getAssignment(id as string, signal), enabled: Boolean(id) }) }
export function useAssignmentOptions() { return useQuery({ queryKey: keys.assignmentOptions(), queryFn: ({ signal }) => getAssignmentOptions(signal), staleTime: 5 * 60 * 1000 }) }

export function useAttendanceConfigurationMutations() {
  const client = useQueryClient()
  const invalidate = async (...queryKeys: readonly (readonly unknown[])[]) => { await Promise.all(queryKeys.map((queryKey) => client.invalidateQueries({ queryKey }))) }
  const invalidateWorkShifts = (id?: string) => invalidate(keys.workShifts(), keys.settings(), keys.assignments(), ...(id ? [keys.workShiftDetail(id)] : []))
  const invalidateLocations = (id?: string) => invalidate(keys.locations(), keys.settings(), ...(id ? [keys.locationDetail(id)] : []))
  const invalidateAssignments = (id?: string) => invalidate(keys.assignments(), ...(id ? [keys.assignmentDetail(id)] : []))
  return {
    addWorkShift: useMutation({ mutationFn: addWorkShift, onSuccess: () => invalidateWorkShifts() }),
    updateWorkShift: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof updateWorkShift>[1] }) => updateWorkShift(id, request), onSuccess: (value) => invalidateWorkShifts(value.id) }),
    activateWorkShift: useMutation({ mutationFn: activateWorkShift, onSuccess: () => invalidateWorkShifts() }),
    deactivateWorkShift: useMutation({ mutationFn: deactivateWorkShift, onSuccess: () => invalidateWorkShifts() }),
    addLocation: useMutation({ mutationFn: addLocation, onSuccess: () => invalidateLocations() }),
    updateLocation: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof updateLocation>[1] }) => updateLocation(id, request), onSuccess: (value) => invalidateLocations(value.id) }),
    activateLocation: useMutation({ mutationFn: activateLocation, onSuccess: () => invalidateLocations() }),
    deactivateLocation: useMutation({ mutationFn: deactivateLocation, onSuccess: () => invalidateLocations() }),
    updateSettings: useMutation({ mutationFn: updateSettings, onSuccess: () => invalidate(keys.settings(), keys.settingOptions()) }),
    addAssignment: useMutation({ mutationFn: addAssignment, onSuccess: () => invalidateAssignments() }),
    updateAssignment: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof updateAssignment>[1] }) => updateAssignment(id, request), onSuccess: (value) => invalidateAssignments(value.id) }),
    activateAssignment: useMutation({ mutationFn: activateAssignment, onSuccess: () => invalidateAssignments() }),
    deactivateAssignment: useMutation({ mutationFn: deactivateAssignment, onSuccess: () => invalidateAssignments() }),
  }
}
