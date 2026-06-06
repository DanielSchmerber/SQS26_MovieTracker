import { QueryClient } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()

  return {
    queryClient,
  }
}
export default function TanstackQueryProvider() {
  // This component is needed to ensure that the QueryClient is created in a React component, so that it can be properly shared across the app and integrated with React's lifecycle.
}
