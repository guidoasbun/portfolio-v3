/**
 * Analytics Context Provider
 *
 * Provides analytics functionality throughout the application.
 * Handles initialization, consent, and event tracking.
 */

'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Analytics } from 'firebase/analytics'
import {
  initializeAnalytics,
  getAnalyticsInstance,
  isAnalyticsInitialized,
  trackEvent as firebaseTrackEvent,
  trackPageView as firebaseTrackPageView,
  trackError as firebaseTrackError,
  setUserProperty as firebaseSetUserProperty,
} from '@/lib/firebase/analytics'
import type { AnalyticsContextValue, AnalyticsEventName, AnalyticsEventParams } from '@/types/analytics'

const AnalyticsContext = createContext<AnalyticsContextValue | undefined>(undefined)

interface AnalyticsProviderProps {
  children: React.ReactNode
}

/**
 * Analytics Provider Component
 */
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize analytics on mount
  useEffect(() => {
    const init = async () => {
      const analyticsInstance = await initializeAnalytics()
      setAnalytics(analyticsInstance)
      setIsInitialized(isAnalyticsInitialized())
    }

    init()
  }, [])

  // Track device capabilities on mount
  useEffect(() => {
    if (!isInitialized) return

    // Set user properties for device info
    const setDeviceProperties = async () => {
      // Device type
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const isTablet = /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768
      const deviceType = isMobile ? (isTablet ? 'tablet' : 'mobile') : 'desktop'

      await firebaseSetUserProperty('device_type', deviceType)

      // Check WebGL support (3D capabilities)
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      const supports3D = gl !== null ? 'yes' : 'no'

      await firebaseSetUserProperty('supports_3d', supports3D)

      // Performance tier (based on device capabilities)
      const performanceTier = isMobile ? 'low' : supports3D === 'yes' ? 'high' : 'medium'
      await firebaseSetUserProperty('performance_tier', performanceTier)
    }

    setDeviceProperties()
  }, [isInitialized])

  const trackEvent = <T extends AnalyticsEventName>(
    eventName: T,
    params?: AnalyticsEventParams[T]
  ) => {
    firebaseTrackEvent(eventName, params)
  }

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    firebaseTrackPageView(pagePath, pageTitle)
  }

  const trackError = (error: Error, context?: string) => {
    firebaseTrackError(error, context)
  }

  const setUserProperty = (propertyName: string, value: string) => {
    firebaseSetUserProperty(propertyName, value)
  }

  const value: AnalyticsContextValue = {
    analytics,
    isInitialized,
    trackEvent,
    trackPageView,
    trackError,
    setUserProperty,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

/**
 * Hook to use analytics context
 */
export function useAnalyticsContext(): AnalyticsContextValue {
  const context = useContext(AnalyticsContext)

  if (context === undefined) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider')
  }

  return context
}
