import type * as THREE from 'three'

/**
 * Theme types for Three.js components
 */
export type ThreeTheme = 'light' | 'dark'

/**
 * Performance tier for device capability detection
 */
export type PerformanceTier = 'high' | 'medium' | 'low'

/**
 * Device capability information
 */
export interface DeviceCapability {
  tier: PerformanceTier
  supportsWebGL2: boolean
  maxTextureSize: number
  maxVertexUniforms: number
  devicePixelRatio: number
  isMobile: boolean
  prefersReducedMotion: boolean
}

/**
 * Three.js scene configuration
 */
export interface SceneConfig {
  antialias?: boolean
  alpha?: boolean
  powerPreference?: 'high-performance' | 'low-power' | 'default'
  pixelRatio?: number | [number, number]
  shadows?: boolean
}

/**
 * Particle system configuration
 */
export interface ParticleConfig {
  count: number
  size: number
  color: string
  opacity: number
  speed: number
  spread: {
    x: number
    y: number
    z: number
  }
}

/**
 * 3D Model configuration
 */
export interface ModelConfig {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  castShadow?: boolean
  receiveShadow?: boolean
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  duration?: number
  easing?: (t: number) => number
  loop?: boolean
  autoplay?: boolean
}

/**
 * Common Three.js component props
 */
export interface ThreeComponentProps {
  theme?: ThreeTheme
  performanceTier?: PerformanceTier
  className?: string
}

/**
 * Particle system props
 */
export interface ParticleSystemProps extends ThreeComponentProps {
  count?: number
  theme: ThreeTheme
}

/**
 * Hero background props
 */
export interface HeroBackgroundProps extends ThreeComponentProps {
  className?: string
}

/**
 * Scene wrapper props
 */
export interface SceneProps extends ThreeComponentProps {
  children: React.ReactNode
  config?: SceneConfig
  fallback?: React.ReactNode
}

/**
 * Camera configuration
 */
export interface CameraConfig {
  position?: [number, number, number]
  fov?: number
  near?: number
  far?: number
  lookAt?: [number, number, number]
}

/**
 * Light configuration
 */
export interface LightConfig {
  type: 'ambient' | 'point' | 'directional' | 'spot'
  intensity?: number
  color?: string
  position?: [number, number, number]
  castShadow?: boolean
}

/**
 * Material configuration
 */
export interface MaterialConfig {
  type: 'standard' | 'basic' | 'phong' | 'lambert' | 'points'
  color?: string
  opacity?: number
  transparent?: boolean
  wireframe?: boolean
  metalness?: number
  roughness?: number
}

/**
 * Geometry configuration
 */
export interface GeometryConfig {
  type: 'box' | 'sphere' | 'plane' | 'cylinder' | 'buffer'
  args?: number[]
}

/**
 * Type guard to check if WebGL is supported
 */
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Type guard to check if WebGL2 is supported
 */
export function isWebGL2Supported(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!canvas.getContext('webgl2')
  } catch {
    return false
  }
}

/**
 * Three.js mesh reference type
 */
export type MeshRef = THREE.Mesh | null

/**
 * Three.js group reference type
 */
export type GroupRef = THREE.Group | null

/**
 * Three.js points reference type
 */
export type PointsRef = THREE.Points | null
