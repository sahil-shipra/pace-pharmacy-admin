import { AuthProvider } from '@/hooks/auth/auth-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'
import { Toaster } from "@/components/ui/sonner"

export const Route = createRootRoute({
  component: RootComponent,
})

// Create a client
const queryClient = new QueryClient()

function RootComponent() {
  return (
    <Fragment>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className='font-enzyme'>
            <Outlet />
          </div>
          <Toaster position='top-center'/>
        </QueryClientProvider>
      </AuthProvider>
    </Fragment>
  )
}
