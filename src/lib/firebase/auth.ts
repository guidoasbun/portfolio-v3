/**
 * Firebase Authentication Service
 *
 * This file provides authentication utilities for the client side.
 * Includes functions for sign in, sign out, and user state management.
 */

import type { User, UserCredential } from 'firebase/auth'
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { auth } from './config'

/**
 * Custom error messages for authentication errors
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/missing-email': 'Please provide an email address.',
  }

  return errorMessages[errorCode] || 'An error occurred during authentication.'
}

/**
 * Authentication error class with user-friendly messages
 */
export class AuthError extends Error {
  code: string

  constructor(code: string, message?: string) {
    super(message || getAuthErrorMessage(code))
    this.code = code
    this.name = 'AuthError'
  }
}

/**
 * Sign in with email and password
 * @param email - User email
 * @param password - User password
 * @returns UserCredential if successful
 * @throws AuthError if sign in fails
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    // Set persistence to local (persist across browser sessions)
    await setPersistence(auth, browserLocalPersistence)

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw new AuthError(error.code as string)
    }
    throw new AuthError('auth/unknown', 'An unexpected error occurred.')
  }
}

/**
 * Sign out the current user
 * @throws AuthError if sign out fails
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw new AuthError(error.code as string)
    }
    throw new AuthError('auth/unknown', 'An unexpected error occurred during sign out.')
  }
}

/**
 * Get the current authenticated user
 * @returns Current user or null if not authenticated
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser
}

/**
 * Subscribe to authentication state changes
 * @param callback - Function to call when auth state changes
 * @returns Unsubscribe function
 */
export const onAuthStateChange = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Get the current user's ID token
 * @param forceRefresh - Force refresh the token
 * @returns ID token string or null if not authenticated
 */
export const getIdToken = async (forceRefresh = false): Promise<string | null> => {
  try {
    const user = getCurrentUser()
    if (!user) return null

    const token = await user.getIdToken(forceRefresh)
    return token
  } catch (error) {
    console.error('Error getting ID token:', error)
    return null
  }
}

/**
 * Check if the current user is an admin
 * @returns true if user is admin, false otherwise
 */
export const isCurrentUserAdmin = (): boolean => {
  const user = getCurrentUser()
  if (!user) return false

  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID
  return user.uid === adminUid
}

/**
 * Wait for authentication to initialize
 * Useful for checking auth state on app load
 * @returns Promise that resolves with the current user or null
 */
export const waitForAuth = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

/**
 * Send password reset email
 * @param email - Email address to send reset link to
 * @throws AuthError if sending fails
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error) {
      throw new AuthError(error.code as string)
    }
    throw new AuthError('auth/unknown', 'An unexpected error occurred while sending password reset email.')
  }
}
