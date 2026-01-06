/**
 * Firebase Analytics Service
 *
 * Client-side only analytics initialization and tracking.
 * Uses Google Analytics 4 (GA4) via Firebase Analytics.
 */

import type { Analytics } from 'firebase/analytics'
import type { AnalyticsEventName, AnalyticsEventParams } from '@/types/analytics'

// Analytics instance (initialized on client only)
let analyticsInstance: Analytics | null = null
let isInitialized = false

/**
 * Initialize Firebase Analytics (client-side only)
 * Only runs in browser environment
 */
export const initializeAnalytics = async (): Promise<Analytics | null> => {
  // Only initialize on client side
  if (typeof window === 'undefined') {
    return null
  }

  // TEMPORARY: Disable analytics on App Hosting due to CORS issues
  // TODO: Re-enable after configuring API key restrictions in Google Cloud Console
  const isAppHosting = typeof window !== 'undefined' &&
    window.location.hostname.includes('.hosted.app')
  if (isAppHosting) {
    console.log('Analytics disabled on App Hosting domain (CORS configuration pending)')
    return null
  }

  // Return existing instance if already initialized
  if (isInitialized && analyticsInstance) {
    return analyticsInstance
  }

  try {
    // Check if analytics is enabled (can be disabled via env or user consent)
    const isEnabled = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID !== undefined

    if (!isEnabled) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Analytics is not enabled. Add NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID to .env.local')
      }
      return null
    }

    // Dynamic import to avoid SSR issues
    const { getAnalytics, isSupported } = await import('firebase/analytics')
    const { app } = await import('./config')

    // Check if analytics is supported in this browser
    const supported = await isSupported()
    if (!supported) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Firebase Analytics is not supported in this browser')
      }
      return null
    }

    // Initialize analytics
    analyticsInstance = getAnalytics(app)
    isInitialized = true

    if (process.env.NODE_ENV === 'development') {
      console.log('Firebase Analytics initialized successfully')
    }
    return analyticsInstance
  } catch (error) {
    // Silently fail in production (likely ad blocker or network restriction)
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase Analytics could not be initialized (ad blocker or network restriction):', error)
    }
    return null
  }
}

/**
 * Get the analytics instance
 */
export const getAnalyticsInstance = (): Analytics | null => {
  return analyticsInstance
}

/**
 * Check if analytics is initialized
 */
export const isAnalyticsInitialized = (): boolean => {
  return isInitialized && analyticsInstance !== null
}

/**
 * Track a custom event with type-safe parameters
 */
export const trackEvent = async <T extends AnalyticsEventName>(
  eventName: T,
  params?: AnalyticsEventParams[T]
): Promise<void> => {
  // Only track on client side
  if (typeof window === 'undefined') {
    return
  }

  try {
    // Initialize analytics if not already done
    if (!analyticsInstance) {
      analyticsInstance = await initializeAnalytics()
    }

    if (!analyticsInstance) {
      return
    }

    // Dynamic import to avoid SSR
    const { logEvent } = await import('firebase/analytics')

    // Log the event with parameters
    // Using type assertion for Firebase Analytics compatibility
    logEvent(analyticsInstance, eventName as string, params as Record<string, unknown> | undefined)

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', eventName, params)
    }
  } catch (error) {
    // Silently fail in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error tracking event (analytics may be blocked):', eventName, error)
    }
  }
}

/**
 * Track a page view
 */
export const trackPageView = async (
  pagePath: string,
  pageTitle?: string
): Promise<void> => {
  await trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    page_location: window.location.href,
  })
}

/**
 * Track an error
 */
export const trackError = async (
  error: Error,
  context?: string
): Promise<void> => {
  await trackEvent('error', {
    error_message: error.message,
    error_context: context,
    error_stack: error.stack,
  })
}

/**
 * Set a user property
 */
export const setUserProperty = async (
  propertyName: string,
  value: string
): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!analyticsInstance) {
      analyticsInstance = await initializeAnalytics()
    }

    if (!analyticsInstance) {
      return
    }

    const { setUserProperties } = await import('firebase/analytics')

    setUserProperties(analyticsInstance, {
      [propertyName]: value,
    })

    if (process.env.NODE_ENV === 'development') {
      console.log('User Property Set:', propertyName, value)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error setting user property:', error)
    }
  }
}

/**
 * Set the user ID for analytics
 */
export const setUserId = async (userId: string | null): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!analyticsInstance) {
      analyticsInstance = await initializeAnalytics()
    }

    if (!analyticsInstance) {
      return
    }

    const { setUserId: setAnalyticsUserId } = await import('firebase/analytics')

    setAnalyticsUserId(analyticsInstance, userId)

    if (process.env.NODE_ENV === 'development') {
      console.log('User ID Set:', userId)
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error setting user ID:', error)
    }
  }
}

/**
 * Enable or disable analytics collection
 */
export const setAnalyticsCollectionEnabled = async (
  enabled: boolean
): Promise<void> => {
  if (typeof window === 'undefined') {
    return
  }

  try {
    if (!analyticsInstance) {
      analyticsInstance = await initializeAnalytics()
    }

    if (!analyticsInstance) {
      return
    }

    const { setAnalyticsCollectionEnabled: setEnabled } = await import('firebase/analytics')

    setEnabled(analyticsInstance, enabled)

    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Collection:', enabled ? 'enabled' : 'disabled')
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Error setting analytics collection:', error)
    }
  }
}
