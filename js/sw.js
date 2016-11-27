var VERSION = 1;
var STATIC_CACHE_NAME = 'static_' + VERSION;
var ORIGIN = location.protocol + '//' + location.hostname +
             (location.port ? ':' + location.port : '');
var STATIC_FILES = [
  ORIGIN + '/json/geojson_japan.json'
];
var STATIC_FILE_URL_HASH = {};
STATIC_FILES.forEach(function(x){ STATIC_FILE_URL_HASH[x] = true; });

self.addEventListener('install', function(evt) {
    evt.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(function(cache) {
            return Promise.all(STATIC_FILES.map(function(url) {
                return fetch(new Request(url)).then(function(response) {
                    if (response.ok)
                      return cache.put(response.url, response);
                    return Promise.reject(
                        'Invalid response.  URL:' + response.url +
                        ' Status: ' + response.status);
                  });
              }));
          }));
  });

self.addEventListener('fetch', function(evt) {
    if (!STATIC_FILE_URL_HASH[evt.request.url])
      return;
    evt.respondWith(caches.match(evt.request, {cacheName: STATIC_CACHE_NAME}));
  });

self.addEventListener('activate', function(evt) {
    evt.waitUntil(
      caches.keys().then(function(keys) {
            var promises = [];
            keys.forEach(function(cacheName) {
              if (cacheName != STATIC_CACHE_NAME)
                promises.push(caches.delete(cacheName));
            });
            return Promise.all(promises);
          }));
  });
