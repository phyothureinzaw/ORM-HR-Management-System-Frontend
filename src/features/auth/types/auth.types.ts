export type AuthStatus = 'idle' | 'bootstrapping' | 'authenticated' | 'unauthenticated' | 'error'

export type RegisterCompanyRequest = {
  CompanyName: string
  CompanyAbbreviation: string
  CompanyEmail?: string
  FirstName: string
  LastName: string
  UserName: string
  AdminEmail: string
  Password: string
  ConfirmPassword: string
}

export type LoginRequest = {
  CompanyAbbreviation: string
  UserNameOrEmail: string
  Password: string
}

export type AuthenticationResponse = {
  accessToken: string
  accessTokenExpiresAtUtc: string
}

export type RegistrationResponse = {
  companyId: string
  userId: string
}

export type CurrentUser = {
  userId: string
  companyId: string
  companyName: string
  companyAbbreviation: string
  userName: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  roles: string[]
  permissions: string[]
  timeZoneId?: string
}

export type AuthState = {
  user: CurrentUser | null
  accessToken: string | null
  status: AuthStatus
  bootstrapError: string | null
}
