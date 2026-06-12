self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone()
        caches.open('xiaowo-v1').then((cache) => {
          cache.put(event.request, clone)
        })
        return response
      })
    })
  )
})
