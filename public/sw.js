const CACHE_PREFIX = 'eduvantage-';
const CACHE_VERSION = 'eduvantage-shell-v3';
const STATIC_CACHE = 'eduvantage-static-v3';
const APP_SCOPE = self.registration.scope;
const APP_SCOPE_PATH = new URL(APP_SCOPE).pathname;
const PUBLIC_ASSET_PATHS = [
  new URL('assets/', APP_SCOPE).pathname,
  new URL('icons/', APP_SCOPE).pathname,
];

function isSafeToCache(response) {
  const cacheControl = response.headers.get('Cache-Control') || '';
  const vary = (response.headers.get('Vary') || '').split(',').map(value => value.trim().toLowerCase());
  return response.ok && response.type === 'basic' &&
    !/\b(private|no-store)\b/i.test(cacheControl) &&
    !vary.includes('*') && !vary.includes('cookie') && !vary.includes('authorization');
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    try {
      const shell = await fetch(APP_SCOPE, { cache: 'reload' });
      if (isSafeToCache(shell) && shell.headers.get('content-type')?.includes('text/html')) {
        await cache.put(APP_SCOPE, shell);
      }
    } catch {
      // Installation may still complete; the app can refresh its offline shell on a later visit.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && ![CACHE_VERSION, STATIC_CACHE].includes(key))
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin ||
      !url.pathname.startsWith(APP_SCOPE_PATH) || request.headers.has('Authorization') ||
      /\/(api|auth)(\/|$)/i.test(url.pathname)) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (isSafeToCache(response) && response.headers.get('content-type')?.includes('text/html')) {
          const cache = await caches.open(CACHE_VERSION);
          await cache.put(APP_SCOPE, response.clone());
        }
        return response;
      } catch {
        const cache = await caches.open(CACHE_VERSION);
        return (await cache.match(APP_SCOPE)) || new Response('EduVantage is offline. Reconnect to refresh this learning page.', {
          status: 503,
          headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
      }
    })());
    return;
  }

  const isPublicBuildAsset = PUBLIC_ASSET_PATHS.some(path => url.pathname.startsWith(path));
  if (!isPublicBuildAsset || !['script', 'style', 'image', 'font'].includes(request.destination)) return;

  event.respondWith((async () => {
    const cache = await caches.open(STATIC_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (isSafeToCache(response)) await cache.put(request, response.clone());
    return response;
  })());
});
