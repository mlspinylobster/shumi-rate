// navigator.serviceWorker.register('js/sw.js', { scope: './' });

const configureMap = searcher => {
    let prefScores, cityScoresMap;
    let mode = 'pref';

    const map = new Map();
    map.getGeoJson.then(geoJson => {
        const mapView = L.map('map');
        mapView.scrollWheelZoom.disable();

        const getColor = jcode => {
            if (jcode === null) { return 'white'; }
            if (!(prefScores)) {
                return 'white';
            }

            const colors = ['#ff0000', '#ff7800', '#ffa300'];
            let index;
            const prefCode = parseInt(jcode.substring(0, 2));
            const cityCode = jcode.substring(2);

            const nowZoom = mapView.getZoom() || 5;
            if (8 <= nowZoom) {
                index = Math.floor(cityScoresMap[jcode] / (100.1 / 3));
                //index = Math.floor(Math.random() * 3);
            } else {
                const pref = prefScores
                    .filter(pref => parseInt(pref.code) === prefCode)[0];
                index = Math.floor(pref.score / (100.1 / 3));
            }

            //const index = Math.floor(Math.random() * 3);
            return colors[index];
        };
        // zoomレベルが8になったら市区町村毎、
        const style = feature => {
            const color = getColor(feature.properties.JCODE);
            return {
                fillColor: color,
                fillOpacity: 1,
                color: mode === 'pref' ? color : 'white',
                opacity: 1,
                weight: 1
            };
        };
        const layer = L.geoJSON(geoJson, { style: style });

        searcher.getPrefScores()
            .then(x => searcher.getAllCities().then(y => ({ x, y })))
            .then(obj => {
              debugger;
                prefScores = obj.x;
                const cities = obj.y;
                cityScoresMap = cities.reduce((acc, x) => {
                    acc[x.code] = x.score;
                    return acc;
                }, {});
                layer.setStyle(style);
            });

        mapView.on('zoom', () => {
            const zoom = mapView.getZoom();
            if (mode === 'pref' && zoom >= 8) {
                mode = 'city';
            } else if (mode === 'city' && zoom <= 7) {
                mode = 'pref';
            }
            layer.setStyle(style);
        });

        layer.addTo(mapView);
        setTimeout(() => {
            mapView.setView([36.3219088　, 139.0032936], 5);
        }, 1000);

        // 良い感じのポジション
        // 枠線を消す
        // 全国レベルのズームボタン(option)
        window.mapView = mapView;
        window.layer = layer;
    });
};

// ---------- 読み込み完了時
const onDOMContentLoaded = () => {
    const app = new AppViewModel();
    const searcher = new Searcher(app.search.query);
    configureMap(searcher);
    window.searcher = searcher;

    ko.applyBindings(app);
};

if (document.readyState !== 'loading') {
    onDOMContentLoaded();
} else {
    document.addEventListener('DOMContentLoaded', onDOMContentLoaded);
}
