import React, { createContext, useContext } from 'react'
import { useAuth as useAuthHook } from '@/hooks/useAuth'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string }) => Promise<{ user: User; token: string }>
  logout: () => void
  isAuthenticated: boolean
  fetchUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchUser, ...auth } = useAuthHook()

  const contextValue = {
    ...auth,
    fetchUser
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
