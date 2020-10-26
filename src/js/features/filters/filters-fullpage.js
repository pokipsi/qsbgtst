import { Stat } from '../stat';

import { setParam } from './filter-set-param';

export default class FiltersFullpage {
    constructor({ selector = "#fpd-filters-trigger" } = {}) {
        this.$selector = $(selector);
        this.html = `
            <div class="fullpage-dialog" id="fpd-filters">
                <div class="fpd-header">
                    <div class="title">${OYO.labels.filter}</div>
                    <div class="ml-auto d-flex">
                        <div class="fpd-main-reset">
                            <i class="icon-reload"></i>
                        </div>
                        <div class="fpd-main-close ml-32">
                            <i class="icon-close"></i>
                        </div>
                    </div>
                </div>
                <div class="fpd-content"></div>
            </div>
        `;
    }
    get(name, fxOnData = () => {}) {
        let params = OYO.utils.getParams();
        const endpoint = this.api(name, params);
        fetch(endpoint).then(data => data.json()).then(data => {
            fxOnData(data);
        })
    }
    api(name, params) {
        return `/ooyyo-services/resources/resultpage/filters/${name}?json=${ encodeURIComponent(JSON.stringify(params)) }`;
    }
    init() {
        this.addWrapper();
        this.$selector.click(e => {
            this.open();
        });
        $("#fpd-filters .fpd-main-close").click(e => {
            this.close();
        });
        let order = OYO.filtersData.dataOrder.split("_");
        
        let liItems = [];
        order.forEach(name => {
            if (OYO.filtersData.labels[name]) {
                liItems.push(`<li data-type='${name}' data-level='1'>${OYO.filtersData.labels[name]}</li>`);
            }
        });
        let clouds = $(".clouds").length > 0 ? `<div class="clouds">${$(".clouds").clone().html()}</div>` : '';
        let filterSelection = `
            ${clouds}
            <ul>${liItems.join('')}</ul>`;
        $("#fpd-filters .fpd-content").html(filterSelection);
        this.assignEventHandlers();
    }
    assignEventHandlers() {
        $(".clouds a").click(() => {
            OYO.utils.showFullPagePreloader();
        });
        $("#fpd-filters .fpd-content ul li").click(e => {
            const name = $(e.currentTarget).data('type');
            let html = `
                <div class="fpd-backdrop">
                    <div class="inner fullpage-dialog">
                        <div class="fpd-header">
                            <div class="title">${OYO.filtersData.labels[name]}</div>
                            <div class="ml-auto d-flex">
                                <div class="fpd-inner-close">
                                    <i class="icon-close"></i>
                                </div>
                            </div>
                        </div>
                        <div class="fpd-content" id="fpd-${name}">
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
                        </div>
                    </div>
                </div>
            `;
            $("#fpd-filters").append(html);
            $(".fpd-inner-close").click(() => {
                $(".fpd-backdrop").remove();
            });
            this.get(name, data => {
                let liItems = [];
                data.forEach(item => {
                    liItems.push(`<li data-id="${item.id}" data-range="${item.range}" data-type="${name}">${item.name}</li>`);
                });
                $(`#fpd-${name}`).html(`<ul>${liItems.join('')}</ul>`);
                $(`#fpd-${name} ul li`).click(e => {
                    Stat.countFilterClicks(name);
                    const range = $(e.currentTarget).data('range');
                    const id = $(e.currentTarget).data('id');
                    let value = range ? range : id;
                    $(document).trigger("qs-search-initial-param-map", [
                        paramMap => {
                            OYO.utils.showFullPagePreloader();
                            const params = setParam({name, value, paramMap});
                            $(document).trigger("qs-search", [params, data => {
                                OYO.utils.gotoPage({ url: data.url });
                            }]);
                        }
                    ]);
                });
            });

            $(".fpd-backdrop").click(e => {
                $(".fpd-backdrop").remove();
            });
            $(".fpd-backdrop .inner.fullpage-dialog").click(e => {
                e.stopPropagation();
            });
            $("#fpd-filters .fpd-main-reset").click(() => {
                OYO.utils.showFullPagePreloader();
                const params = {
                    idCountry: OYO.appParams.idCountry,
                    idLanguage: OYO.appParams.idLanguage,
                    idCurrency: OYO.appParams.idCurrency,
                    idDomain: OYO.appParams.idDomain,
                    isNew: OYO.appParams.isNew,
                    qsType: "advanced"
                }
                $(document).trigger("qs-search", [params, data => {
                    OYO.utils.gotoPage({ url: data.url });
                }]);
            });
        });
    }
    addWrapper() {
        $("body").append(this.html);
    }
    open() {
        $("#fpd-filters").addClass('active');
    }
    close() {
        $("#fpd-filters").removeClass('active');
    }
}