import Prompt from '../custom-user-messaging-and-input/prompt';
import Toast from '../custom-user-messaging-and-input/toast';
import Confirm from '../custom-user-messaging-and-input/confirm';

export default class SaveSearch {
    
    constructor({ $listTrigger, $btnSave, qs, fxOnParamsLoaded = () => {} }) {
        this.qs = qs;
        this.data = {};
        this.paramMap = null;
        this.$listTrigger = $listTrigger;
        this.$btnSave = $btnSave;
        this.init();
        this.$listTrigger.click(() => {
            this.open();
        });
        this.$btnSave.click(() => {
            this.saveSearch(this.paramMap, qs.cached);
        });
        this.$backdrop = null;
        this.$wrapper = null;
        this.$list = null;
        this.isOpen = false;
        this.onParamsLoaded = fxOnParamsLoaded;
    }
    
    getListElement() {
        if(!this.$backdrop) this.createHtml();
        return this.$list;
    }
    createHtml() {
        let title = OYO.labels.savedSearches;
        let id = `ss-backdrop`;
        let html = `
            <div class="ss-backdrop" id="${id}">
                <div class="ss-wrapper">
                    <div class="ss-header">
                        ${title}
                        <div class="ss-close">
                            <i class="icon-close"></i>
                        </div>    
                    </div>
                    <div class="ss-list">
                        
                    </div>
                </div>
            </div>`;
        $("body").append(html);
        this.$backdrop = $(`#${id}`);
        this.$backdrop.click(() => {
            this.close();
        });
        this.$wrapper = this.$backdrop.find(".ss-wrapper");
        this.$list = this.$wrapper.find(".ss-list");
        this.$wrapper.click(e => {
            e.stopPropagation();
        });
        this.$wrapper.find(".ss-close").click(() => {
            this.close();
        });
    }
    getList(fxOnDone = () => {}) {
        
        if(Object.keys(this.data).length) {
            let list = [];
            Object.keys(this.data).forEach(( key, index ) => {
                list.push(`<div data-params="${key}">${index+1}. ${this.data[key]} <span><i class="icon-trash"></i></span></div>`);
            });
            fxOnDone(list.join(''));
        }
        else {
            fxOnDone(`<div class='ss-info'>${OYO.labels.emptyList}</div>`);
        }
        
    }
    addContentToModal(fxOnDone = () => {}) {
        this.getListElement().html(`
            <div class="p-32 d-flex justify-content-center">
                <div class="lds-roller grey">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        `);
        this.getList(html => {
            this.getListElement().html(html);
            fxOnDone();
        });
    }
    open() {
        if(! this.isOpen) {
            this.addContentToModal(() => {
                this.assignItemEventListeners();
            });
            this.$backdrop.addClass('active');
            this.isOpen = true;
            OYO.utils.hidePageScrollbar();
        }
    }
    close() {
        if(this.isOpen) {
            this.$backdrop.removeClass('active');
            this.isOpen = false;
            OYO.utils.showPageScrollbar();
        }
    }
    assignItemEventListeners() {
        this.$list.find(">div").click(e => {
            this.onParamsLoaded($(e.currentTarget).data('params'));
            this.close();
        });
        this.$list.find(">div span").click(e => {
            e.stopPropagation();
            this.deleteSearch($(e.currentTarget).closest('div'));
        });
    }

    update(paramMap) {
        this.paramMap = paramMap;
        this.shouldSaveSearch(paramMap) ? this.$btnSave.removeAttr('disabled') : this.$btnSave.attr('disabled', true);
        Object.keys(this.data).length > 0 ? this.$listTrigger.removeAttr('disabled') : this.$listTrigger.attr('disabled', true);
    }

