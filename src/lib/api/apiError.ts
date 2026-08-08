import axios from 'axios'
import { getUserFriendlyMessage, type ProblemDetails } from './problemDetails'

export type ApiError = Error & {
  status?: number
  problem?: ProblemDetails
  traceId?: string
}

export function normalizeApiError(error: unknown): ApiError {
  if (!axios.isAxiosError(error)) {
    return Object.assign(new Error('An unexpected error occurred.'), { cause: error })
  }

  const problem = error.response?.data as ProblemDetails | undefined
  if (!error.response) {
    const message = error.code === 'ECONNABORTED' ? 'The request timed out. Please try again.' : 'The backend is unavailable. Check your connection and try again.'
    return Object.assign(new Error(message), { status: undefined, problem }) as ApiError
  }
  const normalized = Object.assign(new Error(getUserFriendlyMessage(problem)), {
    status: error.response?.status,
    problem,
    traceId: problem?.traceId,
  }) as ApiError
  return normalized
}

export function getApiFieldErrors(error: ApiError): Record<string, string[]> {
  return error.problem?.errors ?? {}
}
