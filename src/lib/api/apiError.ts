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
  const normalized = Object.assign(new Error(getUserFriendlyMessage(problem)), {
    status: error.response?.status,
    problem,
    traceId: problem?.traceId,
  }) as ApiError
  return normalized
}
