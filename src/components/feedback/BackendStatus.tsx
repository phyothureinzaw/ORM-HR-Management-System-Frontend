import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, CircleAlert, LoaderCircle, RotateCw } from 'lucide-react'
import { apiClient } from '../../lib/api/apiClient'
import { Button } from '../ui/Button'

async function checkBackendHealth(): Promise<boolean> {
  const response = await apiClient.get<string>('/health', { responseType: 'text' })
  return response.status >= 200 && response.status < 300 && response.data.trim().toLowerCase() === 'healthy'
}

export function BackendStatus() {
  const health = useQuery({ queryKey: ['backend-health'], queryFn: checkBackendHealth })

  if (health.isPending) {
    return <div className="connection-status" aria-live="polite"><LoaderCircle className="spin" size={16} aria-hidden="true" /> Checking backend connection</div>
  }

  if (health.isError || !health.data) {
    return (
      <div className="connection-status connection-error" role="alert">
        <CircleAlert size={16} aria-hidden="true" />
        <span>Backend unavailable</span>
        <Button variant="ghost" size="sm" onClick={() => void health.refetch()}><RotateCw size={14} aria-hidden="true" /> Retry</Button>
      </div>
    )
  }

  return <div className="connection-status connection-success" aria-live="polite"><CheckCircle2 size={16} aria-hidden="true" /> Backend connected</div>
}
