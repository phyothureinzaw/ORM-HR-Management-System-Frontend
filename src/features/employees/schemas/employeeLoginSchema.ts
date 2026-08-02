import { z } from 'zod'

const password = z.string().min(8, 'Password must be at least 8 characters.').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, 'Password must contain uppercase, lowercase, number, and special character.')
const loginFields = { userName: z.string().trim().min(1, 'Username is required.').max(100), email: z.string().trim().email('Enter a valid email address.').max(256), password, confirmPassword: z.string(), roleId: z.string().min(1, 'Role is required.') }
export const employeeLoginSchema = z.object(loginFields).refine((value) => value.password === value.confirmPassword, { path: ['confirmPassword'], message: 'Passwords do not match.' })
export const updateEmployeeLoginSchema = z.object({ userName: loginFields.userName, email: loginFields.email, roleId: loginFields.roleId })
export type EmployeeLoginFormValues = z.infer<typeof employeeLoginSchema>
export type UpdateEmployeeLoginFormValues = z.infer<typeof updateEmployeeLoginSchema>
