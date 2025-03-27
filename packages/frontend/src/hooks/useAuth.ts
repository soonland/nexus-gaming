import { useState, useEffect, useCallback } from 'react'
import { User } from '@/types/auth'
import { authApi } from '@/services/api/auth'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setUser(null)
        setLoading(false)
        return
      }

      const userData = await authApi.getCurrentUser()
      setUser(userData)
      console.log('Current user data:', userData) // Debug log
    } catch (error) {
      console.error('Error fetching user:', error)
      // Clear invalid token and user state
      localStorage.removeItem('token')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await authApi.login(credentials)
      console.log('Login response:', response) // Debug log
      setUser(response.user)
      return response
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    authApi.logout()
    setUser(null)
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    fetchUser
  }
}
