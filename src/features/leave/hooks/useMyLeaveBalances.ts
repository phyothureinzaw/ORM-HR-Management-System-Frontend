import { useQuery } from '@tanstack/react-query'; import { getMyLeaveBalances } from '../api/leaveRequestApi'; import { leaveKeys } from '../api/leaveKeys'
export function useMyLeaveBalances(year = new Date().getFullYear()) { return useQuery({ queryKey: leaveKeys.myBalances(year), queryFn: ({ signal }) => getMyLeaveBalances(year, signal) }) }
