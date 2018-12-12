
var cache = "sensory-static-v4";
var userCache = 'sensory-static-userdata-v4';
var dataCache = "sensory-static-records-v4";

var cachePages = [
    '/staging/',
    '/staging/userPage.html',
    '/staging/userHTML/changeMDP.html',
    '/staging/userHTML/userInfo.html',
    '/staging/userHTML/adminPage.html',
    '/staging/userHTML/addBox.html',
    '/staging/userHTML/showBox.html',
    '/staging/userHTML/showData.html',
    '/staging/graph.html',
    '/staging/manifest.json',
    '/staging/JS/app.js',
    '/staging/JS/index.js',
    '/staging/JS/jquery-3.3.1.min.js',
    '/staging/JS/jquery.waypoints.min.js',
    '/staging/JS/cookie_hub.js',
    '/staging/JS/auth.js',
    '/staging/JS/moment-with-locales.min.js',
    '/staging/JS/bigSlide.min.js',
    '/staging/JS/userPage.js',
    '/staging/JS/Chart.bundle.min.js',
    '/staging/JS/graphiqueBuilder.js',
    '/staging/JS/datepicker.min.js',
    '/staging/JS/datepicker.fr-FR.js',
    '/staging/JS/graph.js',
    '/staging/CSS/index.css',
    '/staging/CSS/navBar.css',
    '/staging/CSS/userPage/userPage.css',
    '/staging/IMG/logo.svg',
    '/staging/IMG/menu.svg',
    '/staging/IMG/icon/soil.svg',
    '/staging/IMG/icon/solar-energy.svg',
    '/staging/IMG/icon/raindrops.svg',
    '/staging/IMG/icon/globe-grid.svg',
    '/staging/IMG/team/simFau2.jpg',
    '/staging/IMG/team/adrNini.jpg',
    '/staging/IMG/team/jonGoo2.jpg',
    '/staging/IMG/team/benDmh.jpg',
    '/staging/IMG/team/yveHen2.jpg',
    '/staging/IMG/team/casDuq.jpg',
    '/staging/IMG/team/nazHey.jpg',
    '/staging/IMG/icon/stamp.svg',
    '/staging/IMG/icon/close-white.svg',
    '/staging/IMG/fond_big2.jpg',
    '/staging/IMG/icon/trello.svg',
    '/staging/IMG/icon/github.svg',
    '/staging/IMG/avatar.png',
    '/staging/IMG/favicon.png',
    'https://fonts.googleapis.com/css?family=Roboto',
    'https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2'
]

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cache).then(function(cache) {
            return cache.addAll(cachePages)
        })
    )
})

self.addEventListener('message', function(event) {
    if (event.data.action == 'skipWaiting') {
        self.skipWaiting();
    }
})


self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName.startsWith('sensory-') &&
                        cacheName != cache;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            )
        })
    )
})


self.addEventListener('fetch', function(event) {
    if (event.request.url.includes('api.sensorygarden.be/records/')) {
        event.respondWith(
            serveRecordsData(event.request)
        );
        return;
    } else if (event.request.url.includes('api.sensorygarden.be/')) {
        event.respondWith(
            serveUserData(event.request)
        )
        return;
    }
    event.respondWith(
        caches.open(cache).then(cache => {
            return cache.match(event.request).then(response => {
               if (response) return response;
               return fetch(event.request);
            })
        })
    )
})

function serveRecordsData(request) {
    return fetch(request).then(networkResponse => {
        return caches.open(dataCache).then(cache => {
            cache.put(request.url, networkResponse.clone())
            return networkResponse;
        })
    }).catch(error => {
        if (error.message === "Failed to fetch") {
            return caches.open(dataCache).then(cache => {
                return cache.match(request.url)
            })
        }
    })
}

function serveUserData(request) {
    return fetch(request).then(networkResponse => {
        return caches.open(userCache).then(cache => {
            cache.put(request.url, networkResponse.clone())
            return networkResponse;
        })
    }).catch(error => {
        if (error.message === "Failed to fetch") {
            return caches.open(userCache).then(cache => {
                return cache.match(request.url)
            })
        }
    })
}
