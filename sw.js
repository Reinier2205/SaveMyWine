// Service Worker for SaveMyWines
// Handles offline functionality and caching

const CACHE_NAME = 'savemywines-v1.0.0';
const STATIC_CACHE = 'savemywines-static-v1.0.0';
const DYNAMIC_CACHE = 'savemywines-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/scan.html',
    '/wines.html',
    '/about.html',
    '/style/styledemo.css',
    '/scripts/main.js',
    '/scripts/scan.js',
    '/scripts/wines.js',
    '/scripts/ui.js',
    '/scripts/api.js',
    '/scripts/storage.js',
    '/scripts/utils.js',
    '/manifest.webmanifest'
];

// Install event - cache static files
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
    
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                // Take control of all clients
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip non-HTTP(S) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }
    
    // Handle different types of requests
    if (isStaticFile(request)) {
        // Static files - cache first strategy
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isAPIRequest(request)) {
        // API requests - network first strategy
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        // Other requests - network first strategy
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// Check if request is for a static file
function isStaticFile(request) {
    const url = new URL(request.url);
    const staticExtensions = ['.html', '.css', '.js', '.json', '.xml', '.txt'];
    const staticPaths = ['/style/', '/scripts/', '/public/'];
    
    // Check file extensions
    for (const ext of staticExtensions) {
        if (url.pathname.endsWith(ext)) {
            return true;
        }
    }
    
    // Check static paths
    for (const path of staticPaths) {
        if (url.pathname.startsWith(path)) {
            return true;
        }
    }
    
    // Check if it's a main page
    if (url.pathname === '/' || url.pathname === '/index.html') {
        return true;
    }
    
    return false;
}

// Check if request is an API request
function isAPIRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith('/api/') || url.hostname === 'api.example.com';
}

// Cache first strategy - serve from cache, fallback to network
async function cacheFirst(request, cacheName) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        
        // Return offline page if available
        if (request.destination === 'document') {
            const offlineResponse = await caches.match('/offline.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }
        
        throw error;
    }
}

// Network first strategy - try network, fallback to cache
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Network first strategy failed:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline page if available
        if (request.destination === 'document') {
            const offlineResponse = await caches.match('/offline.html');
            if (offlineResponse) {
                return offlineResponse;
            }
        }
        
        throw error;
    }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
    console.log('Background sync triggered:', event.tag);
    
    if (event.tag === 'background-sync-wine') {
        event.waitUntil(syncWineData());
    }
});

// Sync wine data when back online
async function syncWineData() {
    try {
        // Get any pending wine data from IndexedDB or localStorage
        // This would be implemented based on your data storage strategy
        
        console.log('Syncing wine data...');
        
        // Example implementation:
        // const pendingWines = await getPendingWines();
        // for (const wine of pendingWines) {
        //     await syncWineToServer(wine);
        // }
        
    } catch (error) {
        console.error('Error syncing wine data:', error);
    }
}

// Push notification handling
self.addEventListener('push', event => {
    console.log('Push notification received:', event);
    
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body || 'New notification from SaveMyWines',
            icon: '/public/images/icon-192.png',
            badge: '/public/images/icon-192.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Wines',
                    icon: '/public/images/icon-192.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/public/images/icon-192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'SaveMyWines', options)
        );
    }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    console.log('Notification clicked:', event);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/wines.html')
        );
    } else if (event.action === 'close') {
        // Notification already closed
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', event => {
    console.log('Service Worker received message:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});

// Error handling
self.addEventListener('error', event => {
    console.error('Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', event => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        console.log('Periodic background sync:', event.tag);
        
        if (event.tag === 'wine-sync') {
            event.waitUntil(syncWineData());
        }
    });
}

// Install prompt handling
self.addEventListener('beforeinstallprompt', event => {
    console.log('Install prompt available');
    
    // Store the event for later use
    event.waitUntil(
        Promise.resolve().then(() => {
            // This will be handled by the main thread
            return true;
        })
    );
});

// App installed event
self.addEventListener('appinstalled', event => {
    console.log('App installed successfully');
    
    // Track installation analytics if needed
    // analytics.track('app_installed');
});

// App update available
self.addEventListener('updatefound', event => {
    console.log('App update available');
    
    // Notify clients about the update
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'UPDATE_AVAILABLE',
                version: CACHE_NAME
            });
        });
    });
});

// Handle offline/online status changes
self.addEventListener('online', event => {
    console.log('App is online');
    
    // Sync any pending data
    event.waitUntil(syncWineData());
});

self.addEventListener('offline', event => {
    console.log('App is offline');
    
    // Notify clients about offline status
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'OFFLINE_STATUS',
                online: false
            });
        });
    });
});
