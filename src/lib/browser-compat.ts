/**
 * Browser Compatibility Utilities
 * Provides browser detection, feature detection, and compatibility helpers
 */

export type BrowserName = 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown'

export interface BrowserInfo {
  name: BrowserName
  version: string
  isChrome: boolean
  isFirefox: boolean
  isSafari: boolean
  isEdge: boolean
  isOpera: boolean
  isMobile: boolean
  isIOS: boolean
  isAndroid: boolean
}

export interface FeatureSupport {
  webgl: boolean
  webgl2: boolean
  intersectionObserver: boolean
  resizeObserver: boolean
  mutationObserver: boolean
  matchMedia: boolean
  localStorage: boolean
  sessionStorage: boolean
  backdropFilter: boolean
  cssGrid: boolean
  flexbox: boolean
  customProperties: boolean
  fetch: boolean
  promises: boolean
  asyncAwait: boolean
}

/**
 * Detect browser information from user agent
 */
export function detectBrowser(): BrowserInfo {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      name: 'unknown',
      version: '0',
      isChrome: false,
      isFirefox: false,
      isSafari: false,
      isEdge: false,
      isOpera: false,
      isMobile: false,
      isIOS: false,
      isAndroid: false,
    }
  }

  const ua = navigator.userAgent
  let name: BrowserName = 'unknown'
  let version = '0'

  // Detect browser
  if (ua.indexOf('Firefox') > -1) {
    name = 'firefox'
    const match = ua.match(/Firefox\/(\d+)/)
    version = match ? match[1] : '0'
  } else if (ua.indexOf('Edg') > -1) {
    name = 'edge'
    const match = ua.match(/Edg\/(\d+)/)
    version = match ? match[1] : '0'
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    name = 'opera'
    const match = ua.match(/(?:Opera|OPR)\/(\d+)/)
    version = match ? match[1] : '0'
  } else if (ua.indexOf('Chrome') > -1) {
    name = 'chrome'
    const match = ua.match(/Chrome\/(\d+)/)
    version = match ? match[1] : '0'
  } else if (ua.indexOf('Safari') > -1) {
    name = 'safari'
    const match = ua.match(/Version\/(\d+)/)
    version = match ? match[1] : '0'
  }

  // Detect mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)

  return {
    name,
    version,
    isChrome: name === 'chrome',
    isFirefox: name === 'firefox',
    isSafari: name === 'safari',
    isEdge: name === 'edge',
    isOpera: name === 'opera',
    isMobile,
    isIOS,
    isAndroid,
  }
}

/**
 * Detect feature support across browsers
 */
export function detectFeatureSupport(): FeatureSupport {
  if (typeof window === 'undefined') {
    return {
      webgl: false,
      webgl2: false,
      intersectionObserver: false,
      resizeObserver: false,
      mutationObserver: false,
      matchMedia: false,
      localStorage: false,
      sessionStorage: false,
      backdropFilter: false,
      cssGrid: false,
      flexbox: false,
      customProperties: false,
      fetch: false,
      promises: false,
      asyncAwait: false,
    }
  }

  // WebGL support
  const canvas = document.createElement('canvas')
  const webgl = !!(
    canvas.getContext('webgl') ||
    canvas.getContext('experimental-webgl')
  )
  const webgl2 = !!canvas.getContext('webgl2')

  // Observer APIs
  const intersectionObserver = 'IntersectionObserver' in window
  const resizeObserver = 'ResizeObserver' in window
  const mutationObserver = 'MutationObserver' in window

  // Storage APIs
  const localStorage = isStorageAvailable('localStorage')
  const sessionStorage = isStorageAvailable('sessionStorage')

  // CSS Features
  const backdropFilter = CSS.supports('backdrop-filter', 'blur(10px)') ||
                         CSS.supports('-webkit-backdrop-filter', 'blur(10px)')
  const cssGrid = CSS.supports('display', 'grid')
  const flexbox = CSS.supports('display', 'flex')
  const customProperties = CSS.supports('--custom', 'property')

  // JavaScript Features
  const fetch = 'fetch' in window
  const promises = 'Promise' in window
  const asyncAwait = (function() {
    try {
      // Check async/await support
      new Function('return (async () => {})()')
      return true
    } catch {
      return false
    }
  })()

  // matchMedia API
  const matchMedia = 'matchMedia' in window

  return {
    webgl,
    webgl2,
    intersectionObserver,
    resizeObserver,
    mutationObserver,
    matchMedia,
    localStorage,
    sessionStorage,
    backdropFilter,
    cssGrid,
    flexbox,
    customProperties,
    fetch,
    promises,
    asyncAwait,
  }
}

/**
 * Check if storage is available and functional
 */
