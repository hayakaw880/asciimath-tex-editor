const CACHE_NAME = 'asciitex-cache-v2';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/katex.min.css',
  'js/katex.min.js',
  'js/html2canvas.min.js',
  'js/asciimath2tex.umd.js',
  'favicon.png'
];

// インストール時にキャッシュ
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// アクティベート時に古いキャッシュ削除
self.addEventListener('activate', evt => {
  evt.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
});

// フェッチ時にキャッシュ優先で返す
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request)
      .then(res => res || fetch(evt.request))
  );
});