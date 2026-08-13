import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAppSelector } from '../../../app/hooks'
import * as api from '../api/overtimeApi'
import { overtimeKeys as keys } from '../api/overtimeKeys'
import type { OvertimeApprovalFilters, OvertimeCompanyFilters, OvertimeRequestFilters } from '../types/overtime.types'

function allowed(status: string, permissions: string[], permission: string) { return status === 'authenticated' && permissions.includes(permission) }
function useAuthPermission(permission: string) { const auth = useAppSelector((state) => state.auth); return allowed(auth.status, auth.user?.permissions ?? [], permission) }

export function useOvertimeRequestOptions() { const enabled = useAuthPermission('overtime.request'); return useQuery({ queryKey: keys.requestOptions(), queryFn: ({ signal }) => api.getOvertimeRequestOptions(signal), initialData: undefined as never, enabled }) }
export function useMyOvertimeRequests(filters: OvertimeRequestFilters) { const enabled = useAuthPermission('overtime.view'); return useQuery({ queryKey: keys.myRequests(filters), queryFn: ({ signal }) => api.getMyOvertimeRequests(filters, signal), placeholderData: keepPreviousData, enabled }) }
export function useMyOvertimeRequest(id: string | undefined) { const enabled = useAuthPermission('overtime.view'); return useQuery({ queryKey: keys.requestDetails(id ?? ''), queryFn: ({ signal }) => api.getMyOvertimeRequest(id as string, signal), enabled: Boolean(id) && enabled }) }
export function useOvertimeApprovalQueue(filters: OvertimeApprovalFilters) { const enabled = useAuthPermission('overtime.approve'); return useQuery({ queryKey: keys.approvalQueue(filters), queryFn: ({ signal }) => api.getOvertimeApprovalQueue(filters, signal), placeholderData: keepPreviousData, enabled }) }
export function useOvertimeApprovalQueueOptions() { const enabled = useAuthPermission('overtime.approve'); return useQuery({ queryKey: keys.approvalQueueOptions(), queryFn: ({ signal }) => api.getOvertimeApprovalQueueOptions(signal), enabled }) }
export function useOvertimeApprovalRequest(id: string | undefined) { const enabled = useAuthPermission('overtime.approve'); return useQuery({ queryKey: keys.approvalDetails(id ?? ''), queryFn: ({ signal }) => api.getOvertimeApprovalRequest(id as string, signal), enabled: Boolean(id) && enabled }) }
export function useCompanyOvertime(filters: OvertimeCompanyFilters, enabled = true) { const allowed = useAuthPermission('overtime.manage'); return useQuery({ queryKey: keys.companyList(filters), queryFn: ({ signal }) => api.getCompanyOvertime(filters, signal), placeholderData: keepPreviousData, enabled: allowed && enabled }) }
export function useCompanyOvertimeDetails(id: string | undefined) { const allowed = useAuthPermission('overtime.manage'); return useQuery({ queryKey: keys.companyDetails(id ?? ''), queryFn: ({ signal }) => api.getCompanyOvertimeById(id as string, signal), enabled: Boolean(id) && allowed }) }
export function useCompanyOvertimeOptions() { const allowed = useAuthPermission('overtime.manage'); return useQuery({ queryKey: keys.companyOptions(), queryFn: ({ signal }) => api.getCompanyOvertimeOptions(signal), enabled: allowed, staleTime: 5 * 60 * 1000 }) }
export function useOvertimeDashboardSummary(filters: Pick<OvertimeCompanyFilters, 'fromDate' | 'toDate'>, enabled = true) { const allowed = useAuthPermission('overtime.manage'); return useQuery({ queryKey: keys.dashboardSummary(filters), queryFn: ({ signal }) => api.getOvertimeDashboardSummary(filters, signal), enabled: allowed && enabled, staleTime: 30_000 }) }

export function useOvertimeRequestMutations() {
  const client = useQueryClient()
  const invalidate = (...queryKeys: readonly (readonly unknown[])[]) => Promise.all(queryKeys.map((queryKey) => client.invalidateQueries({ queryKey })))
  const requestData = (id?: string) => [keys.requests(), ...(id ? [keys.requestDetails(id)] : []), keys.requestOptions(), keys.approvals(), keys.company(), ...(id ? [keys.companyDetails(id)] : [])]
  return {
    calculate: useMutation({ mutationFn: api.calculateOvertimeRequest }),
     add: useMutation({ mutationFn: api.addOvertimeRequest, onSuccess: () => invalidate(...requestData()) }),
     update: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.updateOvertimeRequest>[1] }) => api.updateOvertimeRequest(id, request), onSuccess: (_value, variables) => invalidate(...requestData(variables.id)) }),
     cancel: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.cancelOvertimeRequest>[1] }) => api.cancelOvertimeRequest(id, request), onSuccess: (_value, variables) => invalidate(...requestData(variables.id)) }),
     approve: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.approveOvertimeRequest>[1] }) => api.approveOvertimeRequest(id, request), onSuccess: (_value, variables) => invalidate(...requestData(variables.id)) }),
     decline: useMutation({ mutationFn: ({ id, request }: { id: string; request: Parameters<typeof api.declineOvertimeRequest>[1] }) => api.declineOvertimeRequest(id, request), onSuccess: (_value, variables) => invalidate(...requestData(variables.id)) }),
  }
}
