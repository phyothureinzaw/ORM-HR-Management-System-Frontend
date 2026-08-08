import { apiClient, refreshAccessToken } from '../../../lib/api/apiClient'
import type { AuthenticationResponse, CurrentUser, LoginRequest, RegisterCompanyRequest, RegistrationResponse } from '../types/auth.types'

export async function registerCompany(request: RegisterCompanyRequest): Promise<RegistrationResponse> {
  const response = await apiClient.post<RegistrationResponse>('/api/auth/register-company', request)
  return response.data
}

export async function login(request: LoginRequest): Promise<AuthenticationResponse> {
  const response = await apiClient.post<AuthenticationResponse>('/api/auth/login', request)
  return response.data
}

export async function refreshToken(): Promise<AuthenticationResponse> {
  return refreshAccessToken()
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/auth/logout', undefined, { headers: { 'X-Skip-Auth-Refresh': 'true' } })
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get<CurrentUser>('/api/auth/me')
  return response.data
}
