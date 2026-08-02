import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addDepartment, deleteDepartment, updateDepartment } from '../api/departmentApi'
import { departmentKeys } from '../api/departmentKeys'

export function useDepartmentMutations() {
  const queryClient = useQueryClient()
  const invalidate = async (id?: string) => {
    await queryClient.invalidateQueries({ queryKey: departmentKeys.lists() })
    if (id) await queryClient.invalidateQueries({ queryKey: departmentKeys.detail(id) })
  }

  const add = useMutation({ mutationFn: addDepartment, onSuccess: async (department) => invalidate(department.id) })
  const update = useMutation({ mutationFn: ({ id, request }: Parameters<typeof updateDepartment> extends [string, infer R] ? { id: string; request: R } : never) => updateDepartment(id, request), onSuccess: async (department) => invalidate(department.id) })
  const deactivate = useMutation({ mutationFn: deleteDepartment, onSuccess: async (_, id) => invalidate(id) })

  return { add, update, deactivate }
}
