import { RotateCw, ServerOff } from 'lucide-react'
import { Button } from '../../../components/ui/Button'

export function AuthUnavailable({ message = 'The backend is temporarily unavailable.', onRetry }: { message?: string; onRetry: () => void }) {
  return <main className="auth-loading" role="alert"><div className="auth-loading-mark auth-loading-mark-error"><ServerOff size={22} aria-hidden="true" /></div><h1>Connection unavailable</h1><p>{message}</p><Button onClick={() => void onRetry()}><RotateCw size={16} aria-hidden="true" /> Retry</Button></main>
}
