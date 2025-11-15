import { createContext, useContext, useEffect, useState } from 'react'
import { getCurrentUser, signin, signout } from './_api'
import { isErrorResponse, isSuccessResponse } from '@/types/common.api'

interface User {
    id: string
    email: string
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    loading: boolean
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)


export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Check authentication status
    const checkAuth = async () => {
        try {
            const response = await getCurrentUser()
            if (isSuccessResponse(response)) {
                const data = await response.data
                setUser(data.user)
            } else {
                setUser(null)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setUser(null)
        } finally {
            setLoading(false)
        }
    }

    // Sign in
    const signIn = async (email: string, password: string) => {
        const response = await signin({
            email,
            password
        })

        if (isErrorResponse(response)) {
            throw new Error(response.error.message || 'Sign in failed')
        }

        setUser(response.data.user)
    }


    // Sign out
    const signOut = async () => {
        await signout()
        setUser(null)
    }

    // Check auth on mount
    useEffect(() => {
        checkAuth()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, checkAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use auth
export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider')
    }
    return context
}
