'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useTheme } from '@/context/theme-context'
import { useLazyThree } from '@/hooks/useLazyThree'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { getOptimalParticleCount } from '@/lib/three/performance'
import { SkeletonLoader3D } from '@/components/loading/SkeletonLoader3D'
import type { HeroBackgroundProps } from '@/types/three'

// Dynamically import 3D components to optimize bundle
const Scene = dynamic(() => import('./Scene').then((mod) => ({ default: mod.Scene })), {
  ssr: false,
  loading: () => <SkeletonLoader3D height="h-screen" />,
})

const ParticleSystem = dynamic(() => import('./ParticleSystem').then((mod) => ({ default: mod.ParticleSystem })), {
  ssr: false,
})

const PerspectiveCamera = dynamic(() => import('@react-three/drei').then((mod) => ({ default: mod.PerspectiveCamera })), {
  ssr: false,
})

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
  const { actualTheme, mounted } = useTheme()
  const { shouldLoad, isReady, performanceTier } = useLazyThree(100)
  const shouldReduceMotion = useReducedMotion()
  const [particleCount, setParticleCount] = useState<number>(1000)

  useEffect(() => {
    if (isReady) {
      const count = getOptimalParticleCount(performanceTier)
      // Reduce particle count if user prefers reduced motion
      setParticleCount(shouldReduceMotion ? Math.floor(count / 2) : count)
    }
  }, [isReady, performanceTier, shouldReduceMotion])

  // Theme-based fog color
  const fogColor = actualTheme === 'dark' ? '#0a0a0a' : '#f8fafc'
  const fogDensity = actualTheme === 'dark' ? 0.02 : 0.015

  // Don't render 3D scene if user prefers reduced motion
  if (shouldReduceMotion) {
    return <div className={className} aria-hidden="true" />
  }

  // Show skeleton while theme is loading to avoid hydration mismatch
  if (!mounted || !shouldLoad || !isReady) {
    return <SkeletonLoader3D className={className} height="h-screen" showSpinner={false} />
  }

  return (
    <Scene className={className}>
      {/* Fog effect for atmospheric depth */}
      <fogExp2 attach="fog" args={[fogColor, fogDensity]} />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />

      {/* Lights */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Particle System */}
      <ParticleSystem count={particleCount} theme={actualTheme} />

      {/* Optional: Enable orbit controls for development */}
      {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
    </Scene>
  )
}
