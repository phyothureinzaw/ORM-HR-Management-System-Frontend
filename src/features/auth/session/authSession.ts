export const AUTH_SESSION_MARKER = 'workforce.auth.session'

export function hasActiveAuthSession(): boolean {
  return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(AUTH_SESSION_MARKER) === 'active'
}

export function markAuthSessionActive(): void {
  sessionStorage.setItem(AUTH_SESSION_MARKER, 'active')
}

export function clearAuthSession(): void {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(AUTH_SESSION_MARKER)
}
