export default class Countries {
    constructor({ page }) {
        this.page = page;
        this.cache = null;
    }
    get(fxOnResponse) {
        if (this.cache && fxOnResponse) {
            fxOnResponse(this.cache);
        } else {
            const params = OYO.utils.getParams();
            delete params.zipCode;
            delete params.page;
            const endpoint = this.endpoint(params);
            fetch(endpoint).then(data => data.json()).then(data => {
                let formatted = this.format(data);
                let sorted = this.sort(formatted);
                this.cache = sorted;
                if (fxOnResponse) {
                    fxOnResponse(sorted);
                }
            });
        }
    }
    format(data) {
        return Object.keys(data).map(key => {
            return {
                id: key,
                title: data[key].title,
                url: data[key].url,
                displayCount: data[key].displayCount
            }
        });
    }
    sort(data) {
        return data.sort((a, b) => { 
            const aTitle = a.title.toUpperCase();
            const bTitle = b.title.toUpperCase();
            if (aTitle > bTitle) {
                return 1;
            }
            if (bTitle > aTitle) {
                return -1;
            }
            return 0;
        });
    }
    api() {
        const page = ['index', 'result', 'detail'].includes(this.page) ? this.page : 'index';
        return `/ooyyo-services/resources/${page}page/countryweburls`;
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params));
    }
}