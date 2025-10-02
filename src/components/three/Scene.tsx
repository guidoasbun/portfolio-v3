'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import {
  detectPerformanceTier,
  shouldRender3D,
  getOptimalPixelRatio,
  shouldEnableAntialiasing,
} from '@/lib/three/performance'
import { CanvasFadeIn } from '@/components/transitions/SceneTransition'
import { MinimalSkeleton } from '@/components/loading/SkeletonLoader3D'
import type { SceneProps, PerformanceTier } from '@/types/three'

/**
 * Scene wrapper component for Three.js Canvas
 * Handles performance detection, theme integration, SSR compatibility, and transitions
 */
export function Scene({ children, config, fallback, className = '' }: SceneProps) {
  const [mounted, setMounted] = useState(false)
  const [can3D, setCan3D] = useState(false)
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('medium')
  const [isReady, setIsReady] = useState(false)

  // Client-side only rendering to avoid SSR issues
  useEffect(() => {
    setMounted(true)
    const canRender = shouldRender3D()
    setCan3D(canRender)

    if (canRender) {
      const tier = detectPerformanceTier()
      setPerformanceTier(tier)

      // Small delay to ensure smooth transition
      setTimeout(() => setIsReady(true), 150)
    }
  }, [])

  // Show loading skeleton during SSR
  if (!mounted) {
    return fallback ? <>{fallback}</> : <MinimalSkeleton className={className} />
  }

  // Show fallback if 3D is not supported
  if (!can3D) {
    return fallback ? <>{fallback}</> : <div className={className} />
  }

  // Show skeleton while initializing
  if (!isReady) {
    return <MinimalSkeleton className={className} />
  }

  // Get optimal settings based on performance tier
  const pixelRatio = config?.pixelRatio || getOptimalPixelRatio(performanceTier)
  const antialias = config?.antialias ?? shouldEnableAntialiasing(performanceTier)

  return (
    <CanvasFadeIn className={className}>
      <Canvas
        gl={{
          antialias,
          alpha: config?.alpha ?? true,
          powerPreference: config?.powerPreference ?? 'high-performance',
        }}
        dpr={pixelRatio}
        shadows={config?.shadows ?? false}
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </CanvasFadeIn>
  )
}
