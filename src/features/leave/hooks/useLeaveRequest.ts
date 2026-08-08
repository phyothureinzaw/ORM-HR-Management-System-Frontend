import { useQuery } from '@tanstack/react-query'; import { getLeaveRequest } from '../api/leaveRequestApi'; import { leaveKeys } from '../api/leaveKeys'
export function useLeaveRequest(id: string | undefined) { return useQuery({ queryKey: leaveKeys.detail(id ?? ''), queryFn: ({ signal }) => getLeaveRequest(id as string, signal), enabled: Boolean(id) }) }
