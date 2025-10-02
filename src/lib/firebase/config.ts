/**
 * Firebase Client Configuration
 *
 * This file initializes the Firebase client SDK for use in browser/client components.
 * All configuration values come from environment variables prefixed with NEXT_PUBLIC_
 * which makes them safe to expose in the browser.
 */

import type { FirebaseApp } from 'firebase/app'
import { initializeApp, getApps } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import { getAuth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import type { FirebaseStorage } from 'firebase/storage'
import { getStorage } from 'firebase/storage'

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Validate that all required environment variables are present
const validateConfig = (): void => {
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ] as const

  const missing = requiredKeys.filter(
    (key) => !firebaseConfig[key]
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing Firebase configuration: ${missing.join(', ')}. ` +
      'Please check your .env.local file.'
    )
  }
}

// Initialize Firebase only once
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

try {
  validateConfig()

  // Check if Firebase has already been initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]
  }

  // Initialize Firebase services
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
} catch (error) {
  console.error('Firebase initialization error:', error)
  throw error
}

// Export initialized instances
export { app, auth, db, storage }

// Export Firebase config for reference (without sensitive data in production)
export const config = firebaseConfig
