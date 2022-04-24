
const catchName ='v2'

const cacheAssets = [
  'index.html',
  '/css/index.css',
  '/js/index.js'
]

self.addEventListener('install', (e) => {
  console.log('Service Worker: Installed')

  // e.waitUntil(
  //   caches.open(catchName).then((cache) => {
  //     console.log('Service Worker: Caching Files')
  //     cache.addAll(cacheAssets)
  //   }).then(() => {
  //     self.skipWaiting()
  //   })
  // )
})

self.addEventListener('activate', (e) => {
  console.log('Service Worker: Activated')
  e.waitUntil(
    caches.keys().then(catchNames => {
      return Promise.all(
        catchNames.map((cache) => {
          if (cache !== catchName) {
            console.log('Service Worker: Clearing old cache')
            return caches.delete(cache)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', (e) => {
  console.log('Service Worker: Fetching')
  e.respondWith(
    // fetch(e.request).catch(() => {
    //   caches.match(e.request)
    // })
    fetch(e.request).then((res) => {
      if(e.request.url.match("^(http|https)://")) {
        const resClone = res.clone()
        caches.open(catchName).then((cache) => {
          cache.put(e.request, resClone)
        })
      }
      return res
    }).catch(() => {
      caches.match(e.request).then((res) => res)
    })
  )
})
