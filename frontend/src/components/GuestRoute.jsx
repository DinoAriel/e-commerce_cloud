import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/auth'

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#4DD9C0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />

  return children
}
