import { z } from 'zod'

export const loginSchema = z.object({
  CompanyAbbreviation: z.string().trim().min(1, 'Company abbreviation is required.').max(20, 'Company abbreviation must be 20 characters or fewer.'),
  UserNameOrEmail: z.string().trim().min(1, 'Username or email is required.').max(256, 'Username or email is too long.'),
  Password: z.string().min(1, 'Password is required.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
