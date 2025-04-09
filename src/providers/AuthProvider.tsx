'use client'

import React, { createContext, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthUser, LoginCredentials } from '@/types/auth'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      setUser(data.user)
      router.push('/games')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }, [router])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [router])

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refresh()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  )
}
