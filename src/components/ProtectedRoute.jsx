import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import FullScreenLoader from './FullScreenLoader.jsx'

/**
 * Guards private routes.
 * - Without `adminOnly` the user must simply be signed in.
 * - With `adminOnly` the user must hold the admin role.
 */
export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader label="Checking your session…" />

  if (!user) {
    return <Navigate to={adminOnly ? '/admin/login' : '/login'} state={{ from: location.pathname }} replace />
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
