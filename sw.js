const CACHE_VERSION = 'ricecost-v3';
const APP_SHELL_CACHE = `${CACHE_VERSION}-app-shell`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './translations.jsx',
  './components.jsx',
  './RiceCostApp.jsx',
  './fonts/sarabun.css',
  './fonts/sarabun-300.ttf',
  './fonts/sarabun-400.ttf',
  './fonts/sarabun-500.ttf',
  './fonts/sarabun-600.ttf',
  './fonts/sarabun-700.ttf',
  './fonts/sarabun-800.ttf',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

const REMOTE_ASSETS = [
  'https://unpkg.com/react@18.3.1/umd/react.development.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js',
  'https://unpkg.com/@babel/standalone@7.29.0/babel.min.js',
  'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700;800&display=swap',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YL5rulw.ttf',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVjJx26TKEr37c9WBI.ttf',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YOZqulw.ttf',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YMptulw.ttf',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YK5sulw.ttf',
  'https://fonts.gstatic.com/s/sarabun/v17/DtVmJx26TKEr37c9YLJvulw.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(APP_SHELL_CACHE);
    await cache.addAll(LOCAL_ASSETS);
    await Promise.allSettled(
      REMOTE_ASSETS.map(async url => {
        const request = new Request(url, { mode: 'cors', credentials: 'omit' });
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response);
      })
    );
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys
        .filter(key => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(key))
        .map(key => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreVary: true }) ||
    await caches.match(request.url, { ignoreVary: true });
  if (cached) return cached;

  const response = await fetch(request);
  if (request.method === 'GET' && response && (response.ok || response.type === 'opaque')) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        return await cacheFirst(event.request);
      } catch (err) {
        return await caches.match('./index.html');
      }
    })());
    return;
  }

  event.respondWith((async () => {
    try {
      return await cacheFirst(event.request);
    } catch (err) {
      return await caches.match(event.request, { ignoreVary: true }) ||
        await caches.match(event.request.url, { ignoreVary: true });
    }
  })());
});
