import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'

export const AdminRoute = () => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
