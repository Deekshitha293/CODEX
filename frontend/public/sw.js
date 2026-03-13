/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

if (workbox) {
  workbox.core.skipWaiting();
  workbox.core.clientsClaim();

  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'document',
    new workbox.strategies.NetworkFirst({ cacheName: 'pages-cache' })
  );

  workbox.routing.registerRoute(
    ({ request }) => ['script', 'style', 'image'].includes(request.destination),
    new workbox.strategies.StaleWhileRevalidate({ cacheName: 'assets-cache' })
  );

  workbox.routing.registerRoute(
    ({ url }) => url.pathname.startsWith('/api/invoices'),
    new workbox.strategies.NetworkFirst({ cacheName: 'billing-api-cache' })
  );
}
