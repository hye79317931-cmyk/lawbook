const CACHE='lawbook-flat-v4';
const CORE=["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./행정절차법.pdf", "./행정심판법.pdf", "./행정소송법.pdf", "./행정대집행법.pdf", "./행정기본법.pdf", "./행정규제기본법.pdf", "./형법.pdf", "./형사소송법.pdf"];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(CORE.map(url => cache.add(url).catch(() => null)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  const isPage = event.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isPage) {
    event.respondWith(
      fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(event.request, clone));
        return resp;
      }).catch(() => caches.match(event.request).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const fresh = fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(event.request, clone));
        return resp;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});
