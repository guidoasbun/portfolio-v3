import * as THREE from 'three'
import type { ThreeTheme } from '@/types/three'

/**
 * Convert hex color to THREE.Color
 */
export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex)
}

/**
 * Get theme-based colors for Three.js components
 */
export function getThemeColors(theme: ThreeTheme) {
  return {
    particles: {
      color: theme === 'dark' ? '#ffffff' : '#1e293b',
      opacity: theme === 'dark' ? 0.6 : 0.3,
    },
    background: {
      color: theme === 'dark' ? '#0a0a0a' : '#ffffff',
      opacity: theme === 'dark' ? 0.9 : 0.95,
    },
    accent: {
      primary: '#3b82f6', // blue-500
      secondary: '#8b5cf6', // purple-500
      tertiary: '#ec4899', // pink-500
    },
  }
}

/**
 * Linear interpolation between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start * (1 - t) + end * t
}

/**
 * Map value from one range to another
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
}

/**
 * Clamp value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Random number between min and max
 */
export function random(min: number, max: number): number {
  return Math.random() * (max - min) + min
}

/**
 * Random integer between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Random point on a sphere surface
 */
export function randomSpherePoint(radius: number): THREE.Vector3 {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.acos(2 * Math.random() - 1)

  const x = radius * Math.sin(phi) * Math.cos(theta)
  const y = radius * Math.sin(phi) * Math.sin(theta)
  const z = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

/**
 * Random point inside a sphere
 */
export function randomSphereVolume(radius: number): THREE.Vector3 {
  const r = radius * Math.cbrt(Math.random())
  return randomSpherePoint(r)
}

/**
 * Random point in a box
 */
export function randomBox(width: number, height: number, depth: number): THREE.Vector3 {
  return new THREE.Vector3(
    random(-width / 2, width / 2),
    random(-height / 2, height / 2),
    random(-depth / 2, depth / 2)
  )
}

/**
 * Ease in out cubic easing function
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Ease in out quad easing function
 */
export function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

/**
 * Ease out exponential easing function
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

/**
 * Convert degrees to radians
 */
export function degToRad(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Convert radians to degrees
 */
export function radToDeg(radians: number): number {
  return radians * (180 / Math.PI)
}

/**
 * Dispose Three.js object and its children
 */
export function disposeObject(object: THREE.Object3D): void {
  if (!object) return

  // Traverse and dispose
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      // Dispose geometry
      if (child.geometry) {
        child.geometry.dispose()
      }

      // Dispose material(s)
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => disposeMaterial(material))
        } else {
          disposeMaterial(child.material)
        }
      }
    }
  })

  // Remove from parent
  if (object.parent) {
    object.parent.remove(object)
  }
}

/**
 * Dispose Three.js material
 */
export function disposeMaterial(material: THREE.Material): void {
  if (!material) return

  // Dispose textures
  Object.keys(material).forEach((key) => {
    const value = (material as unknown as Record<string, unknown>)[key]
    if (value && typeof value === 'object' && 'dispose' in value) {
      ;(value as { dispose: () => void }).dispose()
    }
  })

  // Dispose material
  material.dispose()
}

/**
 * Create gradient texture
 */
export function createGradientTexture(
  colors: string[],
  width: number = 256,
  height: number = 256
): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context')

  const gradient = ctx.createLinearGradient(0, 0, 0, height)

  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1), color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  const texture = new THREE.Texture(canvas)
  texture.needsUpdate = true

  return texture
}

/**
 * Get mouse position in normalized device coordinates (-1 to +1)
 */
export function getMouseNDC(
  event: MouseEvent,
  element: HTMLElement = document.body
): { x: number; y: number } {
  const rect = element.getBoundingClientRect()
  return {
    x: ((event.clientX - rect.left) / rect.width) * 2 - 1,
    y: -((event.clientY - rect.top) / rect.height) * 2 + 1,
  }
}

/**
 * Smooth damp value (similar to Unity's SmoothDamp)
 */
export function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  deltaTime: number,
  maxSpeed: number = Infinity
): number {
  const omega = 2 / smoothTime
  const x = omega * deltaTime
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)

  let change = current - target
  const originalTarget = target

  const maxChange = maxSpeed * smoothTime
  change = clamp(change, -maxChange, maxChange)

  const temp = (velocity.value + omega * change) * deltaTime
  velocity.value = (velocity.value - omega * temp) * exp

  let output = target + (change + temp) * exp

  if ((originalTarget - current > 0) === (output > originalTarget)) {
    output = originalTarget
    velocity.value = (output - originalTarget) / deltaTime
  }

  return output
}
