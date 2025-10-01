'use client'

import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import { ParticleSystem } from './ParticleSystem'
import { useTheme } from '@/context/theme-context'

interface HeroBackgroundProps {
  className?: string
}

export function HeroBackground({ className = '' }: HeroBackgroundProps) {
  const { actualTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className={className} />
  }

  return (
    <div className={className}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]} // Responsive pixel ratio
      >
        <Suspense fallback={null}>
          {/* Camera */}
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={75} />

          {/* Lights */}
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          {/* Particle System */}
          <ParticleSystem count={1000} theme={actualTheme} />

          {/* Optional: Enable orbit controls for development */}
          {/* <OrbitControls enableZoom={false} enablePan={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  )
}
