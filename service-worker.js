const CACHE_NAME = "expense-tracker-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/app.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://cdn.tailwindcss.com" // Cache Tailwind CSS CDN
];

// Install the service worker and cache assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error("Cache installation failed:", err);
      })
  );
});

// Fetch cached resources or fall back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // For failed requests (like images), you could return a fallback
            return new Response('Offline fallback content', {
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Clean up old caches
self.addEventListener("activate", event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});