
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('bft-store').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        '/src/main.jsx',
      ])
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
