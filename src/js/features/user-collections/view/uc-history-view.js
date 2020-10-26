import UserCollectionHistory from '../controller/uc-history';
import UserCollectionCommonView from './uc-common-view';
import template from './templates/horizontal';

export default class UserCollectionHistoryView extends UserCollectionCommonView {
    constructor() {
        const controller = new UserCollectionHistory({
            limit: 5
        });
        super(controller, template);
    }
}