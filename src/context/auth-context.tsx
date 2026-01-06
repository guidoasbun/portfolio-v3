/**
 * Authentication Context
 *
 * Provides authentication state and methods throughout the application.
 * Similar to the theme-context pattern, this wraps the app and manages
 * Firebase authentication state.
 *
 * Usage in layout.tsx:
 * ```tsx
 * <AuthProvider>
 *   <YourApp />
 * </AuthProvider>
 * ```
 */

'use client'

import React, { createContext, useEffect, useState, useCallback } from 'react'
import type { User } from 'firebase/auth'
import {
  signInWithEmail,
  signOut as firebaseSignOut,
  onAuthStateChange,
  resetPassword as firebaseResetPassword,
  AuthError,
} from '@/lib/firebase/auth'

/**
 * Authentication context state interface
 */
interface AuthContextState {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  isAdmin: boolean
  clearError: () => void
}

/**
 * Initial state for the context
 */
const initialState: AuthContextState = {
  user: null,
  loading: true,
  error: null,
  signIn: async () => {},
  signOut: async () => {},
  resetPassword: async () => {},
  isAdmin: false,
  clearError: () => {},
}

/**
 * Create the authentication context
 */
export const AuthContext = createContext<AuthContextState>(initialState)

/**
 * AuthProvider props
 */
interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * AuthProvider component
 * Wraps the application and provides authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState<boolean>(false)

  /**
   * Check if user is admin
   */
  const checkAdminStatus = useCallback((currentUser: User | null) => {
    if (!currentUser) {
      setIsAdmin(false)
      return
    }

    const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID
    const isMatch = currentUser.uid === adminUid

    // Debug logging - remove after fixing
    console.log('[Auth] Admin check:', {
      userUid: currentUser.uid,
      adminUid,
      isMatch
    })

    setIsAdmin(isMatch)
  }, [])

  /**
   * Set up authentication state listener
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChange((currentUser) => {
      setUser(currentUser)
      checkAdminStatus(currentUser)
      setLoading(false)
    })

    // Cleanup listener on unmount
    return () => unsubscribe()
  }, [checkAdminStatus])

  /**
   * Sign in handler
   */
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      await signInWithEmail(email, password)
      // User state will be updated by the onAuthStateChange listener
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred during sign in.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Sign out handler
   */
  const signOut = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      await firebaseSignOut()
      // User state will be updated by the onAuthStateChange listener
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred during sign out.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Password reset handler
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true)
      setError(null)

      await firebaseResetPassword(email)
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred while sending password reset email.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  /**
   * Context value
   */
  const value: AuthContextState = {
    user,
    loading,
    error,
    signIn,
    signOut,
    resetPassword,
    isAdmin,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
