/**
 * Service Worker Registration Utility
 *
 * Handles registration and lifecycle of the service worker
 */

export interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void
  onUpdate?: (registration: ServiceWorkerRegistration) => void
  onError?: (error: Error) => void
}

/**
 * Register the service worker
 * NOTE: Currently in placeholder mode - registration is commented out
 */
export function registerServiceWorker(config: ServiceWorkerConfig = {}): void {
  // Check if service workers are supported
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    console.log('Service Workers not supported')
    return
  }

  // Only register in production
  if (process.env.NODE_ENV !== 'production') {
    console.log('Service Worker: Skipping registration in development')
    return
  }

  window.addEventListener('load', () => {
    const swUrl = '/sw.js'

    // NOTE: Service worker registration is currently disabled
    // Uncomment when ready to enable offline support
    /*
    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log('Service Worker: Registered successfully', registration)

        // Check for updates
        registration.onupdatefound = () => {
          const installingWorker = registration.installing

          if (!installingWorker) {
            return
          }

          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('Service Worker: New content available')
                if (config.onUpdate) {
                  config.onUpdate(registration)
                }
              } else {
                // Content cached for offline use
                console.log('Service Worker: Content cached for offline use')
                if (config.onSuccess) {
                  config.onSuccess(registration)
                }
              }
            }
          }
        }
      })
      .catch((error) => {
        console.error('Service Worker: Registration failed', error)
        if (config.onError) {
          config.onError(error)
        }
      })
    */

    console.log('Service Worker: Registration disabled (placeholder mode)')
  })
}

/**
 * Unregister all service workers
 */
export async function unregisterServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.ready
    const success = await registration.unregister()
    console.log('Service Worker: Unregistered', success)
    return success
  } catch (error) {
    console.error('Service Worker: Unregister failed', error)
    return false
  }
}

/**
 * Check if a service worker is registered
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration()
    return !!registration
  } catch (error) {
    return false
  }
}
