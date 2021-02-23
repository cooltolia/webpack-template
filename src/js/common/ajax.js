function postData(url, options) {
    const requestOptions = {
        method: 'POST',
        headers: options.headers || { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: options.body,
    };
    return fetch(url, requestOptions).then(response => {
        return response.json();
        // if  (response.ok) {
        //     return response.json();
        // } else {
        //     window.location.reload()
        // }
    });
}

function getData(url, options) {
    return fetch(url, options).then(
        response => {
            return response.json();
        },
        e => {}
    );
}

function loadYandexMap(url) {
    return new Promise(resolve => {
        if (window.yandexMapIsLoading) {
            setTimeout(() => resolve(loadYandexMap(url)), 1000);
        } else if (typeof ymaps !== 'undefined') {
            resolve();
        } else {
            // const yandexMapUrl = url;
            window.yandexMapIsLoading = true;
            const yandexMapUrl =
                'https://api-maps.yandex.ru/2.1/?apikey=713c8b1e-20ad-4956-9eb3-9af554ea9153&lang=ru_RU';
            const yandexMapScript = document.createElement('script');
            yandexMapScript.type = 'text/javascript';
            yandexMapScript.src = yandexMapUrl;
            document.body.appendChild(yandexMapScript);

            yandexMapScript.onload = function () {
                window.yandexMapIsLoading = false;
                console.log('resolved');
                resolve();
            };
        }
    });
}

function loadMapBox() {
    return new Promise(resolve => {
        if (window.mapBoxIsLoading) {
            setTimeout(() => resolve(loadMapBox()), 1000);
        } else if (typeof mapboxgl !== 'undefined') {
            resolve();
        } else {
            // const yandexMapUrl = url;
            window.mapBoxIsLoading = true;
            const scriptUrl = 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js';
            const $script = document.createElement('script');
            $script.type = 'text/javascript';
            $script.src = scriptUrl;

            const styleUrl = 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css';
            const $style = document.createElement('link');
            $style.rel = 'stylesheet';
            $style.href = styleUrl;

            const scriptLoader = new Promise(resolve => {
                document.body.appendChild($script);
                $script.onload = function () {
                    console.log('script resolved');
                    resolve();
                };
            });

            const styleLoader = new Promise((resolve, reject) => {
                document.body.appendChild($style);
                $style.addEventListener('load', function () {
                    console.log('style resolved');
                    resolve();
                });
            });

            Promise.all([scriptLoader, styleLoader])
                .then(() => {
                    window.mapBoxIsLoading = false;
                    resolve()
                })
                .catch(e => {
                    console.log('Карта не загрузилась, печаль');
                });
        }
    });
}
