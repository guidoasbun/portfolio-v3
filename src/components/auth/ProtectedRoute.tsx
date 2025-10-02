/**
 * ProtectedRoute Component
 *
 * Wraps admin routes to ensure only authenticated admins can access them.
 * Redirects to login page if not authenticated or not an admin.
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({
  children,
  requireAdmin = true
}: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Wait for auth to initialize
    if (loading) return

    // Redirect to login if not authenticated
    if (!user) {
      router.push('/admin/login')
      return
    }

    // Redirect to home if not admin (when admin is required)
    if (requireAdmin && !isAdmin) {
      router.push('/')
      return
    }
  }, [user, loading, isAdmin, requireAdmin, router])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Don't render children if not authenticated or not admin
  if (!user || (requireAdmin && !isAdmin)) {
    return null
  }

  // Render protected content
  return <>{children}</>
}
