import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth'
import { useEffect, useState } from 'react'
import { getProfile } from '../lib/api'

export default function AdminRoute({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    async function checkRole() {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const profile = await getProfile(user.id)
        if (profile && profile.role === 'admin') {
          setIsAdmin(true)
        }
      } catch (err) {
        console.error('Failed to verify admin role:', err)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkRole()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-[#4DD9C0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}
