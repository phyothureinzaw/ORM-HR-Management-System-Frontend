import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import * as api from '../api/overtimeApi'
import { overtimeKeys as keys } from '../api/overtimeKeys'
import type { ProjectFilters, TypeFilters } from '../types/overtime.types'

const enabled = (permissions: string[], status: string) => status === 'authenticated' && permissions.includes('overtime.manage')
export function useOvertimeTypes(filters: TypeFilters) { const auth = useAppSelector((state) => state.auth); return useQuery({ queryKey: keys.typeList(filters), queryFn: ({ signal }) => api.getOvertimeTypes(filters, signal), placeholderData: keepPreviousData, enabled: enabled(auth.user?.permissions ?? [], auth.status) }) }
export function useOvertimeType(id: string | undefined) { const auth = useAppSelector((state) => state.auth); return useQuery({ queryKey: keys.typeDetails(id ?? ''), queryFn: ({ signal }) => api.getOvertimeType(id as string, signal), enabled: Boolean(id) && enabled(auth.user?.permissions ?? [], auth.status) }) }
export function useOvertimeProjects(filters: ProjectFilters) { const auth = useAppSelector((state) => state.auth); return useQuery({ queryKey: keys.projectList(filters), queryFn: ({ signal }) => api.getOvertimeProjects(filters, signal), placeholderData: keepPreviousData, enabled: enabled(auth.user?.permissions ?? [], auth.status) }) }
export function useOvertimeProject(id: string | undefined) { const auth = useAppSelector((state) => state.auth); return useQuery({ queryKey: keys.projectDetails(id ?? ''), queryFn: ({ signal }) => api.getOvertimeProject(id as string, signal), enabled: Boolean(id) && enabled(auth.user?.permissions ?? [], auth.status) }) }
export function useOvertimeSettingOptions() { const auth = useAppSelector((state) => state.auth); return useQuery({ queryKey: keys.settingOptions(), queryFn: ({ signal }) => api.getOvertimeSettingOptions(signal), enabled: enabled(auth.user?.permissions ?? [], auth.status) }) }
export function useOvertimeApproval() { const auth = useAppSelector((state) => state.auth); const ok = enabled(auth.user?.permissions ?? [], auth.status); return { settings: useQuery({ queryKey: keys.approvalSettings(), queryFn: ({ signal }) => api.getApprovalSettings(signal), enabled: ok }), options: useQuery({ queryKey: keys.approvalOptions(), queryFn: ({ signal }) => api.getApprovalOptions(signal), enabled: ok }), levels: useQuery({ queryKey: keys.approvalLevels(), queryFn: ({ signal }) => api.getApprovalLevels(signal), enabled: ok }) } }

export function useOvertimeConfigurationMutations() {
  const client = useQueryClient()
  const invalidate = (...queryKeys: readonly (readonly unknown[])[]) => Promise.all(queryKeys.map((queryKey) => client.invalidateQueries({ queryKey })))
  const allTypes = () => invalidate(keys.types(), keys.typeOptions(), keys.requestOptions())
  const allProjects = () => invalidate(keys.projects(), keys.settingOptions(), keys.requestOptions())
  return {
    addType: useMutation({ mutationFn: api.addOvertimeType, onSuccess: allTypes }),
    updateType: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.updateOvertimeType>[1] }) => api.updateOvertimeType(id, request), onSuccess: (value) => invalidate(keys.types(), keys.typeDetails(value.id), keys.typeOptions(), keys.requestOptions()) }),
    activateType: useMutation({ mutationFn: api.activateOvertimeType, onSuccess: allTypes }),
    deactivateType: useMutation({ mutationFn: api.deactivateOvertimeType, onSuccess: allTypes }),
    addProject: useMutation({ mutationFn: api.addOvertimeProject, onSuccess: allProjects }),
    updateProject: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.updateOvertimeProject>[1] }) => api.updateOvertimeProject(id, request), onSuccess: (value) => invalidate(keys.projects(), keys.projectDetails(value.id), keys.settingOptions(), keys.requestOptions()) }),
    activateProject: useMutation({ mutationFn: api.activateOvertimeProject, onSuccess: allProjects }),
    deactivateProject: useMutation({ mutationFn: api.deactivateOvertimeProject, onSuccess: allProjects }),
    updateSettings: useMutation({ mutationFn: api.updateOvertimeSettings, onSuccess: () => invalidate(keys.settings(), keys.settingOptions(), keys.types(), keys.projects(), keys.requestOptions()) }),
    updateApprovalSettings: useMutation({ mutationFn: api.updateApprovalSettings, onSuccess: () => invalidate(keys.approvalSettings(), keys.approvalOptions(), keys.approvalLevels(), keys.requestOptions()) }),
    addLevel: useMutation({ mutationFn: api.addApprovalLevel, onSuccess: () => invalidate(keys.approvalLevels(), keys.approvalOptions(), keys.requestOptions()) }),
    updateLevel: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.updateApprovalLevel>[1] }) => api.updateApprovalLevel(id, request), onSuccess: (value) => invalidate(keys.approvalLevels(), keys.approvalLevelDetails(value.id), keys.approvalOptions(), keys.requestOptions()) }),
    activateLevel: useMutation({ mutationFn: api.activateApprovalLevel, onSuccess: () => invalidate(keys.approvalLevels(), keys.approvalOptions(), keys.requestOptions()) }),
    deactivateLevel: useMutation({ mutationFn: api.deactivateApprovalLevel, onSuccess: () => invalidate(keys.approvalLevels(), keys.approvalOptions(), keys.requestOptions()) }),
  }
}
