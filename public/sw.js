const CACHE = 'fashion-inspo-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  'https://unpkg.com/react@18.3.1/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = e.request.url;
  // Cache-first for app shell and CDN assets
  if (SHELL.some(s => url.endsWith(s) || url === s) || url.includes('unpkg.com')) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
      return res;
    })));
    return;
  }
  // Network-first for images (Unsplash etc), cache for offline
  if (e.request.destination === 'image') {
    e.respondWith(fetch(e.request).then(res => {
      if (res.ok) { const cl = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cl)); }
      return res;
    }).catch(() => caches.match(e.request)));
    return;
  }
  // Default: network with cache fallback
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
