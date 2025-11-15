import PatientIntakes from '@/views/patient-intakes'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PatientIntakes />
}
