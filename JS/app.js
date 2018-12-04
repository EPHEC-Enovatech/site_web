

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('sw.js')
        .then((reg) => {
            if (!navigator.serviceWorker.controller) return;

            if (reg.waiting) {
                updateReady(reg.waiting);
                return;
            }

            if (reg.installing) {
                trackInstalling(reg.installing);
                return;
            }

            reg.addEventListener('updatefound', function() {
                trackInstalling(reg.installing);
            })

            navigator.serviceWorker.addEventListener('controllerchange', function() {
                window.location.reload();
            })


        }).catch((err) => {
            console.log('ServiceWorker registration failed: ', err);
        });
}

function trackInstalling(worker) {
    worker.addEventListener('statechange', function() {
        if (worker.state == 'installed') {
            updateReady(worker)
        }
    })
}

function updateReady(worker) {
    if (confirm("Une nouvelle version du site est disponnible, voulez vous en profiter ?")) {
        worker.postMessage({action: 'skipWaiting'})
    }
}