'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { MeshRef, ThreeTheme } from '@/types/three'
import { trackEvent } from '@/lib/firebase/analytics'

interface InteractiveElementsProps {
  theme: ThreeTheme
  enableScrollAnimation?: boolean
  enableParallax?: boolean
  objectCount?: number
}

interface InteractiveObject {
  mesh: MeshRef
  basePosition: THREE.Vector3
  targetPosition: THREE.Vector3
  velocity: THREE.Vector3
  parallaxFactor: number
  scrollFactor: number
  rotationSpeed: THREE.Vector3
}

export function InteractiveElements({
  theme,
  enableScrollAnimation = true,
  enableParallax = true,
  objectCount = 8,
}: InteractiveElementsProps) {
  const groupRef = useRef<THREE.Group>(null)
  const objectsRef = useRef<InteractiveObject[]>([])
  const mouseRef = useRef(new THREE.Vector2(0, 0))
  const targetMouseRef = useRef(new THREE.Vector2(0, 0))
  const scrollRef = useRef(0)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const { viewport } = useThree()
  const hasTrackedInteraction = useRef(false)

  // Detect mobile
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  }, [])

  // Generate random interactive objects
  const geometries = useMemo(() => {
    const shapes = []
    for (let i = 0; i < objectCount; i++) {
      const type = i % 4
      switch (type) {
        case 0:
          shapes.push(new THREE.BoxGeometry(0.5, 0.5, 0.5))
          break
        case 1:
          shapes.push(new THREE.SphereGeometry(0.3, 16, 16))
          break
        case 2:
          shapes.push(new THREE.TetrahedronGeometry(0.4, 0))
          break
        case 3:
          shapes.push(new THREE.TorusGeometry(0.3, 0.1, 8, 16))
          break
      }
    }
    return shapes
  }, [objectCount])

  // Theme-based colors
  const colors = useMemo(() => {
    if (theme === 'dark') {
      return [
        '#3b82f6', // blue-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
        '#10b981', // emerald-500
      ]
    } else {
      return [
        '#1e40af', // blue-700
        '#6d28d9', // violet-700
        '#be185d', // pink-700
        '#0e7490', // cyan-700
        '#047857', // emerald-700
      ]
    }
  }, [theme])

  // Create materials
  const materials = useMemo(() => {
    return colors.map(
      (color) =>
        new THREE.MeshStandardMaterial({
          color,
          transparent: true,
          opacity: theme === 'dark' ? 0.9 : 0.8,
          metalness: 0.3,
          roughness: 0.4,
          wireframe: false,
        })
    )
  }, [colors, theme])

  // Initialize objects
  useEffect(() => {
    const group = groupRef.current
    if (!group) return

    objectsRef.current = []

    for (let i = 0; i < objectCount; i++) {
      const mesh = new THREE.Mesh(
        geometries[i],
        materials[i % materials.length]
      )

      // Random position
      const x = (Math.random() - 0.5) * 20
      const y = (Math.random() - 0.5) * 15
      const z = (Math.random() - 0.5) * 10 - 5

      mesh.position.set(x, y, z)

      const basePosition = new THREE.Vector3(x, y, z)
      const targetPosition = new THREE.Vector3(x, y, z)
      const velocity = new THREE.Vector3(0, 0, 0)

      objectsRef.current.push({
        mesh,
        basePosition,
        targetPosition,
        velocity,
        parallaxFactor: Math.random() * 0.3 + 0.1,
        scrollFactor: Math.random() * 0.5 + 0.2,
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
      })

      group.add(mesh)
    }

    return () => {
      objectsRef.current.forEach((obj) => {
        if (obj.mesh && group) {
          group.remove(obj.mesh)
        }
      })
    }
  }, [geometries, materials, objectCount])

  // Mouse move handler
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Track first interaction (once per session)
      if (!hasTrackedInteraction.current) {
        trackEvent('3d_interaction', {
          interaction_type: 'hover',
          element_type: 'interactive_elements',
        })
        hasTrackedInteraction.current = true
      }

      targetMouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Touch move handler
    const handleTouchStart = (event: TouchEvent) => {
      // Track touch interaction
      if (!hasTrackedInteraction.current) {
        trackEvent('3d_interaction', {
          interaction_type: 'drag',
          element_type: 'interactive_elements',
        })
        hasTrackedInteraction.current = true
      }

      if (event.touches.length > 0) {
        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        }
      }
    }

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0 && touchStartRef.current) {
        const deltaX = event.touches[0].clientX - touchStartRef.current.x
        const deltaY = event.touches[0].clientY - touchStartRef.current.y

        targetMouseRef.current.x = (deltaX / window.innerWidth) * 2
        targetMouseRef.current.y = -(deltaY / window.innerHeight) * 2

        touchStartRef.current = {
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        }
      }
    }

    const handleTouchEnd = () => {
      touchStartRef.current = null
      // Smoothly return to center
      targetMouseRef.current.x *= 0.9
      targetMouseRef.current.y *= 0.9
    }

    // Scroll handler
    const handleScroll = () => {
      scrollRef.current = window.scrollY / window.innerHeight
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', handleTouchEnd)
      if (enableScrollAnimation) {
        window.addEventListener('scroll', handleScroll, { passive: true })
      }

      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('touchstart', handleTouchStart)
        window.removeEventListener('touchmove', handleTouchMove)
        window.removeEventListener('touchend', handleTouchEnd)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [enableScrollAnimation])

  // Animation loop
  useFrame((state) => {
    // Smooth mouse interpolation
    mouseRef.current.lerp(targetMouseRef.current, 0.05)

    const mouseWorldX = mouseRef.current.x * viewport.width * 0.5
    const mouseWorldY = mouseRef.current.y * viewport.height * 0.5

    objectsRef.current.forEach((obj, index) => {
      if (!obj.mesh) return

      // Mouse-following behavior
      const attraction = isMobile ? 0.03 : 0.05
      const mouseDist = new THREE.Vector3(
        mouseWorldX - obj.mesh.position.x,
        mouseWorldY - obj.mesh.position.y,
        0
      )

      // Apply parallax effect based on Z position
      if (enableParallax) {
        const parallaxOffset = new THREE.Vector3(
          mouseWorldX * obj.parallaxFactor,
          mouseWorldY * obj.parallaxFactor,
          0
        )
        obj.targetPosition
          .copy(obj.basePosition)
          .add(parallaxOffset)
          .add(mouseDist.multiplyScalar(attraction))
      } else {
        obj.targetPosition
          .copy(obj.basePosition)
          .add(mouseDist.multiplyScalar(attraction))
      }

      // Scroll-triggered animation
      if (enableScrollAnimation) {
        const scrollOffset = Math.sin(scrollRef.current + index) * obj.scrollFactor
        obj.targetPosition.y += scrollOffset * 2
      }

      // Smooth movement with velocity
      obj.velocity.lerp(
        obj.targetPosition.clone().sub(obj.mesh.position),
        0.1
      )
      obj.mesh.position.add(obj.velocity.multiplyScalar(0.1))

      // Rotation
      obj.mesh.rotation.x += obj.rotationSpeed.x
      obj.mesh.rotation.y += obj.rotationSpeed.y
      obj.mesh.rotation.z += obj.rotationSpeed.z

      // Keep objects in bounds
      const maxDist = 15
      if (obj.mesh.position.length() > maxDist) {
        obj.mesh.position.normalize().multiplyScalar(maxDist)
      }
    })

    // Gentle group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.03
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={theme === 'dark' ? 0.6 : 0.8} />
      <pointLight
        position={[10, 10, 10]}
        intensity={theme === 'dark' ? 1.2 : 1.5}
        color={theme === 'dark' ? '#ffffff' : '#f0f0f0'}
      />
      <pointLight
        position={[-10, -10, -10]}
        intensity={theme === 'dark' ? 0.8 : 1}
        color={theme === 'dark' ? '#3b82f6' : '#1e40af'}
      />
      <pointLight
        position={[0, 10, 0]}
        intensity={theme === 'dark' ? 0.6 : 0.8}
        color={theme === 'dark' ? '#8b5cf6' : '#6d28d9'}
      />
    </group>
  )
}
