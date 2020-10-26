import UserCollectionHistoryView from './view/uc-history-view';
import UserCollectionFavoritesView from './view/uc-favorites-view';
import UserCollectionComparedView from './view/uc-compared-view';

export default class UserCollectionsManager {
    constructor() {
        this.ucHistory = new UserCollectionHistoryView();
        this.ucFavorite = new UserCollectionFavoritesView();
        this.ucCompare = new UserCollectionComparedView();
        this.addEventListeners();
    }
    onReady() {
        this.ucHistory.onReady();
        this.ucFavorite.onReady();
        this.ucCompare.onReady();
    }
    addEventListeners() {
        //poziva se svaki put kad se dinamicki prave novi itemi (nisu postojali u dom-u u onReady trenutku, zato mora naknadno i za to je odgovoran kreator html kolekcije)
        //npr. outleti se dovlace na ajax i nisu inicijalno u domu, zato za svaki div koji dohvata outlete treba trigerovati ovaj event $(document).trigger('uc-new-items)
        $(document).on('uc-new-items', (e, $wrapper) => {

            const $favoriteTriggers = $wrapper.find('._js-uc-favorite-trigger').toArray();
            $favoriteTriggers.forEach(trigger => {
                const idRecord = $(trigger).data('record');
                this.ucFavorite.isActive(idRecord) ? $(trigger).addClass('active') : $(trigger).removeClass('active');
                $(trigger).on('click', e => {
                    this.ucFavorite.onTriggerClick($(trigger), idRecord);
                    return false;
                });
            });
            
            const $compareTriggers = $wrapper.find('._js-uc-compare-trigger').toArray();
            $compareTriggers.forEach(trigger => {
                const idRecord = $(trigger).data('record');
                this.ucCompare.isActive(idRecord) ? $(trigger).addClass('active') : $(trigger).removeClass('active');
                $(trigger).on('click', e => {
                    this.ucCompare.onTriggerClick($(trigger), idRecord);
                    return false;
                });
            });

        });
    }
}