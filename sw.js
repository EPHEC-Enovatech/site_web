
var cache = "sensory-static-v2";
var userCache = 'sensory-static-userdata-v2';
var dataCache = "sensory-static-records-v2";

var cachePages = [
    '/adrien/',
    '/adrien/userPage.html',
    '/adrien/userHTML/changeMDP.html',
    '/adrien/userHTML/userInfo.html',
    '/adrien/userHTML/adminPage.html',
    '/adrien/userHTML/addBox.html',
    '/adrien/userHTML/showBox.html',
    '/adrien/userHTML/showData.html',
    '/adrien/graph.html',
    '/adrien/manifest.json',
    '/adrien/JS/app.js',
    '/adrien/JS/index.js',
    '/adrien/JS/jquery-3.3.1.min.js',
    '/adrien/JS/jquery.waypoints.min.js',
    '/adrien/JS/cookie_hub.js',
    '/adrien/JS/auth.js',
    '/adrien/JS/moment-with-locales.min.js',
    '/adrien/JS/bigSlide.min.js',
    '/adrien/JS/userPage.js',
    '/adrien/JS/Chart.bundle.min.js',
    '/adrien/JS/graphiqueBuilder.js',
    '/adrien/JS/datepicker.min.js',
    '/adrien/JS/datepicker.fr-FR.js',
    '/adrien/JS/graph.js',
    '/adrien/CSS/index.css',
    '/adrien/CSS/navBar.css',
    '/adrien/CSS/userPage/userPage.css',
    '/adrien/IMG/logo.svg',
    '/adrien/IMG/menu.svg',
    '/adrien/IMG/icon/soil.svg',
    '/adrien/IMG/icon/solar-energy.svg',
    '/adrien/IMG/icon/raindrops.svg',
    '/adrien/IMG/icon/globe-grid.svg',
    '/adrien/IMG/team/simFau2.jpg',
    '/adrien/IMG/team/adrNini.jpg',
    '/adrien/IMG/team/jonGoo2.jpg',
    '/adrien/IMG/team/benDmh.jpg',
    '/adrien/IMG/team/yveHen2.jpg',
    '/adrien/IMG/team/casDuq.jpg',
    '/adrien/IMG/team/nazHey.jpg',
    '/adrien/IMG/icon/stamp.svg',
    '/adrien/IMG/icon/close-white.svg',
    '/adrien/IMG/fond_big2.jpg',
    '/adrien/IMG/icon/trello.svg',
    '/adrien/IMG/icon/github.svg',
    '/adrien/IMG/avatar.png',
    '/adrien/IMG/favicon.png',
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
        event.respondWith(fetch(event.request))
        /* event.respondWith(
            serveRecordsData(event.request)
        );*/
        return;
    } else if (event.request.url.includes('api.sensorygarden.be/')) {
        fetch()
        event.respondWith(
            fetch(event.request)
            //serveUserData(event.request)
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