const CACHE_NAME = "flashcard-v1";

const BASE = self.location.pathname.includes("flashcard-n3-vite")
  ? "/flashcard-n3-vite/"
  : "/";

const FILES = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "vocab.json"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});