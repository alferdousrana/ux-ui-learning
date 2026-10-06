/* ==========================================================================
   UX-UI service worker — offline-first.
   - Precaches the full app shell + all learning content on install.
   - Same-origin requests: cache-first, falling back to network (and caching).
   - Google Fonts: stale-while-revalidate (optional; system fonts are fallback).
   - Navigations fall back to the cached index.html when offline.
   Bump CACHE_VERSION when files change.
   ========================================================================== */
const CACHE_VERSION = 'uxui-v1.1.0';
const RUNTIME = 'uxui-runtime-v1';
const PRECACHE = [
  './',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/icon.svg',
  './css/components.css',
  './css/layout.css',
  './css/reset.css',
  './css/responsive.css',
  './css/themes.css',
  './css/variables.css',
  './data/career.js',
  './data/case-studies.js',
  './data/challenges.js',
  './data/comparisons.js',
  './data/content.js',
  './data/curriculum-process.js',
  './data/curriculum-ux.js',
  './data/figma-plugins.js',
  './data/figma.js',
  './data/glossary.js',
  './data/questions-b1.js',
  './data/questions.js',
  './data/ui.js',
  './data/ux-laws.js',
  './data/ux-research.js',
  './index.html',
  './js/app.js',
  './js/core/exam.js',
  './js/core/i18n.js',
  './js/core/icons.js',
  './js/core/progress.js',
  './js/core/recommendations.js',
  './js/core/router.js',
  './js/core/search.js',
  './js/core/state.js',
  './js/core/storage.js',
  './js/core/transfer.js',
  './js/core/utils.js',
  './js/firebase/config.js',
  './js/firebase/remote-store.js',
  './js/firebase/sync.js',
  './js/ui/components.js',
  './js/ui/mock.js',
  './js/ui/visuals.js',
  './js/views/cases.js',
  './js/views/challenges.js',
  './js/views/dashboard.js',
  './js/views/exams.js',
  './js/views/figma.js',
  './js/views/labs.js',
  './js/views/laws.js',
  './js/views/learn.js',
  './js/views/library.js',
  './js/views/me.js',
  './js/views/practice.js',
  './js/views/research.js',
  './js/views/shared.js',
  './manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![CACHE_VERSION, RUNTIME].includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(RUNTIME).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok || r.type === 'opaque') c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(RUNTIME).then((c) => c.put(req, copy)); }
    return r;
  })));
});

self.addEventListener('message', (e) => { if (e.data === 'skipWaiting') self.skipWaiting(); });
