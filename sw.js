const CACHE = 'dualar-54f06ba0';
const ASSETS = ["./", "index.html", "manifest.webmanifest", "sch.woff2", "lit.woff2", "lit-i.woff2", "icon-192.png", "icon-512.png", "maskable-512.png", "apple-180.png", "fav-48.png"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, {cache: 'reload'})))).then(() => self.skipWaiting()));
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
      const net = fetch(req.url, {cache: 'no-cache'}).then(r => r.ok ? caches.open(CACHE).then(c => c.put('index.html', r.clone())).then(() => r) : r);
      if (cached){ e.waitUntil(net.catch(() => {})); return cached; }
      return net;
    }));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch: true}).then(r => r || fetch(req)));
});
