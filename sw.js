const CACHE_NAME = "d-sathi-v4";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./manifest.json",
"./icon192.png",
"./icon512.png",
"./offline.html"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache =>
cache.addAll(FILES_TO_CACHE)
)
);
self.skipWaiting();
});

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

self.addEventListener("fetch", event => {
if (event.request.method !== "GET") return;

if (event.request.mode === "navigate") {
event.respondWith(
fetch(event.request).catch(async () => {
return await caches.match(event.request) ||
await caches.match("./offline.html");
})
);
return;
}

event.respondWith(
fetch(event.request).then(response => {
if (response.ok) {
const copy = response.clone();
caches.open(CACHE_NAME).then(cache =>
cache.put(event.request, copy)
);
}
return response;
}).catch(() => caches.match(event.request))
);
});