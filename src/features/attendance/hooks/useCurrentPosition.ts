import { useCallback, useState } from 'react'

export type PositionState = 'idle' | 'requesting' | 'success' | 'denied' | 'unavailable' | 'timeout' | 'unsupported'
export type CurrentPosition = { latitude: number; longitude: number }

export function useCurrentPosition() {
  const [state, setState] = useState<PositionState>('idle')
  const [position, setPosition] = useState<CurrentPosition | null>(null)
  const request = useCallback(() => {
    setPosition(null)
    if (!window.isSecureContext && window.location.hostname !== 'localhost') { setState('unsupported'); return }
    if (!navigator.geolocation) { setState('unsupported'); return }
    setState('requesting')
    navigator.geolocation.getCurrentPosition((value) => { setPosition({ latitude: value.coords.latitude, longitude: value.coords.longitude }); setState('success') }, (error) => { setState(error.code === error.PERMISSION_DENIED ? 'denied' : error.code === error.TIMEOUT ? 'timeout' : 'unavailable') }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 })
  }, [])
  const reset = useCallback(() => { setPosition(null); setState('idle') }, [])
  return { state, position, request, reset }
}
