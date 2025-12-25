/**
 * useAnalytics Hook
 *
 * React hook for tracking analytics events from components.
 * Auto-tracks page views on mount and provides event tracking methods.
 */

'use client'

import { useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import {
  trackEvent,
  trackPageView,
  trackError,
  setUserProperty,
  initializeAnalytics,
} from '@/lib/firebase/analytics'
import type { AnalyticsEventName, AnalyticsEventParams } from '@/types/analytics'

export interface UseAnalyticsReturn {
  trackEvent: <T extends AnalyticsEventName>(
    eventName: T,
    params?: AnalyticsEventParams[T]
  ) => void
  trackPageView: (pagePath: string, pageTitle?: string) => void
  trackError: (error: Error, context?: string) => void
  setUserProperty: (propertyName: string, value: string) => void
}

/**
 * Hook for tracking analytics events
 */
export const useAnalytics = (): UseAnalyticsReturn => {
  const pathname = usePathname()

  // DEBUG: Track analytics hook usage
  console.log("[useAnalytics] Hook called, pathname:", pathname)

  // Initialize analytics on mount
  useEffect(() => {
    console.log("[useAnalytics] Initializing analytics")
    initializeAnalytics()
  }, [])

  // Auto-track page views when pathname changes
  useEffect(() => {
    if (pathname) {
      console.log("[useAnalytics] Tracking page view:", pathname)
      trackPageView(pathname)
    }
  }, [pathname])

  // Memoized event tracking function
  const trackEventCallback = useCallback(
    <T extends AnalyticsEventName>(
      eventName: T,
      params?: AnalyticsEventParams[T]
    ) => {
      trackEvent(eventName, params)
    },
    []
  )

  // Memoized page view tracking
  const trackPageViewCallback = useCallback(
    (pagePath: string, pageTitle?: string) => {
      trackPageView(pagePath, pageTitle)
    },
    []
  )

  // Memoized error tracking
  const trackErrorCallback = useCallback((error: Error, context?: string) => {
    trackError(error, context)
  }, [])

  // Memoized user property setter
  const setUserPropertyCallback = useCallback(
    (propertyName: string, value: string) => {
      setUserProperty(propertyName, value)
    },
    []
  )

  return {
    trackEvent: trackEventCallback,
    trackPageView: trackPageViewCallback,
    trackError: trackErrorCallback,
    setUserProperty: setUserPropertyCallback,
  }
}

/**
 * Hook for tracking component mount/unmount
 */
export const usePageAnalytics = (
  pageName: string,
  additionalParams?: Record<string, string | number>
) => {
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    trackEvent('page_view', {
      page_path: pageName,
      page_title: pageName,
      ...additionalParams,
    } as AnalyticsEventParams['page_view'])
  }, [pageName, additionalParams, trackEvent])
}

/**
 * Hook for tracking user interactions with debouncing
 */
export const useInteractionTracking = (
  eventName: AnalyticsEventName,
  debounceMs: number = 300
) => {
  const { trackEvent } = useAnalytics()
  let timeoutId: NodeJS.Timeout | null = null

  const trackInteraction = useCallback(
    (params?: Record<string, string | number | boolean>) => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        trackEvent(eventName, params as AnalyticsEventParams[typeof eventName])
      }, debounceMs)
    },
    [eventName, debounceMs, trackEvent]
  )

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return trackInteraction
}
