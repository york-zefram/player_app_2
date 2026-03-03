const CACHE_NAME = 'zpn-v1';
const ASSETS = [
  './',
  './index.html',
  './icon.png' // アイコン画像がある場合
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});