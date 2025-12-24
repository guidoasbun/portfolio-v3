import { useEffect, useState } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 * Returns true if user has prefers-reduced-motion: reduce set
 *
 * Always starts with false to avoid hydration mismatch between server and client
 */
export function useReducedMotion(): boolean {
  // Always start with false to avoid hydration mismatch
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false)

  useEffect(() => {
    // Only check on client after mount
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setShouldReduceMotion(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setShouldReduceMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return shouldReduceMotion
}
