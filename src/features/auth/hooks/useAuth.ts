import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { queryClient } from '../../../app/queryClient'
import { getCurrentUser, login, logout, refreshToken } from '../api/authApi'
import { beginBootstrap, clearAuth, setAccessToken, setAuthenticated, setBootstrapError, setUnauthenticated } from '../store/authSlice'
import type { LoginRequest } from '../types/auth.types'
import { normalizeApiError, type ApiError } from '../../../lib/api/apiError'
import { clearAuthSession, hasActiveAuthSession, markAuthSessionActive } from '../session/authSession'

export function useAuth() {
  const auth = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()

  const signIn = useCallback(async (request: LoginRequest) => {
    clearAuthSession()
    const tokens = await login(request)
    dispatch(setAccessToken(tokens.accessToken))
    try {
      markAuthSessionActive()
      const user = await getCurrentUser()
      dispatch(setAuthenticated({ accessToken: tokens.accessToken, user }))
      return user
    } catch (error) {
      clearAuthSession()
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
      clearAuthSession()
      dispatch(clearAuth())
      queryClient.clear()
    }
  }, [dispatch])

  const bootstrap = useCallback(async () => {
    dispatch(beginBootstrap())
    if (!hasActiveAuthSession()) {
      dispatch(clearAuth())
      return
    }

    try {
      const tokens = await refreshToken()
      dispatch(setAccessToken(tokens.accessToken))
      const user = await getCurrentUser()
      dispatch(setAuthenticated({ accessToken: tokens.accessToken, user }))
    } catch (error) {
      const normalized = typeof error === 'object' && error !== null && 'status' in error
        ? error as ApiError
        : normalizeApiError(error)
      if (normalized.status === 401) {
        clearAuthSession()
        dispatch(setUnauthenticated())
      }
      else dispatch(setBootstrapError('The backend is temporarily unavailable. Retry to restore your session.'))
    }
  }, [dispatch])

  return { ...auth, signIn, signOut, bootstrap }
}
