/**
 * Rate Limiter Utility
 *
 * Implements IP-based rate limiting for API endpoints
 * Uses in-memory storage (for production, consider Redis or similar)
 */

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  resetTime: number
}

interface RequestRecord {
  count: number
  resetTime: number
}

// In-memory store for rate limiting
// For production, consider using Redis or a database
const requestStore = new Map<string, RequestRecord>()

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, record] of requestStore.entries()) {
    if (record.resetTime < now) {
      requestStore.delete(key)
    }
  }
}, 10 * 60 * 1000)

/**
 * Get client identifier from request
 * Uses IP address or forwarded IP from proxy
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from X-Forwarded-For header (when behind proxy)
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim()
  }

  // Try X-Real-IP header
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  // Fallback to a default identifier
  // In production on Vercel/Netlify, one of the above headers should be present
  return 'unknown-ip'
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
  }
): RateLimitResult {
  const now = Date.now()
  const record = requestStore.get(identifier)

  // No previous requests or window has expired
  if (!record || record.resetTime < now) {
    const resetTime = now + config.windowMs
    requestStore.set(identifier, {
      count: 1,
      resetTime,
    })

    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests - 1,
      resetTime,
    }
  }

  // Increment request count
  record.count++

  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

/**
 * Reset rate limit for a specific identifier
 * Useful for testing or manual resets
 */
export function resetRateLimit(identifier: string): void {
  requestStore.delete(identifier)
}

/**
 * Get current rate limit status without incrementing
 */
export function getRateLimitStatus(
  identifier: string,
  config: RateLimitConfig = {
    windowMs: 60 * 1000,
    maxRequests: 5,
  }
): RateLimitResult {
  const now = Date.now()
  const record = requestStore.get(identifier)

  if (!record || record.resetTime < now) {
    return {
      success: true,
      limit: config.maxRequests,
      remaining: config.maxRequests,
      resetTime: now + config.windowMs,
    }
  }

  const remaining = Math.max(0, config.maxRequests - record.count)

  return {
    success: remaining > 0,
    limit: config.maxRequests,
    remaining,
    resetTime: record.resetTime,
  }
}

/**
 * Rate limiter middleware for Next.js API routes
 */
export async function rateLimitMiddleware(
  request: Request,
  config?: RateLimitConfig
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(request)
  return checkRateLimit(identifier, config)
}

// Default rate limit configurations for different endpoints
export const RATE_LIMITS = {
  // Contact form: 3 submissions per 15 minutes
  CONTACT_FORM: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 3,
  },
  // API requests: 60 per minute
  API_DEFAULT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  // Strict limit for sensitive endpoints: 5 per minute
  API_STRICT: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
} as const
