import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/utils'

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has prefers-reduced-motion: reduce set
 */
export function useReducedMotion(): boolean {
  const [shouldReduceMotion, setShouldReduceMotion] = useState<boolean>(() => {
    // Check on initial render (client-side only)
    if (typeof window === 'undefined') return false
    return prefersReducedMotion()
  })

  useEffect(() => {
    // Listen for changes to the media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setShouldReduceMotion(event.matches)
    }

    // Set initial value
    handleChange(mediaQuery)

    // Add listener (use deprecated addListener for older browsers)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange)
    }

    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange)
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange)
      }
    }
  }, [])

  return shouldReduceMotion
}
