const CACHE_NAME = "latihan1_2";
var urlsToCache = [
    "/", 
    "/index.html",
    "/nav.html",
    "/sw.js",
    "/css/materialize.css",
    "/css/materialize.min.css",
    "/img/icon-192.png",
    "/img/icon-256.png",
    "/img/icon-384.png",
    "/img/icon-512.png",
    "/js/materialize.js",
    "/js/materialize.min.js",
    "/js/nav.js",
    "/js/reg-sw.js",
    "/js/view.js",
    "/js/page.js",
    "/js/matchview.js",
    "/js/idb.js",
    "/js/db.js",
    "/js/api.js",
    "/js/helper.js",
    "/manifest.json",
    "/main.js",
    "/push.js"


];
 
self.addEventListener("install", function(event) {
  console.log("ServiceWorker: Menginstall..");
 
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      console.log("ServiceWorker: Membuka cache..");
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("fetch", function(event) {
  var base_url = "https://api.football-data.org/v2/";
  if (event.request.url.indexOf(base_url) > -1) {
    event.respondWith(
      caches.open(CACHE_NAME).then(function(cache) {
        return fetch(event.request).then(function(response) {
          cache.put(event.request.url, response.clone());
          return response;
        })
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function(response) {
        return response || fetch (event.request);
      })
    )
  }
});
self.addEventListener('push', function (event) {
  var body;
  if (event.data) {
    body = event.data.text();
  } else {
    body = 'Push message no payload';
  }
  var options = {
    body: body,
    icon: 'img/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  event.waitUntil(
    self.registration.showNotification('Push Notification', options)
  );
});