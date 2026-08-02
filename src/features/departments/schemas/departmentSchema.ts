import { z } from 'zod'

export const departmentSchema = z.object({
  code: z.string().trim().min(1, 'Code is required.').max(30, 'Code must be 30 characters or fewer.').regex(/^[A-Za-z0-9_-]+$/, 'Code may contain only letters, numbers, hyphens, or underscores.'),
  name: z.string().trim().min(1, 'Name is required.').max(150, 'Name must be 150 characters or fewer.'),
  description: z.string().max(300, 'Description must be 300 characters or fewer.'),
  isActive: z.boolean(),
})

export type DepartmentFormValues = z.infer<typeof departmentSchema>

export const defaultDepartmentForm: DepartmentFormValues = { code: '', name: '', description: '', isActive: true }
