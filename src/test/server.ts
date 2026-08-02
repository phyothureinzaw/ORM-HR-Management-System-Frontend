import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(
  http.get('http://localhost:5278/health', () => HttpResponse.text('Healthy')),
  http.post('http://localhost:5278/api/auth/refresh-token', () => HttpResponse.json({ title: 'Authentication required' }, { status: 401 })),
)
