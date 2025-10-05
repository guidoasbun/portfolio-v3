/**
 * Retry Utilities
 *
 * Provides retry mechanisms for network requests with exponential backoff.
 */

export interface RetryOptions {
  maxRetries?: number
  initialDelay?: number
  maxDelay?: number
  backoffFactor?: number
  shouldRetry?: (error: Error, attempt: number) => boolean
  onRetry?: (error: Error, attempt: number, delay: number) => void
}

const defaultOptions: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  shouldRetry: (error: Error) => {
    // Retry on network errors and 5xx server errors
    const isNetworkError = error.message.includes('fetch') || error.message.includes('network')
    const isServerError = 'status' in error && typeof error.status === 'number' && error.status >= 500
    return isNetworkError || isServerError
  },
  onRetry: () => {
    // Default: do nothing
  },
}

/**
 * Calculate exponential backoff delay
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  backoffFactor: number,
  maxDelay: number
): number {
  const delay = initialDelay * Math.pow(backoffFactor, attempt)
  return Math.min(delay, maxDelay)
}

/**
 * Wait for a specified duration
 */
function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Retry a function with exponential backoff
 *
 * @example
 * const data = await retry(
 *   () => fetch('/api/projects').then(r => r.json()),
 *   { maxRetries: 3, initialDelay: 1000 }
 * )
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const opts = { ...defaultOptions, ...options }
  let lastError: Error

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Don't retry if we've exhausted retries
      if (attempt === opts.maxRetries) {
        throw lastError
      }

      // Check if we should retry this error
      if (!opts.shouldRetry(lastError, attempt)) {
        throw lastError
      }

      // Calculate delay with exponential backoff
      const delay = calculateDelay(
        attempt,
        opts.initialDelay,
        opts.backoffFactor,
        opts.maxDelay
      )

      // Call onRetry callback
      opts.onRetry(lastError, attempt + 1, delay)

      // Wait before retrying
      await wait(delay)
    }
  }

  // TypeScript needs this, but we'll never reach here
  throw lastError!
}

/**
 * Retry a fetch request with exponential backoff
 *
 * @example
 * const response = await retryFetch('/api/projects', {
 *   method: 'GET',
 *   headers: { 'Content-Type': 'application/json' }
 * }, {
 *   maxRetries: 3,
 *   onRetry: (error, attempt, delay) => {
 *     console.log(`Retry ${attempt} after ${delay}ms:`, error.message)
 *   }
 * })
 */
export async function retryFetch(
  url: string,
  init?: RequestInit,
  options?: RetryOptions
): Promise<Response> {
  return retry(async () => {
    const response = await fetch(url, init)

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      const error = new Error(`HTTP ${response.status}: ${response.statusText}`) as Error & { status: number }
      error.status = response.status
      throw error
    }

    return response
  }, {
    ...options,
    shouldRetry: (error: Error, attempt: number) => {
      // Custom retry logic for fetch
      const hasStatus = 'status' in error && typeof error.status === 'number'

      // Don't retry 4xx client errors (except 408 Request Timeout and 429 Too Many Requests)
      if (hasStatus) {
        const status = (error as Error & { status: number }).status
        if (status >= 400 && status < 500 && status !== 408 && status !== 429) {
          return false
        }
      }

      // Use custom shouldRetry if provided
      if (options?.shouldRetry) {
        return options.shouldRetry(error, attempt)
      }

      // Default: retry network errors and 5xx errors
      return defaultOptions.shouldRetry(error, attempt)
    },
  })
}

/**
 * Create a fetch function with retry capability
 *
 * @example
 * const fetchWithRetry = createRetryFetch({ maxRetries: 5 })
 * const data = await fetchWithRetry('/api/projects').then(r => r.json())
 */
export function createRetryFetch(options?: RetryOptions): typeof fetch {
  return (url: RequestInfo | URL, init?: RequestInit) => {
    const urlString = typeof url === 'string' ? url : url.toString()
    return retryFetch(urlString, init, options)
  }
}

/**
 * Retry with custom error handling
 *
 * @example
 * const data = await retryWithHandler(
 *   async () => {
 *     const response = await fetch('/api/projects')
 *     if (!response.ok) throw new Error('Failed')
 *     return response.json()
 *   },
 *   (error, attempt) => {
 *     console.error(`Attempt ${attempt} failed:`, error)
 *   },
 *   { maxRetries: 3 }
 * )
 */
export async function retryWithHandler<T>(
  fn: () => Promise<T>,
  onError: (error: Error, attempt: number) => void,
  options?: RetryOptions
): Promise<T> {
  return retry(fn, {
    ...options,
    onRetry: (error, attempt, delay) => {
      onError(error, attempt)
      options?.onRetry?.(error, attempt, delay)
    },
  })
}
