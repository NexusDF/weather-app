import { QueryClient } from '@tanstack/vue-query'

const MINUTE = 60 * 1000

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MINUTE,
      gcTime: 30 * MINUTE,
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})
