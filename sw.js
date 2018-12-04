
var cache = "sensory-static-v2";

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cache).then(function(cache) {
            return cache.addAll([
                '/adrien/',
                '/adrien/manifest.json',
                '/adrien/JS/app.js',
                '/adrien/JS/index.js',
                '/adrien/JS/jquery-3.3.1.min.js',
                '/adrien/JS/jquery.waypoints.min.js',
                '/adrien/JS/morphext.min.js',
                '/adrien/JS/cookie_hub.js',
                '/adrien/JS/easing.js',
                '/adrien/JS/auth.js',
                '/adrien/JS/accessibility.js',
                '/adrien/CSS/index.css',
                '/adrien/CSS/navBar.css',
                '/adrien/CSS/presentation.css',
                '/adrien/CSS/intro.css',
                '/adrien/CSS/team.css',
                '/adrien/CSS/contact.css',
                '/adrien/CSS/connection.css',
                '/adrien/CSS/navBar_mobile.css',
                '/adrien/CSS/mobile_Section.css',
                '/adrien/CSS/big_screen.css',
                '/adrien/CSS/animate.css',
                "/adrien/IMG/logo.svg",
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
                'https://fonts.googleapis.com/css?family=Roboto',
                "https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2"
            ])
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
    event.respondWith(
        caches.open(cache).then(cache => {
            return cache.match(event.request).then(response => {
               if (response) return response;
               return fetch(event.request);
            })
        })
    )
})