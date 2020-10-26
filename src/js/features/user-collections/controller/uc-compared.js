import UserCollectionCommon from "./uc-common";
import { UserCollectionType } from './uc-common';

export default class UserCollectionCompared extends UserCollectionCommon {
    constructor({ limit }) {
        super({ type: UserCollectionType.compare, limit });
    }
}