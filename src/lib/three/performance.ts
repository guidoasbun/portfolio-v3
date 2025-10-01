import type { DeviceCapability, PerformanceTier } from '@/types/three'

/**
 * Detect device performance tier based on hardware capabilities
 */
export function detectPerformanceTier(): PerformanceTier {
  // Check for reduced motion preference
  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return 'low'
  }

  // Get device pixel ratio
  const dpr = window.devicePixelRatio || 1

  // Check if mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  // Try to get WebGL context and capabilities
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    if (!gl) {
      return 'low'
    }

    const webglContext = gl as WebGLRenderingContext

    // Get max texture size
    const maxTextureSize = webglContext.getParameter(
      webglContext.MAX_TEXTURE_SIZE
    )

    // Get renderer info if available
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info')
    const renderer = debugInfo
      ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
      : ''

    // High performance indicators
    const isHighPerformance =
      !isMobile &&
      dpr <= 2 &&
      maxTextureSize >= 8192 &&
      (typeof renderer === 'string'
        ? renderer.toLowerCase().includes('nvidia') ||
          renderer.toLowerCase().includes('amd') ||
          renderer.toLowerCase().includes('radeon')
        : false)

    // Low performance indicators
    const isLowPerformance =
      isMobile ||
      dpr > 2 ||
      maxTextureSize < 4096 ||
      (typeof renderer === 'string'
        ? renderer.toLowerCase().includes('intel') &&
          !renderer.toLowerCase().includes('iris')
        : false)

    if (isHighPerformance) {
      return 'high'
    } else if (isLowPerformance) {
      return 'low'
    } else {
      return 'medium'
    }
  } catch (error) {
    console.warn('Error detecting performance tier:', error)
    return 'low'
  }
}

/**
 * Get detailed device capability information
 */
export function getDeviceCapability(): DeviceCapability {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )

  const prefersReducedMotion =
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const devicePixelRatio = window.devicePixelRatio || 1

  try {
    const canvas = document.createElement('canvas')
    const gl2 = canvas.getContext('webgl2')
    const gl =
      gl2 ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    if (!gl) {
      return {
        tier: 'low',
        supportsWebGL2: false,
        maxTextureSize: 0,
        maxVertexUniforms: 0,
        devicePixelRatio,
        isMobile,
        prefersReducedMotion,
      }
    }

    const webglContext = gl as WebGLRenderingContext

    const maxTextureSize = webglContext.getParameter(
      webglContext.MAX_TEXTURE_SIZE
    )
    const maxVertexUniforms = webglContext.getParameter(
      webglContext.MAX_VERTEX_UNIFORM_VECTORS
    )

    return {
      tier: detectPerformanceTier(),
      supportsWebGL2: !!gl2,
      maxTextureSize,
      maxVertexUniforms,
      devicePixelRatio,
      isMobile,
      prefersReducedMotion,
    }
  } catch (error) {
    console.warn('Error getting device capabilities:', error)
    return {
      tier: 'low',
      supportsWebGL2: false,
      maxTextureSize: 0,
      maxVertexUniforms: 0,
      devicePixelRatio,
      isMobile,
      prefersReducedMotion,
    }
  }
}

/**
 * Check if device should render 3D content
 */
export function shouldRender3D(): boolean {
  // Check WebGL support
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')

    if (!gl) {
      return false
    }

    // Check for reduced motion preference
    const prefersReducedMotion =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return false
    }

    return true
  } catch (error) {
    console.warn('Error checking 3D render capability:', error)
    return false
  }
}

/**
 * Get optimal particle count based on performance tier
 */
export function getOptimalParticleCount(tier: PerformanceTier): number {
  switch (tier) {
    case 'high':
      return 2000
    case 'medium':
      return 1000
    case 'low':
      return 500
    default:
      return 1000
  }
}

/**
 * Get optimal pixel ratio based on performance tier
 */
export function getOptimalPixelRatio(tier: PerformanceTier): [number, number] {
  const dpr = window.devicePixelRatio || 1

  switch (tier) {
    case 'high':
      return [1, Math.min(dpr, 2)]
    case 'medium':
      return [1, 1.5]
    case 'low':
      return [1, 1]
    default:
      return [1, 1.5]
  }
}

/**
 * Check if shadows should be enabled
 */
export function shouldEnableShadows(tier: PerformanceTier): boolean {
  return tier === 'high'
}

/**
 * Get optimal antialiasing setting
 */
export function shouldEnableAntialiasing(tier: PerformanceTier): boolean {
  return tier === 'high' || tier === 'medium'
}
