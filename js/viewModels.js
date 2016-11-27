class SearchViewModel {
    constructor() {
        this.selectedHobby = ko.observable();
        this.query = ko.pureComputed(() => this.selectedHobby());
    }

    onSearch() {
        return false;
    }
}

class AppViewModel {
    constructor() {
        this.search = new SearchViewModel();
    }
}
