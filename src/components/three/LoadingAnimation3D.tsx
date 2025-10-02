'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTheme } from '@/context/theme-context'
import type { ThreeTheme, MeshRef, PointsRef } from '@/types/three'

interface LoadingAnimation3DProps {
  size?: number
  speed?: number
}

/**
 * 3D Loading Animation Component
 * Rotating torus with particles - theme-aware
 */
function LoadingRing({ size = 1, speed = 1 }: LoadingAnimation3DProps) {
  const torusRef = useRef<MeshRef>(null)
  const particlesRef = useRef<PointsRef>(null)
  const { actualTheme } = useTheme()

  // Theme colors
  const colors: Record<ThreeTheme, string> = {
    light: '#3b82f6', // blue-500
    dark: '#60a5fa', // blue-400
  }

  const color = colors[actualTheme]

  // Rotate the torus and particles
  useFrame(() => {
    if (torusRef.current) {
      torusRef.current.rotation.x += 0.01 * speed
      torusRef.current.rotation.y += 0.02 * speed
      torusRef.current.rotation.z += 0.01 * speed
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.x -= 0.005 * speed
      particlesRef.current.rotation.y -= 0.01 * speed
    }
  })

  // Create particle positions around the torus
  const particleCount = 100
  const particlePositions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2
    const radius = size * 1.5
    particlePositions[i * 3] = Math.cos(angle) * radius
    particlePositions[i * 3 + 1] = Math.sin(angle) * radius
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.5
  }

  return (
    <group>
      {/* Main torus */}
      <mesh ref={torusRef}>
        <torusGeometry args={[size, size * 0.3, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
        />
      </mesh>

      {/* Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particlePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color={color}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color={color} />
    </group>
  )
}

export { LoadingRing }
