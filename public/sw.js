/* تدرّج — Service Worker: تخزين مؤقت للعمل دون اتصال */
const CACHE = 'tadaruj-v1';
const SHELL = ['/', '/icon-192.png', '/icon-512.png', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;

  // ملفات PDF وPPTX والصور والأصول الثابتة: من الشبكة أولاً ثم الكاش (تحديث تلقائي)
  const isAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/chains/') ||
    /\.(png|jpg|jpeg|svg|webp|ico|woff2?|pdf|pptx)$/.test(url.pathname);

  if (isAsset) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // صفحات التطبيق: الشبكة أولاً، والرجوع للكاش دون اتصال
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return res;
        })
        .catch(async () => (await caches.match('/')) || Response.error())
    );
  }
});
