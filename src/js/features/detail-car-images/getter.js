export default class ImagesGetter {
    constructor({ limit = 80 } = {}) {
        this.limit = limit;
    }
    get() {
        let params = {
            idRecord: OYO.appParams.idRecord.toString(),
            idCountry: OYO.appParams.idCountry.toString(),
            start: "0",
            limit: String(this.limit)
        };
        if(OYO.appParams.idSite.toString() !== ""){
            params.idSite = OYO.appParams.idSite.toString();
        }
        return fetch(this.endpoint(params)).then(data => data.json());
    }
    api() {
        return '/ooyyo-services/resources/carimages/smallimages';
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params))
    }
}