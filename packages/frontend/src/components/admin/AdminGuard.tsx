import { Navigate } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider'
import { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, isAuthenticated } = useAuth()
  
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
