import { useQuery } from '@tanstack/react-query'; import { getLeaveRequestOptions } from '../api/leaveRequestApi'; import { leaveKeys } from '../api/leaveKeys'
export function useLeaveRequestOptions(year = new Date().getFullYear()) { return useQuery({ queryKey: leaveKeys.requestOptions(year), queryFn: ({ signal }) => getLeaveRequestOptions(year, signal), staleTime: 300000 }) }
