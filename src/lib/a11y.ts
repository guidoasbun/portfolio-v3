/**
 * Accessibility utilities for focus management and screen reader announcements
 */

/**
 * Creates a live region for screen reader announcements
 */
export function createLiveRegion(
  message: string,
  politeness: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return

  // Create or get existing live region
  let liveRegion = document.getElementById('a11y-live-region')

  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = 'a11y-live-region'
    liveRegion.setAttribute('role', 'status')
    liveRegion.setAttribute('aria-live', politeness)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    document.body.appendChild(liveRegion)
  }

  // Update the message
  liveRegion.textContent = message

  // Clear after announcement
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = ''
    }
  }, 1000)
}

/**
 * Announces a message to screen readers
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  createLiveRegion(message, priority)
}

/**
 * Traps focus within a specific element
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  const focusableElements = element.querySelectorAll<HTMLElement>(focusableSelectors)
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }
  }

  element.addEventListener('keydown', handleKeyDown)

  // Focus first element
  firstElement?.focus()

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleKeyDown)
  }
}

/**
 * Gets all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelectors))
}

/**
 * Checks if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ')

  return element.matches(focusableSelectors)
}

/**
 * Focus the first focusable element within a container
 */
export function focusFirst(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length > 0) {
    focusableElements[0].focus()
    return true
  }
  return false
}

/**
 * Focus the last focusable element within a container
 */
export function focusLast(container: HTMLElement): boolean {
  const focusableElements = getFocusableElements(container)
  if (focusableElements.length > 0) {
    focusableElements[focusableElements.length - 1].focus()
    return true
  }
  return false
}

/**
 * Saves the currently focused element and returns a function to restore it
 */
export function saveFocus(): () => void {
  const previouslyFocused = document.activeElement as HTMLElement

  return () => {
    if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
      previouslyFocused.focus()
    }
  }
}

/**
 * Checks if the current platform prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Generates a unique ID for accessibility attributes
 */
let idCounter = 0
export function generateA11yId(prefix = 'a11y'): string {
  idCounter++
  return `${prefix}-${idCounter}-${Date.now()}`
}
