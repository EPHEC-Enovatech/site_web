
var cache = "sensory-static-v4";
var userCache = 'sensory-static-userdata-v4';
var dataCache = "sensory-static-records-v4";

var cachePages = [
    '/',
    'userPage.html',
    'userHTML/changeMDP.html',
    'userHTML/userInfo.html',
    'userHTML/adminPage.html',
    'userHTML/addBox.html',
    'userHTML/showBox.html',
    'userHTML/showData.html',
    'graph.html',
    'manifest.json',
    'JS/app.js',
    'JS/index.js',
    'JS/jquery-3.3.1.min.js',
    'JS/jquery.waypoints.min.js',
    'JS/cookie_hub.js',
    'JS/auth.js',
    'JS/moment-with-locales.min.js',
    'JS/bigSlide.min.js',
    'JS/userPage.js',
    'JS/Chart.bundle.min.js',
    'JS/graphiqueBuilder.js',
    'JS/datepicker.min.js',
    'JS/datepicker.fr-FR.js',
    'JS/graph.js',
    'CSS/index.css',
    'CSS/navBar.css',
    'CSS/userPage/userPage.css',
    'IMG/logo.svg',
    'IMG/menu.svg',
    'IMG/icon/soil.svg',
    'IMG/icon/solar-energy.svg',
    'IMG/icon/raindrops.svg',
    'IMG/icon/globe-grid.svg',
    'IMG/team/simFau2.jpg',
    'IMG/team/adrNini.jpg',
    'IMG/team/jonGoo2.jpg',
    'IMG/team/benDmh.jpg',
    'IMG/team/yveHen2.jpg',
    'IMG/team/casDuq.jpg',
    'IMG/team/nazHey.jpg',
    'IMG/icon/stamp.svg',
    'IMG/icon/close-white.svg',
    'IMG/fond_big2.jpg',
    'IMG/icon/trello.svg',
    'IMG/icon/github.svg',
    'IMG/avatar.png',
    'IMG/favicon.png',
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
