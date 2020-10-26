import Alert from '../../custom-user-messaging-and-input/alert';
import UserCollectionFavorites from '../controller/uc-favorites';
import UserCollectionCommonView from './uc-common-view';
import template from './templates/horizontal';

export default class UserCollectionFavoritesView extends UserCollectionCommonView {
    constructor() {
        const controller = new UserCollectionFavorites({
            limit: 5
        });
        super(controller, template);
    }
    showLimitMsg() {
        new Alert(OYO.labels.favoritesFull).show();
    }
}