'use client'

import { useEffect, useState, useRef } from 'react'
import type { RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number | number[]
  rootMargin?: string
  triggerOnce?: boolean
}

interface UseInViewReturn {
  ref: RefObject<HTMLDivElement | null>
  isInView: boolean
  hasBeenInView: boolean
}

/**
 * Hook to detect when an element enters the viewport using Intersection Observer
 * @param options - Configuration options for the intersection observer
 * @returns Object containing ref to attach to element and visibility states
 */
export function useInView(options: UseInViewOptions = {}): UseInViewReturn {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = false,
  } = options

  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Check if IntersectionObserver is supported
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      setHasBeenInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting

        setIsInView(inView)

        if (inView && !hasBeenInView) {
          setHasBeenInView(true)
        }

        // If triggerOnce is true and element is in view, stop observing
        if (triggerOnce && inView) {
          observer.unobserve(element)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [threshold, rootMargin, triggerOnce, hasBeenInView])

  return { ref, isInView, hasBeenInView }
}
