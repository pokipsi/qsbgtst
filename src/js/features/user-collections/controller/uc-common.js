export const UserCollectionType = {
    favorite: 'favorite',
    history: 'history',
    compare: 'compare'
}

export default class UserCollectionCommon {
    
    constructor({ type, limit }) {
        this.type = type; //UserCollectionType
        this.cache = {
            cars: null
        };
        this.limit = limit;
    }

    //get cars
    get() {
        return this.cache.cars === null ? 
            this.resolve() : 
            new Promise((resolve, reject) => {
                resolve(this.cache.cars);
            }
        );
    }

    clearCache() {
        this.cache.cars = null;
    }

    //call service to get cars by ids used in UC.. update data -> remove expired ads
    resolve() {
        const params = { page_params: OYO.utils.getParams() };
        let storageContent = this.getStorageContent();
        params.cookie_params = storageContent;
        return this.fetch(params).then(data => {
            this.cache.cars = data.cars === null ? [] 
                : storageContent.map(item => {
                    return data.cars[item.idRecord]
                });

            const cookieName = OYO.cookieNames[this.type];
            const items = storageContent.filter(item => data.cars[item.idRecord]);

            OYO.utils.storage.set(cookieName, items);
            return new Promise((resolve, reject) => {
                resolve(this.cache.cars);
            });
        });
    }

    fetch(params) {
        const endpoint = '/ooyyo-services/resources/cars/feature?json=' + encodeURIComponent(JSON.stringify(params));
        return fetch(endpoint).then(data => data.json()).then(data => {
            return new Promise((resolve, reject) => {
                resolve(data);
            });
        })
    }

    createItemForStorage({ idRecord, idCountry, dateCreated }) {
        return {
            idRecord: String(idRecord),
            idCountry: String(idCountry),
            isNew: "0",
            dateCreated: String(dateCreated || Date.now())
        }
    }

    removeItemFromStorageContentByRecord(idRecord) {
        let storageContent = this.getStorageContent().filter(item => item.idRecord != idRecord);
        return storageContent;
    }

    add({ idRecord, idCountry }) {
        let storageContent = this.getStorageContent();

        if(storageContent.length != this.limit) {
            let cookieName = OYO.cookieNames[this.type];
            let item = this.createItemForStorage({ idRecord, idCountry });
            storageContent = this.removeItemFromStorageContentByRecord(idRecord);
            storageContent.unshift(item);
            OYO.utils.storage.set(cookieName, storageContent);
            this.notify();
            return true;
        }
        return false;

    }

    remove(idRecord) {
        let cookieName = OYO.cookieNames[this.type];
        let storageContent = this.removeItemFromStorageContentByRecord(idRecord);
        OYO.utils.storage.set(cookieName, storageContent);
        this.notify();
    }

    notify() {
        $(document).trigger(this.eventName());
    }

    eventName() {
        return `uc-${this.type}-updated`;
    }

    getStorageContent() {
        let cookieName = OYO.cookieNames[this.type];
        return OYO.utils.storage.getJSON(cookieName) || [];
    }

    isActive(storageContent, idRecord) {
        return storageContent.filter(item => item.idRecord == idRecord).length > 0;
    }

}