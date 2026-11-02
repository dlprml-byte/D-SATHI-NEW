const CACHE_NAME = "d-sathi-v3";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./manifest.json",
"./icon192.png",
"./icon512.png",
"./offline.html"
];

// Install
self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(FILES_TO_CACHE);
})
);
self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
event.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys
.filter(key => key !== CACHE_NAME)
.map(key => caches.delete(key))
)
)
);
self.clients.claim();
});

// Fetch
self.addEventListener("fetch", event => {
if (event.request.method !== "GET") return;

event.respondWith(
fetch(event.request)
.then(response => {
if (response.ok) {
const copy = response.clone();
caches.open(CACHE_NAME).then(cache => {
cache.put(event.request, copy);
});
}
return response;
})
.catch(async () => {
const cached = await caches.match(event.request);
if (cached) return cached;

    if (event.request.mode === "navigate") {
      return caches.match("./offline.html");
    }
  })

);
});