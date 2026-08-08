import axios from 'axios'
import { queryClient } from '../../app/queryClient'
import { store } from '../../app/store'
import { clearAuth, setAccessToken } from '../../features/auth/store/authSlice'
import { getApiBaseUrl } from '../env'
import { normalizeApiError } from './apiError'
import type { AuthenticationResponse } from '../../features/auth/types/auth.types'
import { clearAuthSession } from '../../features/auth/session/authSession'

type RetryableRequestConfig = import('axios').InternalAxiosRequestConfig & { _authRetry?: boolean }

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  timeout: 10000,
})

let refreshPromise: Promise<AuthenticationResponse> | null = null

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function refreshAccessToken(): Promise<AuthenticationResponse> {
  if (!refreshPromise) {
    refreshPromise = axios.post<AuthenticationResponse>(`${getApiBaseUrl()}/api/auth/refresh-token`, undefined, {
      withCredentials: true,
      headers: { Accept: 'application/json', 'X-Skip-Auth-Refresh': 'true' },
      timeout: 10000,
    }).then((response) => {
      store.dispatch(setAccessToken(response.data.accessToken))
      return response.data
    }).finally(() => {
      refreshPromise = null
    })
  }
  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const config = error.config as RetryableRequestConfig | undefined
      const url = config?.url ?? ''
      const isAuthRequest = url.includes('/api/auth/login') || url.includes('/api/auth/register-company') || url.includes('/api/auth/refresh-token') || url.includes('/api/auth/logout') || url.includes('/api/auth/me')
      const shouldRefresh = error.response?.status === 401 && !isAuthRequest && !config?._authRetry && !config?.headers['X-Skip-Auth-Refresh'] && Boolean(store.getState().auth.accessToken)

      if (shouldRefresh && config) {
        const tokenAtRequest = config.headers.Authorization?.toString().replace(/^Bearer\s+/i, '')
        try {
          const response = await refreshAccessToken()
          config._authRetry = true
          config.headers.Authorization = `Bearer ${response.accessToken}`
          return apiClient(config)
        } catch {
          // A late 401 must not clear a session restored by another request.
          if (store.getState().auth.accessToken === tokenAtRequest) {
            clearAuthSession()
            store.dispatch(clearAuth())
            queryClient.clear()
          }
        }
      }
    }

    return Promise.reject(normalizeApiError(error))
  },
)
