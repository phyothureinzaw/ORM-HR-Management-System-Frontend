import { z } from 'zod'

const passwordMessage = 'Use at least 8 characters with uppercase, lowercase, a number, and a special character.'

export const registerCompanySchema = z.object({
  CompanyName: z.string().trim().min(1, 'Company name is required.').max(200, 'Company name must be 200 characters or fewer.'),
  CompanyAbbreviation: z.string().trim().min(1, 'Company abbreviation is required.').max(20, 'Company abbreviation must be 20 characters or fewer.').regex(/^[A-Za-z0-9_-]+$/, 'Use only letters, numbers, hyphens, or underscores.'),
  CompanyEmail: z.union([z.literal(''), z.string().trim().email('Enter a valid company email.').max(256, 'Company email is too long.')]),
  FirstName: z.string().trim().min(1, 'First name is required.').max(100, 'First name must be 100 characters or fewer.'),
  LastName: z.string().trim().min(1, 'Last name is required.').max(100, 'Last name must be 100 characters or fewer.'),
  UserName: z.string().trim().min(1, 'Username is required.').max(100, 'Username must be 100 characters or fewer.'),
  AdminEmail: z.string().trim().min(1, 'Administrator email is required.').email('Enter a valid administrator email.').max(256, 'Administrator email is too long.'),
  Password: z.string().min(8, passwordMessage).regex(/[A-Z]/, passwordMessage).regex(/[a-z]/, passwordMessage).regex(/[0-9]/, passwordMessage).regex(/[^A-Za-z0-9]/, passwordMessage),
  ConfirmPassword: z.string().min(1, 'Confirm your password.'),
}).refine((values) => values.Password === values.ConfirmPassword, {
  path: ['ConfirmPassword'],
  message: 'Passwords do not match.',
})

export type RegisterCompanyFormValues = z.infer<typeof registerCompanySchema>
