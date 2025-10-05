/**
 * Generate a simple blur placeholder for images
 * This creates a tiny 1x1 pixel base64 encoded image
 */
export function getBlurDataURL(color: string = '#e5e7eb'): string {
  // Create a simple 1x1 pixel SVG with the specified color
  const svg = `
    <svg width="1" height="1" xmlns="http://www.w3.org/2000/svg">
      <rect width="1" height="1" fill="${color}"/>
    </svg>
  `

  // Convert to base64
  const base64 = Buffer.from(svg).toString('base64')

  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate blur data URL based on image category
 */
export function getCategoryBlurDataURL(category?: string): string {
  const colorMap: Record<string, string> = {
    web: '#3b82f6',      // blue-500
    mobile: '#8b5cf6',   // purple-500
    desktop: '#06b6d4',  // cyan-500
    ai: '#ec4899',       // pink-500
    other: '#64748b',    // slate-500
  }

  const color = (category && colorMap[category]) || '#6366f1' // default to indigo-500
  return getBlurDataURL(color)
}

/**
 * Shimmer effect for skeleton loading
 */
export function getShimmerDataURL(): string {
  const shimmer = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#shimmer)">
        <animate attributeName="x" from="-100" to="100" dur="1.5s" repeatCount="indefinite"/>
      </rect>
    </svg>
  `

  const base64 = Buffer.from(shimmer).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}
