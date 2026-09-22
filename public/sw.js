// Service Worker Mínimo para habilitar a instalação PWA
const CACHE_NAME = 'app-catalog-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Permite requisições normais da rede
  event.respondWith(fetch(event.request));
});