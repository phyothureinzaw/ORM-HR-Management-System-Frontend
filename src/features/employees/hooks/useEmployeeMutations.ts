import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addEmployee, createEmployeeLogin, deactivateEmployee, disableEmployeeLogin, enableEmployeeLogin, reactivateEmployee, updateEmployee, updateEmployeeLogin } from '../api/employeeApi'
import { employeeKeys } from '../api/employeeKeys'
import type { AddEmployeeRequest, CreateEmployeeLoginRequest, UpdateEmployeeLoginRequest, UpdateEmployeeRequest } from '../types/employee.types'

export function useEmployeeMutations() {
  const client = useQueryClient()
  const invalidate = async (id?: string) => { await client.invalidateQueries({ queryKey: employeeKeys.lists() }); if (id) await client.invalidateQueries({ queryKey: employeeKeys.detail(id) }) }
  return {
    add: useMutation({ mutationFn: (request: AddEmployeeRequest) => addEmployee(request), onSuccess: (employee) => invalidate(employee.id) }),
    update: useMutation({ mutationFn: ({ id, request }: { id: string; request: UpdateEmployeeRequest }) => updateEmployee(id, request), onSuccess: (employee) => invalidate(employee.id) }),
    deactivate: useMutation({ mutationFn: (id: string) => deactivateEmployee(id), onSuccess: (_, id) => invalidate(id) }),
    reactivate: useMutation({ mutationFn: (id: string) => reactivateEmployee(id), onSuccess: (employee) => invalidate(employee.id) }),
    createLogin: useMutation({ mutationFn: ({ id, request }: { id: string; request: CreateEmployeeLoginRequest }) => createEmployeeLogin(id, request), onSuccess: (employee) => invalidate(employee.id) }),
    updateLogin: useMutation({ mutationFn: ({ id, request }: { id: string; request: UpdateEmployeeLoginRequest }) => updateEmployeeLogin(id, request), onSuccess: (employee) => invalidate(employee.id) }),
    disableLogin: useMutation({ mutationFn: (id: string) => disableEmployeeLogin(id), onSuccess: (_, id) => invalidate(id) }),
    enableLogin: useMutation({ mutationFn: (id: string) => enableEmployeeLogin(id), onSuccess: (employee) => invalidate(employee.id) }),
  }
}
