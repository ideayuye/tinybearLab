
const
    version = '1.0.0',
    CACHE = version + '::PWAsite',
    offlineURL = '/offline/',
    installFilesEssential = [
        '/index.html',
        '/manifest.json',
        '/images/logo144.png'
    ].concat(offlineURL),
    installFilesDesirable = [
        // '/favicon.ico',
        '/images/logo144.png'
    ];

// install static assets
function installStaticFiles() {
    return caches.open(CACHE)
        .then(cache => {
            // cache desirable files
            cache.addAll(installFilesDesirable);

            // cache essential files
            return cache.addAll(installFilesEssential);
        });
}

// application installation
self.addEventListener('install', event => {

    console.log('service worker: install');

    // cache core files
    event.waitUntil(
        installStaticFiles()
            .then(() => self.skipWaiting())
    );

});


self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);
    if (requestUrl.origin === location.origin) {
        if (requestUrl.pathname === '/') {
            event.respondWith(
                caches.open(CACHE).then(function (cache) {
                    return fetch(event.request).then(function (networkResponse) {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }).catch(function () {
                        return cache.match(event.request);
                    });
                })
            );
        }
    }

    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});