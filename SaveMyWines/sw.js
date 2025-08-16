// Service Worker for SaveMyWines
// Handles offline functionality and caching

const CACHE_NAME = 'savemywines-v1.0.0';
const STATIC_CACHE = 'savemywines-static-v1.0.0';

const STATIC_FILES = [
  '/index.html',
  '/style/styledemo.css',
  '/scripts/main.js',
  '/scripts/scan.js',
  '/scripts/wines.js',
  '/scripts/ui.js',
  '/scripts/api.js',
  '/scripts/storage.js',
  '/scripts/utils.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .catch(error => {
        console.error('Error caching static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== STATIC_CACHE && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - implement caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (isStaticAsset(request)) {
    // Cache-first for static assets (CSS, JS, fonts)
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isPageRequest(request)) {
    // Network-first for pages
    event.respondWith(networkFirst(request, CACHE_NAME));
  } else {
    // Default: network-first for other requests
    event.respondWith(networkFirst(request, CACHE_NAME));
  }
});

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg|ico)$/);
}

function isPageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.html$/) || url.pathname === '/';
}

async function cacheFirst(request, cacheName) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache-first strategy failed:', error);
    // Fallback to cache if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

async function networkFirst(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Network-first strategy failed:', error);
    // Fallback to cache if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}
