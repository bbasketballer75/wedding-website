// Enhanced Service Worker for offline functionality
const CACHE_NAME = 'theporadas-v1.2.0';
const STATIC_ASSETS = [
  '/',
  '/album',
  '/guestbook',
  '/images/engagement/PoradaProposal-11.webp',
  '/images/landing-bg.webp',
  '/favicon.svg',
  '/manifest.json',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - sophisticated caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses for offline access
          if (response.ok && request.method === 'GET') {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Images - Cache first, network fallback
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // HTML pages - Stale while revalidate
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
          return networkResponse;
        });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default - Cache first
  event.respondWith(caches.match(request).then((response) => response || fetch(request)));
});

// Background sync for offline uploads
self.addEventListener('sync', (event) => {
  if (event.tag === 'upload-photos') {
    event.waitUntil(
      // Process queued uploads when back online
      processQueuedUploads()
    );
  }
});

// Push notifications for admin
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/rings/PoradaProposal-255.webp',
      badge: '/favicon.svg',
      tag: 'wedding-notification',
      data: data.url,
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.notification.data) {
    event.waitUntil(clients.openWindow(event.notification.data));
  }
});

async function processQueuedUploads() {
  // Implementation for processing offline upload queue
  const db = await openDB('wedding-uploads', 1);
  const queuedUploads = await db.getAll('uploads');

  for (const upload of queuedUploads) {
    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: upload.formData,
      });
      await db.delete('uploads', upload.id);
    } catch (error) {
      console.error('Failed to sync upload:', error);
    }
  }
}
