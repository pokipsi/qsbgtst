import UserCollectionCommon from "./uc-common";
import { UserCollectionType } from './uc-common';

export default class UserCollectionHistory extends UserCollectionCommon {
    constructor({ limit }) {
        super({ type: UserCollectionType.history, limit });
    }
    add({ idRecord, idCountry }) {
        let cookieName = OYO.cookieNames[this.type];
        let item = this.createItemForStorage({ idRecord, idCountry });
        let storageContent = this.removeItemFromStorageContentByRecord(idRecord);
        if (storageContent.length === this.limit) {
            storageContent.pop();
        }
        storageContent.unshift(item);
        OYO.utils.storage.set(cookieName, storageContent);
        this.notify();
        return true;
    }
}