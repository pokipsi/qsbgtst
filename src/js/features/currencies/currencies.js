window.cache = window.cache || {};
export default class Currencies {
    get(fxOnResponse) {
        if (window.cache.currencies && fxOnResponse) {
            fxOnResponse(window.cache.currencies);
        } else {
            const params = OYO.utils.getParams();
            const endpoint = this.endpoint(params);
            fetch(endpoint).then(data => data.json()).then(data => {
                window.cache.currencies = data;
                $(document).trigger("currencies-loaded", window.cache.currencies);
                if (fxOnResponse) {
                    fxOnResponse(data);
                }
            });
        }
    }
    api() {
        return '/ooyyo-services/resources/common/currenciesweb';
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params))
    }
}