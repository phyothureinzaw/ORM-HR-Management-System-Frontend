import { AppRouter } from './router'
import { AuthBootstrap } from '../features/auth/components/AuthBootstrap'

export function App() {
  return <AuthBootstrap><AppRouter /></AuthBootstrap>
}
