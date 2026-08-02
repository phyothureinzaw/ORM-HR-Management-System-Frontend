export function getApiBaseUrl(configuredValue = import.meta.env.VITE_API_BASE_URL): string {
  const value = configuredValue?.trim()

  if (!value) {
    throw new Error('VITE_API_BASE_URL is missing. Add it to .env.development before starting the app.')
  }

  try {
    return new URL(value).toString().replace(/\/$/, '')
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid absolute URL.')
  }
}
