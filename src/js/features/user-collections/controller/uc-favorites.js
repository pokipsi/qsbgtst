import UserCollectionCommon from "./uc-common";
import { UserCollectionType } from './uc-common';

export default class UserCollectionFavorites extends UserCollectionCommon {
    constructor({ limit }) {
        super({ type: UserCollectionType.favorite, limit });
    }
}