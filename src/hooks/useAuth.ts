/**
 * useAuth Hook
 *
 * Custom React hook for managing authentication state.
 * Provides access to the current user, auth methods, and loading states.
 *
 * Usage:
 * ```tsx
 * const { user, loading, error, signIn, signOut, isAdmin } = useAuth()
 * ```
 */

'use client'

import { useContext } from 'react'
import { AuthContext } from '@/context/auth-context'

/**
 * Hook to access authentication context
 * Must be used within an AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
