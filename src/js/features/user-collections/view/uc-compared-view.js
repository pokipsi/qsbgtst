import Alert from '../../custom-user-messaging-and-input/alert';
import UserCollectionCompared from '../controller/uc-compared';
import UserCollectionCommonView from './uc-common-view';
import template from './templates/vertical';
import verticalHeader from './templates/vertical-header';

export default class UserCollectionComparedView extends UserCollectionCommonView {
    constructor() {
        const controller = new UserCollectionCompared({
            limit: 5
        });
        super(controller, template);
    }
    createHtml() {
        let title = this.getTitle();
        let id = `uc-${this.controller.type}-backdrop`;
        let html = `
            <div class="uc-backdrop" id="${id}">
                <div class="lg uc-wrapper">
                    <div class="uc-header">
                        ${title}
                        <div class="uc-close">
                            <i class="icon-close"></i>
                        </div>    
                    </div>
                    <div class="uc-list d-flex justify-content-lg-center">
                        
                    </div>
                </div>
            </div>`;
        $("body").append(html);
        this.$backdrop = $(`#${id}`);
        this.$backdrop.click(() => {
            this.close();
        });
        this.$wrapper = this.$backdrop.find(".uc-wrapper");
        this.$list = this.$wrapper.find(".uc-list");
        this.$wrapper.click(e => {
            e.stopPropagation();
        });
        this.$wrapper.find(".uc-close").click(() => {
            this.close();
        });
    }
    getList(fxOnDone = () => {}) {
        this.controller.get().then(data => {
            if(data.length) {
                let list = [];
                list.push(this.getLabelsHtml());
                data.forEach(item => {
                    list.push(this.template(item));
                });
                for(let i=data.length; i<this.controller.limit; i++) {
                    list.push(this.getPlaceholder(i+1));
                }
                fxOnDone(list.join(''));
                this.addHoverEffect();
                this.markBest(data);
            }
            else {
                fxOnDone(`<div class='uc-info'>${OYO.labels.emptyList}</div>`);
            }
        });
    }
    getLabelsHtml() {
        return verticalHeader;
    }
    getPlaceholder(num) {
        return `<div class="car-card-2"><div class="placeholder"><div>${num}</div></div></div>`;
    }
    addHoverEffect() {
        let $list = this.$wrapper.find('.uc-list');
        $list.find('.beta>div').on('mouseenter', function() {
            const row = $(this).data('row');
            $list.find(`.${row}`).addClass('active');
        });
        $list.find('.beta>div').on('mouseleave', function() {
            const row = $(this).data('row');
            $list.find(`.${row}`).removeClass('active');
        });
    }
    markBest(data) {
        let best = this.getBest(data);
        best.price.forEach(item => {
            $(`._js-compare-item-${item} ._price`).addClass('uc-best');
        });
        best.year.forEach(item => {
            $(`._js-compare-item-${item} ._year`).addClass('uc-best');
        });
        best.mileage.forEach(item => {
            $(`._js-compare-item-${item} ._mileage`).addClass('uc-best');
        });
        best.save.forEach(item => {
            $(`._js-compare-item-${item} ._save`).addClass('uc-best');
        });
    }
    getBest(data) {
        let byYear = this.getBestYear(data);
        let byMileage = this.getBestMileage(data);
        let bySave = this.getBestSave(data);
        let byPrice = this.getBestPrice(data);
        return {
            year: byYear,
            mileage: byMileage,
            save: bySave,
            price: byPrice
        }
    }
    getBestYear(data) {
        if(data.length > 0) {
            let current = 0;
            let best = [];
            data.forEach(item => {
                if(item.year > current) {
                    best = [ item.record ];
                    current = item.year;
                }
                else if (item.year == current) {
                    best.push(item.record);
                }
            });
            return best;
        }
        return [];
    }
    getBestPrice(data) {
        if(data.length > 0) {
            let current = Number.MAX_SAFE_INTEGER;
            let best = [];
            data.forEach(item => {
                if(item.price < current) {
                    best = [ item.record ];
                    current = item.price;
                }
                else if (item.price == current) {
                    best.push(item.record);
                }
            });
            return best;
        }
        return [];
    }
    getBestMileage(data) {
        if(data.length > 0) {
            let current = Number.MAX_SAFE_INTEGER;
            let best = [];
            data.forEach(item => {
                if(item.mileage && item.mileage != -1) {
                    if(item.mileage < current) {
                        best = [ item.record ];
                        current = item.mileage;
                    }
                    else if (item.mileage == current) {
                        best.push(item.record);
                    }
                }
            });
            return best;
        }
        return [];
    }
    getBestSave(data) {
        if(data.length > 0) {
            let current = 0;
            let best = [];
            data.forEach(item => {
                if(item.savePercentFloat && item.savePercentFloat != -1) {
                    if(item.savePercentFloat > current) {
                        best = [ item.record ];
                        current = item.savePercentFloat;
                    }
                    else if (item.savePercentFloat == current) {
                        best.push(item.record);
                    }
                }
            });
            return best;
        }
        return [];
    }
    showLimitMsg() {
        new Alert(OYO.labels.compareFull).show();
    }
}