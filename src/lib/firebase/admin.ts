/**
 * Firebase Admin SDK Configuration
 *
 * This file initializes the Firebase Admin SDK for server-side operations.
 * It should ONLY be used in:
 * - API routes (app/api/*)
 * - Server components
 * - Server actions
 *
 * Never import this file in client components!
 */

import type { App, ServiceAccount } from 'firebase-admin/app'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import type { Auth } from 'firebase-admin/auth'
import { getAuth } from 'firebase-admin/auth'
import type { Firestore } from 'firebase-admin/firestore'
import { getFirestore } from 'firebase-admin/firestore'
import type { Storage } from 'firebase-admin/storage'
import { getStorage } from 'firebase-admin/storage'

// Ensure this only runs on the server
if (typeof window !== 'undefined') {
  throw new Error(
    'Firebase Admin SDK should only be used on the server side. ' +
    'Please use the client SDK (lib/firebase/config.ts) instead.'
  )
}

// Get admin credentials from environment variables
const getAdminCredentials = (): ServiceAccount => {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Missing Firebase Admin credentials. Please check that ' +
      'FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, and ' +
      'FIREBASE_ADMIN_PRIVATE_KEY are set in your .env.local file.'
    )
  }

  // Handle private key format - could be:
  // 1. Real newlines (from Secret Manager)
  // 2. Escaped \n (from .env files)
  // 3. JSON-escaped \\n
  let formattedPrivateKey = privateKey

  // If the key contains literal \n (escaped), replace with real newlines
  if (privateKey.includes('\\n')) {
    formattedPrivateKey = privateKey.replace(/\\n/g, '\n')
  }

  return {
    projectId,
    clientEmail,
    privateKey: formattedPrivateKey,
  }
}

// Initialize Firebase Admin
let adminApp: App
let adminAuth: Auth
let adminDb: Firestore
let adminStorage: Storage

try {
  // Check if Firebase Admin has already been initialized
  if (getApps().length === 0) {
    const credentials = getAdminCredentials()

    adminApp = initializeApp({
      credential: cert(credentials),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
  } else {
    adminApp = getApps()[0]
  }

  // Initialize Admin services
  adminAuth = getAuth(adminApp)
  adminDb = getFirestore(adminApp)
  adminStorage = getStorage(adminApp)
} catch (error) {
  console.error('Firebase Admin initialization error:', error)
  throw error
}

// Export initialized Admin instances
export { adminApp, adminAuth, adminDb, adminStorage }

/**
 * Verify if a user is an admin
 * @param uid - User ID to check
 * @returns true if user is admin, false otherwise
 */
export const isAdmin = async (uid: string): Promise<boolean> => {
  try {
    const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID

    if (!adminUid) {
      console.warn('NEXT_PUBLIC_ADMIN_UID not set in environment variables')
      return false
    }

    return uid === adminUid
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Verify a Firebase ID token and return the decoded token
 * @param idToken - The Firebase ID token to verify
 * @returns Decoded token if valid
 * @throws Error if token is invalid
 */
export const verifyIdToken = async (idToken: string) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return decodedToken
  } catch (error) {
    console.error('Error verifying ID token:', error)
    throw new Error('Invalid or expired token')
  }
}

/**
 * Get user data by UID
 * @param uid - User ID
 * @returns User record
 */
export const getUserById = async (uid: string) => {
  try {
    const userRecord = await adminAuth.getUser(uid)
    return userRecord
  } catch (error) {
    console.error('Error getting user:', error)
    throw new Error('User not found')
  }
}
