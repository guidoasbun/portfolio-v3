'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { ParticleSystemProps, PointsRef } from '@/types/three'

export function ParticleSystem({ count = 1000, theme }: ParticleSystemProps) {
  const meshRef = useRef<PointsRef>(null)
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const targetMouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0))
  const { viewport } = useThree()

  // Detect mobile for reduced mouse interaction
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  // Generate particle positions and attributes
  const particlesData = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const originalPositions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const speeds = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Random positions in a large box
      const x = (Math.random() - 0.5) * 50
      const y = (Math.random() - 0.5) * 50
      const z = (Math.random() - 0.5) * 30

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Store original positions for mouse interaction
      originalPositions[i * 3] = x
      originalPositions[i * 3 + 1] = y
      originalPositions[i * 3 + 2] = z

      // Random scales
      scales[i] = Math.random() * 0.5 + 0.5

      // Random speeds for animation
      speeds[i] = Math.random() * 0.02 + 0.01
    }

    return { positions, originalPositions, scales, speeds }
  }, [count])

  // Track mouse movement
  useState(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized device coordinates (-1 to +1)
      targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
  })

  // Animate particles
  useFrame((state) => {
    if (!meshRef.current) return

    const time = state.clock.getElapsedTime()
    const positionAttribute = meshRef.current.geometry.attributes.position
    const positions = positionAttribute.array as Float32Array

    // Smooth mouse position interpolation
    mouseRef.current.lerp(targetMouseRef.current, 0.1)

    // Mouse position in world space
    const mouseX = mouseRef.current.x * viewport.width * 0.5
    const mouseY = mouseRef.current.y * viewport.height * 0.5

    // Gentle floating animation with mouse interaction
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const speed = particlesData.speeds[i]

      // Get original position
      const origX = particlesData.originalPositions[i3]
      const origY = particlesData.originalPositions[i3 + 1]

      // Calculate distance from mouse
      const dx = positions[i3] - mouseX
      const dy = positions[i3 + 1] - mouseY
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = 10

      // Mouse repulsion effect (disabled on mobile for performance)
      if (!isMobile && distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance
        const angle = Math.atan2(dy, dx)
        positions[i3] += Math.cos(angle) * force * 0.5
        positions[i3 + 1] += Math.sin(angle) * force * 0.5
      } else {
        // Smoothly return to original position
        positions[i3] += (origX - positions[i3]) * 0.02
        positions[i3 + 1] += (origY - positions[i3 + 1]) * 0.02
      }

      // Float up and down
      positions[i3 + 1] += Math.sin(time * speed) * 0.01

      // Wrap particles that go out of bounds
      if (positions[i3 + 1] > 25) {
        positions[i3 + 1] = -25
        particlesData.originalPositions[i3 + 1] = -25
      }
      if (positions[i3 + 1] < -25) {
        positions[i3 + 1] = 25
        particlesData.originalPositions[i3 + 1] = 25
      }
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
