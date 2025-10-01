'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import {
  detectPerformanceTier,
  shouldRender3D,
  getOptimalPixelRatio,
  shouldEnableAntialiasing,
} from '@/lib/three/performance'
import type { SceneProps, PerformanceTier } from '@/types/three'

/**
 * Scene wrapper component for Three.js Canvas
 * Handles performance detection, theme integration, and SSR compatibility
 */
export function Scene({ children, config, fallback, className = '' }: SceneProps) {
  const [mounted, setMounted] = useState(false)
  const [can3D, setCan3D] = useState(false)
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('medium')

  // Client-side only rendering to avoid SSR issues
  useEffect(() => {
    setMounted(true)
    const canRender = shouldRender3D()
    setCan3D(canRender)

    if (canRender) {
      const tier = detectPerformanceTier()
      setPerformanceTier(tier)
    }
  }, [])

  // Show nothing during SSR
  if (!mounted) {
    return fallback ? <>{fallback}</> : <div className={className} />
  }

  // Show fallback if 3D is not supported
  if (!can3D) {
    return fallback ? <>{fallback}</> : <div className={className} />
  }

  // Get optimal settings based on performance tier
  const pixelRatio = config?.pixelRatio || getOptimalPixelRatio(performanceTier)
  const antialias = config?.antialias ?? shouldEnableAntialiasing(performanceTier)

  return (
    <div className={className}>
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
    </div>
  )
}
