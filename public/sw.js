// Wedding Website Service Worker
// Simple caching strategy without external dependencies

const CACHE_NAME = 'wedding-website-v1';
const urlsToCache = ['/', '/static/js/bundle.js', '/static/css/main.css', '/manifest.json'];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.log('Cache installation failed:', error);
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
      .catch((error) => {
        console.log('Fetch failed:', error);
        throw error;
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for guestbook submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-guestbook') {
    event.waitUntil(syncGuestbookSubmissions());
  }
});

async function syncGuestbookSubmissions() {
  // Implementation for offline guestbook submissions
  try {
    const submissions = await getStoredSubmissions();
    for (const submission of submissions) {
      try {
        await fetch('/api/guestbook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submission),
        });
        await removeStoredSubmission(submission.id);
      } catch (error) {
        console.log('Will retry submission later:', error);
      }
    }
  } catch (error) {
    console.log('Background sync failed:', error);
  }
}

async function getStoredSubmissions() {
  // Placeholder - implement IndexedDB storage
  return [];
}

async function removeStoredSubmission(id) {
  // Placeholder - implement IndexedDB removal
  console.log('Removing submission:', id);
}
