import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { UserRole } from '../../types'

interface ProtectedRouteProps {
  roles?: UserRole[]
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-sm">Checking secure access...</div>
  if (!session) return <Navigate to={`/login/clinician?next=${encodeURIComponent(location.pathname)}`} replace />
  if (!profile) return <Navigate to="/access-pending" replace />
  if (roles && !roles.includes(profile.role as UserRole) && profile.role !== 'admin') {
    const portal = profile.role === 'doctor' ? '/doctor' : '/dashboard'
    return <Navigate to={portal} replace />
  }
  return <Outlet />
}
