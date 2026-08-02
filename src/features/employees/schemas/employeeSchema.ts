import { z } from 'zod'

const optionalText = (max: number) => z.string().max(max, `Must be ${max} characters or fewer.`).optional().or(z.literal(''))
export const employeeSchema = z.object({
  employeeCode: z.string().trim().min(1, 'Employee code is required.').max(50).regex(/^[A-Za-z0-9_-]+$/, 'Employee code may contain only letters, numbers, hyphens, or underscores.'),
  firstName: z.string().trim().min(1, 'First name is required.').max(100), lastName: z.string().trim().min(1, 'Last name is required.').max(100),
  workEmail: z.string().email('Enter a valid email address.').max(256).optional().or(z.literal('')),
  phoneNumber: optionalText(30).refine((value) => !value || /^[0-9+() .-]*$/.test(value), 'Enter a valid phone number.'), jobTitle: optionalText(150),
  employmentDate: z.string().optional(), departmentId: z.string().optional(), managerId: z.string().optional(), employmentStatus: z.union([z.literal(1), z.literal(2), z.literal(3)]),
})
export type EmployeeFormValues = z.infer<typeof employeeSchema>
export const defaultEmployeeForm: EmployeeFormValues = { employeeCode: '', firstName: '', lastName: '', workEmail: '', phoneNumber: '', jobTitle: '', employmentDate: '', departmentId: '', managerId: '', employmentStatus: 1 }
