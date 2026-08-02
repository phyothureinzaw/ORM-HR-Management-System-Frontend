export type ProblemDetails = {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errors?: Record<string, string[]>
  traceId?: string
}

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return typeof value === 'object' && value !== null && ('title' in value || 'status' in value || 'errors' in value)
}

export function getValidationMessages(problem: ProblemDetails): string[] {
  return Object.values(problem.errors ?? {}).flat()
}

export function getUserFriendlyMessage(value: unknown): string {
  if (isProblemDetails(value)) {
    return getValidationMessages(value)[0] ?? value.detail ?? value.title ?? 'The request could not be completed.'
  }

  return 'The request could not be completed. Please try again.'
}
