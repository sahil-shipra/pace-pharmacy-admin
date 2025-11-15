import LoginComponent from '@/views/login-component'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/login')({
    component: LoginComponent,
})