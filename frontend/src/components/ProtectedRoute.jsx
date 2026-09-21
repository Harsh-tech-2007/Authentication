import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../pages/Auth.css'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>Loading…</span>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}
