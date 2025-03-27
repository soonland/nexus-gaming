import { LoginCredentials, AuthResponse } from '../../types/auth'
import { api } from './client'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    return data
  },

  logout: () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  },

  getCurrentUser: async () => {
    const { data } = await api.get<AuthResponse['user']>('/auth/me')
    return data
  }
}
