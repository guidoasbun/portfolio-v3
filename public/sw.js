/**
 * Service Worker Placeholder
 *
 * This is a basic service worker structure ready for future offline support implementation.
 *
 * Future enhancements:
 * - Cache static assets (HTML, CSS, JS, images)
 * - Implement cache-first strategy for assets
 * - Network-first strategy for API calls
 * - Offline fallback page
 * - Background sync for form submissions
 * - Push notifications support
 */

const CACHE_VERSION = 'v1';
const CACHE_NAME = `portfolio-cache-${CACHE_VERSION}`;

// Assets to cache on install (to be implemented)
const STATIC_ASSETS = [
  // '/',
  // '/manifest.json',
  // Add your critical assets here
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');

  // Skip waiting to activate immediately
  self.skipWaiting();

  // Uncomment when ready to implement caching
  /*
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed', error);
      })
  );
  */
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Service Worker: Clearing old cache', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  // For now, just pass through to network
  // Uncomment when ready to implement caching strategy
  /*
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Add to cache
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline fallback page if available
        // return caches.match('/offline.html');
      })
  );
  */
});

// Background sync (for future implementation)
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync event', event.tag);

  // if (event.tag === 'sync-messages') {
  //   event.waitUntil(syncMessages());
  // }
});

// Push notifications (for future implementation)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push event', event);

  // const options = {
  //   body: event.data ? event.data.text() : 'No payload',
  //   icon: '/icon-192x192.png',
  //   badge: '/badge-72x72.png'
  // };

  // event.waitUntil(
  //   self.registration.showNotification('Portfolio', options)
  // );
});

console.log('Service Worker: Loaded (placeholder mode)');
