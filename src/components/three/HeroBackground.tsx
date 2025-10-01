'use client'

import { PerspectiveCamera } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { Scene } from './Scene'
import { ParticleSystem } from './ParticleSystem'
import { useTheme } from '@/context/theme-context'
import { detectPerformanceTier, getOptimalParticleCount } from '@/lib/three/performance'
import type { HeroBackgroundProps, PerformanceTier } from '@/types/three'

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
  const { actualTheme } = useTheme()
  const [performanceTier, setPerformanceTier] = useState<PerformanceTier>('medium')

  useEffect(() => {
    // Detect performance tier on mount
    const tier = detectPerformanceTier()
    setPerformanceTier(tier)
  }, [])

  const particleCount = getOptimalParticleCount(performanceTier)

  return (
    <Scene className={className}>
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
