import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, type RenderOptions } from '@testing-library/react'
import type { PropsWithChildren, ReactElement } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import { store } from '../app/store'

export function renderWithProviders(ui: ReactElement, route = '/', options?: Omit<RenderOptions, 'wrapper'>) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}><QueryClientProvider client={queryClient}><MemoryRouter initialEntries={[route]}>{children}</MemoryRouter></QueryClientProvider></Provider>
  }
  return render(ui, { wrapper: Wrapper, ...options })
}
