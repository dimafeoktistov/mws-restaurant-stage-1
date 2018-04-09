const cacheName = 'rr-app-v1';
const cachedFiles = [
  '/index.html',
  '/offline.html',
  '/css/main.css',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg',
  '/js/restaurant_info.js',
  '/js/restaurant_main.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(cachedFiles);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => {
              return name.startsWith('rr-app-') && name !== cacheName;
            })
            .map(name => {
              return caches.delete(name);
            })
        );
      })
      .catch(err => {
        console.log('err', err);
      })
  );
});

self.addEventListener('fetch', event => {
  if (
    event.request.method === 'GET' &&
    event.request.url.indexOf('browser-sync') === -1 &&
    event.request.url.indexOf('localhost') >= 0
  ) {
    event.respondWith(
      caches.open(cacheName).then(cache => {
        return cache
          .match(event.request)
          .then(resp => {
            return (
              resp ||
              fetch(event.request).then(resp => {
                cache.put(event.request, resp.clone());
                return resp;
              })
            );
          })
          .catch(err => {
            console.log('err', err);
            return cache.match('/offline.html');
          });
      })
    );
  }
});
