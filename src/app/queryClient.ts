import { QueryClient } from '@tanstack/react-query'
import type { ApiError } from '../lib/api/apiError'

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
        retry: (failureCount, error) => {
          const status = (error as ApiError).status
          return failureCount < 1 && ![400, 401, 403, 404].includes(status ?? 0)
        },
        refetchOnWindowFocus: false,
      },
      mutations: { retry: false },
    },
  })
}

export const queryClient = createQueryClient()
