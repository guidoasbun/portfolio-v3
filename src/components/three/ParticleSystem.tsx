'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleSystemProps {
  count?: number
  theme: 'light' | 'dark'
}

export function ParticleSystem({ count = 1000, theme }: ParticleSystemProps) {
  const meshRef = useRef<THREE.Points>(null)

  // Generate particle positions and attributes
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random positions in a large box
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30

      // Random scales
      scales[i] = Math.random() * 0.5 + 0.5

      // Random speeds for animation
      speeds[i] = Math.random() * 0.02 + 0.01
    }

    return { positions, scales, speeds }
  }, [count])

  // Animate particles
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    const positionAttribute = meshRef.current.geometry.attributes.position
    const positions = positionAttribute.array as Float32Array

    // Gentle floating animation
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = particlesData.speeds[i]

      // Float up and down
      positions[i3 + 1] += Math.sin(time * speed) * 0.001

      // Wrap particles that go out of bounds
      if (positions[i3 + 1] > 25) positions[i3 + 1] = -25
      if (positions[i3 + 1] < -25) positions[i3 + 1] = 25
    }

    positionAttribute.needsUpdate = true

    // Rotate the entire system slowly
    meshRef.current.rotation.y = time * 0.05
  })

  // Theme-based particle color
  const particleColor = theme === 'dark' ? '#ffffff' : '#1e293b'
  const particleOpacity = theme === 'dark' ? 0.6 : 0.3

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesData.positions}
          itemSize={3}
          args={[particlesData.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          count={count}
          array={particlesData.scales}
          itemSize={1}
          args={[particlesData.scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={particleColor}
        transparent
        opacity={particleOpacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
