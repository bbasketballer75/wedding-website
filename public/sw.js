// Service Worker for Wedding Website PWA
// Provides offline functionality, caching, and background sync

const CACHE_NAME = 'wedding-website-v1';
const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
const IMAGE_CACHE = 'image-cache-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/badge-72x72.png',
  '/favicon.ico'
];

// Network-first resources (always try network first)
const NETWORK_FIRST_PATHS = [
  '/api/',
  '/auth/',
  '/_next/static/'
];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATHS = [
  '/images/',
  '/photos/',
  '/audio/',
  '/_next/image',
  '.woff2',
  '.woff',
  '.ttf',
  '.css',
  '.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && 
                cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== IMAGE_CACHE) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Claim all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);

  // API requests - Network first with fallback
  if (isNetworkFirst(url.pathname)) {
    return networkFirstStrategy(request);
  }

  // Static assets - Cache first
  if (isCacheFirst(url.pathname)) {
    return cacheFirstStrategy(request);
  }

  // Images - Cache first with WebP optimization
  if (isImageRequest(request)) {
    return imageStrategy(request);
  }

  // Default: Stale while revalidate
  return staleWhileRevalidateStrategy(request);
}

// Network first strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, checking cache for:', request.url);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/offline');
    }

    throw error;
  }
}

// Cache first strategy (for static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch:', request.url);
    throw error;
  }
}

// Image strategy with WebP optimization
async function imageStrategy(request) {
  const url = new URL(request.url);
  
  // Check cache first
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      
      // Cache with size limit (50MB total)
      const cacheSize = await getCacheSize(IMAGE_CACHE);
      if (cacheSize < 50 * 1024 * 1024) { // 50MB
        cache.put(request, networkResponse.clone());
      } else {
        console.log('🗃️ Image cache full, not caching:', request.url);
      }
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Failed to fetch image:', request.url);
    
    // Return placeholder image for failed image requests
    const placeholderUrl = '/images/placeholder.webp';
    return caches.match(placeholderUrl) || fetch(placeholderUrl);
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);

  // Start fetch in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignore network errors for background fetch
  });

  // Return cached version immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Wait for network if no cache
  return fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'wedding-data-sync') {
    event.waitUntil(syncWeddingData());
  }
});

async function syncWeddingData() {
  try {
    console.log('📤 Syncing wedding data...');
    
    // Get sync queue from IndexedDB or localStorage
    const syncData = await getSyncQueue();
    
    for (const item of syncData) {
      try {
        await syncDataItem(item);
        await removeSyncItem(item.id);
        console.log('✅ Synced item:', item.id);
      } catch (error) {
        console.error('❌ Failed to sync item:', item.id, error);
      }
    }
    
    // Notify clients about sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data: { synced: syncData.length }
      });
    });
    
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncDataItem(item) {
  const response = await fetch(item.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(item.data)
  });

  if (!response.ok) {
    throw new Error(`Sync failed: ${response.statusText}`);
  }

  return response.json();
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received');
  
  const data = event.data ? event.data.json() : {};
  
  const options = {
    title: data.title || 'Wedding Update',
    body: data.body || 'New content available!',
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: data.tag || 'wedding-update',
    data: data.data || {},
    requireInteraction: data.requireInteraction || false,
    actions: data.actions || [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(options.title, options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();

  const action = event.action;
  const data = event.notification.data;

  if (action === 'view' || !action) {
    // Open the app or navigate to specific URL
    const urlToOpen = data.url || '/';
    
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          // Check if app is already open
          for (const client of clients) {
            if (client.url === urlToOpen && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Open new window
          if (self.clients.openWindow) {
            return self.clients.openWindow(urlToOpen);
          }
        })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'QUEUE_SYNC':
      queueSyncData(data);
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches();
      break;
  }
});

// Utility functions
function isNetworkFirst(pathname) {
  return NETWORK_FIRST_PATHS.some(path => pathname.startsWith(path));
}

function isCacheFirst(pathname) {
  return CACHE_FIRST_PATHS.some(path => 
    pathname.includes(path) || pathname.endsWith(path)
  );
}

function isImageRequest(request) {
  return request.destination === 'image' ||
         /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(request.url);
}

async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let size = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      size += blob.size;
    }
  }
  
  return size;
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
  console.log('🗑️ All caches cleared');
}

async function getSyncQueue() {
  // In a real implementation, this would use IndexedDB
  // For now, return empty array as placeholder
  return [];
}

async function removeSyncItem(id) {
  // In a real implementation, this would remove from IndexedDB
  console.log('Removing sync item:', id);
}

async function queueSyncData(data) {
  // In a real implementation, this would store in IndexedDB
  console.log('Queueing sync data:', data);
}

// Periodic background sync (if supported)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'wedding-photos-sync') {
      event.waitUntil(syncWeddingPhotos());
    }
  });
}

async function syncWeddingPhotos() {
  console.log('📸 Syncing wedding photos in background...');
  
  try {
    const response = await fetch('/api/photos/recent');
    if (response.ok) {
      const photos = await response.json();
      
      // Pre-cache new photos
      const imageCache = await caches.open(IMAGE_CACHE);
      for (const photo of photos.slice(0, 10)) { // Cache first 10
        try {
          await imageCache.add(photo.url);
        } catch (error) {
          console.log('Failed to cache photo:', photo.url);
        }
      }
    }
  } catch (error) {
    console.error('Photo sync failed:', error);
  }
}

console.log('🎉 Wedding Website Service Worker loaded successfully!');