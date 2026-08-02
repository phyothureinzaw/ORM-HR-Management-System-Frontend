import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import type { ApiError } from '../../../lib/api/apiError'

export function mapServerValidation<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): boolean {
  const apiError = error as ApiError
  const errors = apiError.problem?.errors
  if (!errors) return false
  const fieldNames = Object.keys(errors)
  fieldNames.forEach((fieldName) => {
    const matchingField = Object.keys(errors).find((candidate) => candidate.toLowerCase() === fieldName.toLowerCase()) ?? fieldName
    setError(matchingField as Path<T>, { type: 'server', message: errors[fieldName]?.[0] ?? 'Check this value.' })
  })
  return fieldNames.length > 0
}
