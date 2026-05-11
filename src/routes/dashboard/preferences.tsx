import PreferencesView from '@/views/preferences'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/preferences')({
  component: PreferencesView,
})