import DashboardLayout from '@/components/layout/dashboard-layout'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Fragment } from 'react/jsx-runtime'

export const Route = createFileRoute('/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Fragment>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </Fragment>
  )
}
