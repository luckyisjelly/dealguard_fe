import { Navigate, Outlet } from 'react-router-dom'
import { authStore } from '../../lib/auth'

export function ProtectedRoute() {
  if (!authStore.isAuthenticated()) return <Navigate to="/login" replace />
  return <Outlet />
}
