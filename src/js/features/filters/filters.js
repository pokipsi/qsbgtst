import { Stat } from '../stat';

import { setParam } from './filter-set-param';

export default class Filters {
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
        let order = OYO.filtersData.dataOrder.split("_");
        order.forEach(name => {
            if (name && OYO.filtersData.labels[name]) {
                this.get(name, data => {
                    if (data) {
                        this.addToPage(name, data);
                    }
                });
            }
        });
    };
    addToPage(name, data) {
        let html = [];
        let htmlItems = [];
        if (data) {
            var isEmpty = 0;
            data.forEach(item => {
                isEmpty += 1;
                htmlItems.push(`
                    <li>
                        <a href='javascript:void(0)' data-id='${item.id}' data-type='${name}' data-range='${item.range}'>
                            ${item.name}
                            <span class='filter-count'>(${item.count})</span>
                        </a>
                    </li>`
                );
            });
            html.push(`<ul>${htmlItems.join('')}</ul><span class='view-more'>...</span>`);
            if (!isEmpty) $(`h3._${name}`).parent().hide();
        }

        //hybrid addon
        if ($(`#filter_${name} ul`).length > 0) {
            this.activateFilters(name);
        } else {
            $(`#filter_${name} img`).fadeOut(() => {
                $(`#filter_${name}`).append(html.join(''));
                this.activateFilters(name);
            });
        }

    };

    activateFilters(name) {
        $(`.filters h3._${name}`).addClass("active");
        $(`.filters h3._${name}`).next().show();
        const ul = $(`.filters h3._${name}`).next("div").find("ul");
        ul.parent().find(".view-more").remove();
        this.assignEventHandlers(name);
    };

    onFilterSelected(el) {
        var name = el.data('type');
        if(!name) {
            name = el.closest(".filter-wrapper").data('name');
            if (name){
                Stat.countFilterClicks(name);
            }
        } else {
            Stat.countFilterClicks(name);
            const range = el.data('range');
            const id = el.data('id');
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
        }
    };

    assignEventHandlers(name) {
        if (name) {
            $(`.filters h3._${name}`).click(e => {
                $(e.currentTarget).toggleClass("active");
                $(e.currentTarget).next().slideToggle();
            });
            $(`#filter_${name} > ul > li > a`).click(e => {
                this.onFilterSelected($(e.currentTarget));
            });
        }
    };
}