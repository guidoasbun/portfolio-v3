'use client'

import { useState, useEffect } from 'react'
import { shouldRender3D, detectPerformanceTier } from '@/lib/three/performance'
import type { PerformanceTier } from '@/types/three'

interface UseLazyThreeReturn {
  shouldLoad: boolean
  isLoading: boolean
  isReady: boolean
  performanceTier: PerformanceTier
  error: Error | null
}

/**
 * Hook for lazy loading Three.js components
 * Handles performance detection and progressive loading
 */
export function useLazyThree(delay: number = 0): UseLazyThreeReturn {
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('medium')
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadThree = async () => {
      try {
        // Check if device can render 3D
        const canRender = shouldRender3D()

        if (!canRender) {
          setIsLoading(false)
          setShouldLoad(false)
          return
        }

        // Detect performance tier
        const tier = detectPerformanceTier()
        setPerformanceTier(tier)

        // Add delay if specified (useful for staggered loading)
        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        setShouldLoad(true)
        setIsLoading(false)

        // Mark as ready after a brief initialization period
        setTimeout(() => {
          setIsReady(true)
        }, 100)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load 3D scene'))
        setIsLoading(false)
        setShouldLoad(false)
      }
    }

    loadThree()
  }, [delay])

  return {
    shouldLoad,
    isLoading,
    isReady,
    performanceTier,
    error,
  }
}

