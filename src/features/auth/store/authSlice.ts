import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, CurrentUser } from '../types/auth.types'

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'idle',
  bootstrapError: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    beginBootstrap(state) {
      state.status = 'bootstrapping'
      state.bootstrapError = null
    },
    setAuthenticated(state, action: PayloadAction<{ accessToken: string; user: CurrentUser }>) {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
      state.status = 'authenticated'
      state.bootstrapError = null
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      if (state.user) state.status = 'authenticated'
    },
    setUnauthenticated(state) {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
      state.bootstrapError = null
    },
    setBootstrapError(state, action: PayloadAction<string>) {
      state.user = null
      state.accessToken = null
      state.status = 'error'
      state.bootstrapError = action.payload
    },
    clearAuth(state) {
      state.user = null
      state.accessToken = null
      state.status = 'unauthenticated'
      state.bootstrapError = null
    },
  },
})

export const { beginBootstrap, setAuthenticated, setAccessToken, setUnauthenticated, setBootstrapError, clearAuth } = authSlice.actions
export const authReducer = authSlice.reducer
