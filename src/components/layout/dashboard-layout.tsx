import { Fragment } from 'react/jsx-runtime'
import AppSidebar from './sidebar'
import { SidebarProvider } from '../ui/sidebar';
import AppHeader from './header';
import { useAuth } from '@/hooks/auth/auth-context';
import { Navigate } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';

function DashboardLayout({ children }: { children: React.ReactElement; }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div className='h-svh w-full bg-theme-green-50/50 flex justify-center items-center'>
            <Loader2 className='animate-spin size-10' />
        </div>
    }

    if (!user) {
        return <Navigate to="/auth/login" replace />
    }
    return (
        <Fragment>
            <SidebarProvider>
                <AppSidebar />
                <main className='w-full'>
                    <AppHeader />
                    <div className='h-[calc(100dvh-80px)] overflow-hidden p-4'>
                        {children}
                    </div>
                </main>
            </SidebarProvider>
        </Fragment>
    )
}

export default DashboardLayout