const CACHE_NAME = 'zpn-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon.png'
];

// インストール時にファイルを保存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// 圏外の時はキャッシュからファイルを出す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
