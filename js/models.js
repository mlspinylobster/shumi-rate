const baseUrl = 'https://shumi-rate-api.herokuapp.com/';
urls = {
    prefectures: `${baseUrl}hobbies/<HOBBY>/prefectures`,
    prefectureDetail: `${baseUrl}hobbies/<HOBBY>/prefectures/<PREF>`,
    cities: `${baseUrl}hobbies/1/cities`
};

class Searcher {
    constructor(queryObservable) {
        this.query = queryObservable;
        this.getPrefScores = ko.observable(Promise.resolve());
        this.setWhenQueryChanged();
    }

    getAllCities() {
      return this.fetchUrl(urls.cities);
    }

    setWhenQueryChanged() {
        this.query.subscribe(query => {
            this.getPrefScores(this.getPrefectures());
        });
    }

    fetchUrl(url) {
        return fetch(url, { mode: 'cors' })
            .then(data => data.json());
    }
    getPrefectures() {
        const url = urls.prefectures.replace('<HOBBY>', this.query());
        return this.fetchUrl(url);
    }
}

class Map {
    constructor() {
        const geojsonUrl = './json/geojson_japan.json';
        this.getGeoJson = fetch(geojsonUrl)
          .then(data => data.json());
    }
}
