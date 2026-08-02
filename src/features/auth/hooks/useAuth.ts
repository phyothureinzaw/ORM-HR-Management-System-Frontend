import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { queryClient } from '../../../app/queryClient'
import { getCurrentUser, login, logout, refreshToken } from '../api/authApi'
import { clearAuth, setAccessToken, setAuthenticated, setBootstrapError, setUnauthenticated } from '../store/authSlice'
import type { LoginRequest } from '../types/auth.types'
import { normalizeApiError, type ApiError } from '../../../lib/api/apiError'

export function useAuth() {
  const auth = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const signIn = useCallback(async (request: LoginRequest) => {
    const tokens = await login(request)
    dispatch(setAccessToken(tokens.accessToken))
    try {
      const user = await getCurrentUser()
      dispatch(setAuthenticated({ accessToken: tokens.accessToken, user }))
      return user
    } catch (error) {
      dispatch(clearAuth())
      throw error
    }
  }, [dispatch])

  const signOut = useCallback(async () => {
    try {
      await logout()
    } catch {
      // A missing or expired server session should not trap the user in the app.
    } finally {
      dispatch(clearAuth())
      queryClient.clear()
    }
  }, [dispatch])

  const bootstrap = useCallback(async () => {
    try {
      const tokens = await refreshToken()
      const user = await getCurrentUser()
      dispatch(setAuthenticated({ accessToken: tokens.accessToken, user }))
    } catch (error) {
      const normalized = typeof error === 'object' && error !== null && 'status' in error
        ? error as ApiError
        : normalizeApiError(error)
      if (normalized.status === 401) dispatch(setUnauthenticated())
      else dispatch(setBootstrapError('The backend is temporarily unavailable. Retry to restore your session.'))
    }
  }, [dispatch])

  return { ...auth, signIn, signOut, bootstrap }
}
