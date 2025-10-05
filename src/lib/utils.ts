import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names with clsx and merges Tailwind classes with tailwind-merge
 *
 * This utility function is essential for conditionally applying classes while
 * ensuring Tailwind CSS classes are properly merged (later classes override earlier ones).
 *
 * @param inputs - Variable number of class values (strings, objects, arrays)
 * @returns Merged class name string with Tailwind conflicts resolved
 *
 * @example
 * cn('px-2 py-1', 'px-4') // Returns: 'py-1 px-4' (px-4 overrides px-2)
 * cn('text-red-500', condition && 'text-blue-500') // Conditionally applies classes
 * cn({ 'bg-white': isLight, 'bg-black': isDark }) // Object notation
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number with commas as thousands separators
 *
 * Uses Intl.NumberFormat for locale-aware number formatting.
 *
 * @param num - The number to format
 * @returns Formatted number string with thousands separators
 *
 * @example
 * formatNumber(1000) // Returns: '1,000'
 * formatNumber(1234567) // Returns: '1,234,567'
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

/**
 * Capitalizes the first letter of a string
 *
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 *
 * @example
 * capitalize('hello world') // Returns: 'Hello world'
 * capitalize('UPPERCASE') // Returns: 'UPPERCASE'
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Truncates text to a specified length with ellipsis
 *
 * Trims whitespace before adding ellipsis for clean output.
 *
 * @param text - The text to truncate
 * @param length - Maximum length before truncation
 * @returns Truncated text with '...' appended, or original text if within length
 *
 * @example
 * truncateText('Hello world', 5) // Returns: 'Hello...'
 * truncateText('Short', 10) // Returns: 'Short'
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + "..."
}

/**
 * Delays execution for a specified number of milliseconds
 *
 * Useful for creating pauses in async functions or adding delays for UX.
 *
 * @param ms - Number of milliseconds to delay
 * @returns Promise that resolves after the specified delay
 *
 * @example
 * await sleep(1000) // Pauses for 1 second
 * await sleep(500) // Pauses for 500ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounces a function call to limit how often it executes
 *
 * Delays function execution until after the wait time has elapsed since the last call.
 * Commonly used for search inputs, window resize handlers, and scroll events.
 *
 * @param func - The function to debounce
 * @param wait - Delay in milliseconds
 * @returns Debounced version of the function
 *
 * @example
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('Searching for:', query)
 * }, 300)
 *
 * debouncedSearch('a') // Won't execute immediately
 * debouncedSearch('ab') // Cancels previous, waits 300ms
 * debouncedSearch('abc') // Cancels previous, waits 300ms, then executes
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Checks if the current environment is browser/client-side
 *
 * Useful for SSR/SSG environments (Next.js) to prevent accessing browser-only APIs.
 *
 * @returns true if running in browser, false if server-side
 *
 * @example
 * if (isBrowser()) {
 *   window.localStorage.setItem('key', 'value')
 * }
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Checks if the user prefers reduced motion (accessibility)
 *
 * Respects user's system preference for reduced motion animations.
 * Returns true on server-side to prevent hydration mismatches.
 *
 * @returns true if user prefers reduced motion or on server-side, false otherwise
 *
 * @example
 * const shouldAnimate = !prefersReducedMotion()
 * <motion.div animate={shouldAnimate ? { x: 100 } : {}} />
 */
export function prefersReducedMotion(): boolean {
  if (!isBrowser()) return true
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Generates a random ID string
 *
 * Creates a pseudo-random alphanumeric string suitable for temporary IDs.
 * Not cryptographically secure - use crypto.randomUUID() for security-critical IDs.
 *
 * @returns Random alphanumeric string (9 characters)
 *
 * @example
 * const id = generateId() // Returns: 'k3j2h4g5f'
 * const elementId = `item-${generateId()}` // Returns: 'item-abc123xyz'
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}