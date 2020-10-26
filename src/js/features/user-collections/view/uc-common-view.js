import { UserCollectionType } from '../controller/uc-common';

export default class UserCollectionCommonView {
    constructor($controller, template) {
        this.$backdrop = null;
        this.$wrapper = null;
        this.$list = null;
        this.controller = $controller;
        this.isOpen = false;
        this.isUpdateDisabled = false;
        this.template = template;
    }
    getTitle() {
        switch(this.controller.type) {
            case UserCollectionType.favorite:
                return OYO.labels.favorites;
            case UserCollectionType.history:
                return OYO.labels.history;
            case UserCollectionType.compare:
                return OYO.labels.compare;
        }
    }
    add({ idRecord, idCountry }) {
        this.controller.add({ idRecord, idCountry });
    }
    getListElement() {
        if(!this.$backdrop) this.createHtml();
        return this.$list;
    }
    createHtml() {
        let title = this.getTitle();
        let id = `uc-${this.controller.type}-backdrop`;
        let html = `
            <div class="uc-backdrop" id="${id}">
                <div class="uc-wrapper">
                    <div class="uc-header">
                        ${title}
                        <div class="uc-close">
                            <i class="icon-close"></i>
                        </div>    
                    </div>
                    <div class="uc-list">
                        
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
                data.forEach(item => {
                    list.push(this.template(item));
                });
                fxOnDone(list.join(''));
            }
            else {
                fxOnDone(`<div class='uc-info'>${OYO.labels.emptyList}</div>`);
            }
        });
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
            $(document).trigger('uc-new-items', [this.$backdrop]);
            fxOnDone();
        });
    }
    open() {
        if(! this.isOpen) {
            this.addContentToModal();
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
    onReady() {
        const $trigger = $(`._js-uc-${this.controller.type}-list-trigger`);
        $trigger.click(() => {
            this.open();
        });
        setInterval(() => {
            if(! this.isUpdateDisabled) {
                let storageContent = this.controller.getStorageContent();
                let cars = this.controller.cache.cars;
                if(cars !== null) {
                    if(cars.map(item => item.record).join('') != storageContent.map(item => item.idRecord).join('')) {
                        this.controller.clearCache();
                        this.isUpdateDisabled = true;
                        this.addContentToModal(() => {
                            this.isUpdateDisabled = false;
                        });
                    }
                }
                let count = storageContent.length;
                $trigger.find('span').text(count);
            }
        }, 1000);
    }
    onTriggerClick($trigger, idRecord) {
        const storageContent = this.controller.getStorageContent();
        if(this.controller.isActive(storageContent, idRecord)) {
            this.controller.remove(idRecord);
            $trigger.removeClass('active');
        } 
        else {
            let flag = this.controller.add({ idRecord, idCountry: OYO.appParams.idCountry });
            if(flag) $trigger.addClass('active');
            else {
                this.showLimitMsg();
            }
        }   
    }
    isActive(idRecord) {
        const storageContent = this.controller.getStorageContent();
        return this.controller.isActive(storageContent, idRecord);
    }
    showLimitMsg() {}
}