import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getEmployeeById, getEmployeeFormOptions, getEmployees } from '../api/employeeApi'
import { employeeKeys } from '../api/employeeKeys'
import type { EmployeeListParams } from '../types/employee.types'

export function useEmployees(params: EmployeeListParams) { return useQuery({ queryKey: employeeKeys.list(params), queryFn: ({ signal }) => getEmployees(params, signal), placeholderData: keepPreviousData }) }
export function useEmployee(id: string | undefined) { return useQuery({ queryKey: employeeKeys.detail(id ?? ''), queryFn: ({ signal }) => getEmployeeById(id as string, signal), enabled: Boolean(id) }) }
export function useEmployeeFormOptions() { return useQuery({ queryKey: employeeKeys.formOptions(), queryFn: ({ signal }) => getEmployeeFormOptions(signal), staleTime: 5 * 60 * 1000 }) }