    getSavedSearchRelevantParams(paramMap) {
        
        let ret = {};

        const paramNames = [
            'idMake', 'idModel', 'idTrim', 
            'priceFrom', 'priceTo', 'yearFrom', 'yearTo', 'mileageFrom', 'mileageTo', 
            'idBodytype', 'idFueltype', 'zipCode', 'radius', 'idTransmission', 'idColor'
        ];

        paramNames.forEach(name => {
            paramMap[name] ? ret[name] = paramMap[name] : null;
        });

        return ret;
    
    }
    shouldSaveSearch(paramMap) {
        let params = this.getSavedSearchRelevantParams(paramMap);
        let keys = Object.keys(params).sort();
        let paramsStr = "";
        keys.forEach(k => {
            paramsStr += `${k}=${params[k]}&`;
        });
        if(keys.length > 0){
            let key = paramsStr;
            return !this.data[key];
        }else { 
            return false; 
        }
    }
    saveSearch(paramMap, qsData) {
        let params = this.getSavedSearchRelevantParams(paramMap);
        let keys = Object.keys(params).sort();
        let paramsStr = "";
        keys.forEach(k => {
            paramsStr += `${k}=${params[k]}&`;
        });
        let savedSearchesSize = Object.keys(this.data).length;
        if(savedSearchesSize < 10){
            if(keys.length > 0){
                let key = paramsStr;
                let label = this.getSearchLabel(params, qsData);
                new Prompt(OYO.labels.enterNameForThisSearch, {
                    onConfirm: value => {
                        if(value.trim() !== ""){
                            label = value;
                        }
                        this.data[key] = label;
                        OYO.utils.storage.set('saved-searches', this.data);    
                        this.showSearchSavedSuccessInfo();
                        this.update(paramMap);
                    },
                    defaultValue: label
                }).show();
            }
        }else{
            new Toast(OYO.labels.saveUpToLimitSearches.replace('{NUM}', 10)).show();
        }
    }
    deleteSearch($item) {
        new Confirm(OYO.labels.deleteThisSearch, {
            onConfirm: () => {
                let key = $item.data('params');
                delete this.data[key];
                OYO.utils.storage.set('saved-searches', this.data);
                $item.addClass('deleted');
                setTimeout(() => {
                    this.addContentToModal(() => {
                        this.assignItemEventListeners();
                    });
                }, 700);
            }
        }).show();
    }
    showSearchSavedSuccessInfo() {
        this.$listTrigger.find('.badge').remove();
        this.$listTrigger.append(`<span class="badge">+1</span>`);
        setTimeout(() => {
            this.$listTrigger.find('.badge').addClass('badge-fade-in');
            setTimeout(() => {
                this.$listTrigger.find('.badge').addClass('badge-move-up');
            }, 1500);
        }, 10);
    }
    getSearchLabel(params, qsData) {
        let ret = [];
        if (params.idMake) {
            let makes = qsData.makes.black;
            const filtered = makes.filter(item => item.idMake == params.idMake);
            filtered.length ? ret.push(filtered[0].name) : null;
        }
        if (params.idModel) {
            let models = qsData.models.black;
            const filtered = models.filter(item => item.idModel == params.idModel);
            filtered.length ? ret.push(` ${filtered[0].name}`) : null;
        }
        if (params.idTrim) {
            let trims = qsData.trims.black;
            const filtered = trims.filter(item => item.idTrim == params.idTrim);
            filtered.length ? ret.push(` ${filtered[0].name}`) : null;
        }
        if (params.idBodytype) {
            let bodytypes = qsData.bodytypes;
            const filtered = bodytypes.filter(item => item.idBodytype == params.idBodytype);
            filtered.length ? ret.push(` ${filtered[0].displayBodytype}`) : null;
        }
        if (params.idFueltype) {
            let fueltypes = qsData.fueltypes;
            const filtered = fueltypes.filter(item => item.idFueltype == params.idFueltype);
            filtered.length ? ret.push(` ${filtered[0].displayFueltype}`) : null;
        }

        if (params.idColor) {
            let colors = qsData.colors;
            const filtered = colors.filter(item => item.idColor == params.idColor);
            filtered.length ? ret.push(` ${filtered[0].displayName}`) : null;
        }

        if (params.idTransmission) {
            let transmissions = qsData.transmissions;
            const filtered = transmissions.filter(item => item.idTransmission == params.idTransmission);
            filtered.length ? ret.push(` ${filtered[0].displayName}`) : null;
        }
        
        if (params.zipCode) {
            ret.push(` | ${OYO.labels.zipcode} ${params.zipCode} ${params.radius}${this.qs.cached.lengthunit}`);
        }
        
        if (params.priceFrom || params.priceTo) {
            ret.push(` | ${OYO.labels.price}`);
            if (params.priceFrom) {
                ret.push(` ${OYO.labels.from}`);
                ret.push(` ${qsData.pricesFrom[params.priceFrom].displayPrice}`);
            }
            if (params.priceTo) {
                ret.push(` ${OYO.labels.to}`);
                ret.push(` ${qsData.pricesTo[params.priceTo].displayPrice}`);
            }
        }

        if (params.yearFrom || params.yearTo) {
            ret.push(` | ${OYO.labels.year}`);
            if (params.yearFrom) {
                ret.push(` ${OYO.labels.from}`);
                ret.push(` ${params.yearFrom}`);
            }
            if (params.yearTo) {
                ret.push(` ${OYO.labels.to}`);
                ret.push(` ${params.yearTo}`);
            }
        }
        
        if (params.mileageFrom || params.mileageTo) {
            ret.push(` | ${OYO.labels.mileageLong}`);
            if (params.mileageFrom) {
                ret.push(` ${OYO.labels.from}`);
                ret.push(` ${qsData.mileagesFrom[params.mileageFrom].displayMileage}`);
            }
            if (params.mileageTo) {
                ret.push(` ${OYO.labels.to}`);
                ret.push(` ${qsData.mileagesTo[params.mileageTo].displayMileage}`);
            }
        }
        let str = ret.join('');
        
        if(str.startsWith(" | ")){
            return str.slice(3);
        }else {
            return str.trim();
        }
    }
    init() {
        let data = OYO.utils.storage.getJSON('saved-searches');
        if(data){
            this.data = data;
        }else{
            this.data = {};
        }
    }
}