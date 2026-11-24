const CACHE = 'dualar-989b71b3';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "fonts/sch.woff2", "fonts/lit.woff2", "fonts/lit-i.woff2", "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-180.png", "icons/fav-48.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('dualar-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // Sayfa: kayıtlı kopya hemen açılır (internet yavaşken de beklemez); arka planda yeni sürüm denetlenir
    e.respondWith(caches.match('index.html').then(cached => {
      const net = fetch(req).then(r => { if (r.ok){ const cp = r.clone(); caches.open(CACHE).then(c => c.put('index.html', cp)); } return r; });
      if (cached){ e.waitUntil(net.catch(() => {})); return cached; }
      return net;
    }));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req)));
});
