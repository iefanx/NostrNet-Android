const CACHE_NAME = 'nostrnet-cache-v1';
const urlsToCache = [
  '/',
  '/path-to-your-page', // Replace with the actual path to your page, if needed
  // Add any other static assets (like CSS, images, etc.) you want to cache here
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // If the request is found in cache, return the cached response
      if (response) {
        return response;
      }
      // If the request is not found in cache, fetch from the network
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any old caches except the current cache
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