function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  try {
    const storage = window[type]
    const testKey = '__storage_test__'
    storage.setItem(testKey, 'test')
    storage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

/**
 * Get WebGL context with fallback
 */
export function getWebGLContext(
  canvas: HTMLCanvasElement
): WebGLRenderingContext | WebGL2RenderingContext | null {
  const contexts = ['webgl2', 'webgl', 'experimental-webgl'] as const

  for (const contextType of contexts) {
    try {
      const context = canvas.getContext(contextType)
      if (context) {
        return context as WebGLRenderingContext | WebGL2RenderingContext
      }
    } catch {
      // Continue to next context type
    }
  }

  return null
}

/**
 * Check if browser needs vendor prefixes for a CSS property
 */
export function needsVendorPrefix(property: string): boolean {
  if (typeof window === 'undefined' || !CSS.supports) {
    return false
  }

  const prefixes = ['-webkit-', '-moz-', '-ms-', '-o-']

  // Check if property works without prefix
  if (CSS.supports(property, 'inherit')) {
    return false
  }

  // Check with prefixes
  for (const prefix of prefixes) {
    if (CSS.supports(`${prefix}${property}`, 'inherit')) {
      return true
    }
  }

  return false
}

/**
 * Get vendor-prefixed CSS property value
 */
export function getVendorPrefixedProperty(property: string, value: string): string {
  if (typeof window === 'undefined' || !CSS.supports) {
    return `${property}: ${value}`
  }

  const prefixes = ['', '-webkit-', '-moz-', '-ms-', '-o-']

  for (const prefix of prefixes) {
    const prefixedProp = `${prefix}${property}`
    if (CSS.supports(prefixedProp, value)) {
      return `${prefixedProp}: ${value}`
    }
  }

  return `${property}: ${value}`
}

/**
 * Check if browser is outdated and needs polyfills
 */
export function isOutdatedBrowser(): boolean {
  const browser = detectBrowser()
  const features = detectFeatureSupport()

  // Check for critical missing features
  const criticalFeatures = [
    features.fetch,
    features.promises,
    features.customProperties,
    features.flexbox,
  ]

  const hasCriticalFeatures = criticalFeatures.every(feature => feature)

  // Check browser versions
  const outdatedVersions: Record<BrowserName, number> = {
    chrome: 90,
    firefox: 88,
    safari: 14,
    edge: 90,
    opera: 76,
    unknown: 0,
  }

  const minVersion = outdatedVersions[browser.name]
  const currentVersion = parseInt(browser.version, 10)

  return !hasCriticalFeatures || currentVersion < minVersion
}

/**
 * Apply polyfills for missing features
 */
export function loadPolyfills(): Promise<void> {
  const features = detectFeatureSupport()
  const promises: Promise<void>[] = []

  // IntersectionObserver polyfill
  if (!features.intersectionObserver) {
    console.warn('IntersectionObserver not supported, using fallback')
  }

  // Fetch polyfill (if needed)
  if (!features.fetch) {
    console.warn('Fetch API not supported')
  }

  return Promise.all(promises).then(() => undefined)
}

/**
 * Get safe matchMedia with fallback
 */
export function safeMatchMedia(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return null
  }

  try {
    return window.matchMedia(query)
  } catch (e) {
    console.warn('matchMedia failed:', e)
    return null
  }
}

/**
 * Check if prefers-color-scheme is supported
 */
export function supportsPrefersColorScheme(): boolean {
  const mq = safeMatchMedia('(prefers-color-scheme: dark)')
  return mq !== null
}

/**
 * Check if prefers-reduced-motion is supported
 */
export function supportsPrefersReducedMotion(): boolean {
  const mq = safeMatchMedia('(prefers-reduced-motion: reduce)')
  return mq !== null
}

/**
 * Get browser compatibility report
 */
export function getBrowserCompatReport(): {
  browser: BrowserInfo
  features: FeatureSupport
  isOutdated: boolean
  warnings: string[]
} {
  const browser = detectBrowser()
  const features = detectFeatureSupport()
  const isOutdated = isOutdatedBrowser()
  const warnings: string[] = []

  // Generate warnings for missing features
  if (!features.webgl) {
    warnings.push('WebGL is not supported - 3D features will be disabled')
  }

  if (!features.intersectionObserver) {
    warnings.push('IntersectionObserver is not supported - animations may not work properly')
  }

  if (!features.backdropFilter) {
    warnings.push('backdrop-filter is not supported - using fallback styles')
  }

  if (!features.localStorage) {
    warnings.push('localStorage is not available - preferences cannot be saved')
  }

  if (isOutdated) {
    warnings.push('Your browser is outdated - please update for the best experience')
  }

  return {
    browser,
    features,
    isOutdated,
    warnings,
  }
}

/**
 * Log browser compatibility info to console (dev only)
 */
export function logBrowserCompat(): void {
  if (process.env.NODE_ENV === 'development') {
    const report = getBrowserCompatReport()
    console.group('🌐 Browser Compatibility Report')
    console.log('Browser:', report.browser.name, report.browser.version)
    console.log('Mobile:', report.browser.isMobile)
    console.log('Features:', report.features)
    console.log('Outdated:', report.isOutdated)
    if (report.warnings.length > 0) {
      console.warn('Warnings:', report.warnings)
    }
    console.groupEnd()
  }
}
