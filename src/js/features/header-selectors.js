import Languages from './languages/languages';
import Currencies from './currencies/currencies';

export default class HeaderSelectors {
    
    constructor({ page }) {
        //dom
        this.$languages;
        this.$currencies;

        this.$simpleLanguages;
        this.$simpleCurrencies;

        //data
        this.languages = new Languages({page: page});
        this.currencies = new Currencies();
    }

    onReady() {
        this.$languages = $('._js-languages');
        this.$currencies = $('._js-currencies');
        this.$simpleLanguages = $('._js-simple-languages');
        this.$simpleCurrencies = $('._js-simple-currencies');
        this.renderLanguages();
        this.renderCurrencies();
    }    

    prepareSelector($selector, aHtml, prepend = "") {
        let html = `
            ${prepend}
            <a href="#">${aHtml}<i class="icon-cheveron-down ml-4"></i></a>
            <div class="list"></div>
        `;
        $selector.html(html);
    }

    renderLanguages() {
        this.languages.get(data => {
            let html = data.map(item => {
                const countryId = this.languages.countryByLang(item.id);
                return `<a class="item" href="${item.url}"><span class="flag-round flag-round-${countryId}"></span>${item.title}</a>`;
            });
            const selected = data.filter(item => item.id == OYO.appParams.idLanguage)[0];
            this.prepareSelector(this.$languages, selected.title, `<i class='flag-round flag-round-${this.languages.countryByLang(selected.id)} mr-4'></i>`);
            this.$languages.find(".list").html(html.join(''));
            this.addListListeners('languages');

            this.renderSimpleLanguages(data, selected);
        });
    }

    renderCurrencies() {
        this.currencies.get(data => {
            const fxMap = item => {
                return `
                    <div class="item flex-column align-items-start" data-id="${item.idCurrency}">
                        <div class='primary'>${item.iso}</div>
                        <div class='secondary'>${item.description}</div>
                    </div>
                `;
            };
            const all = [...data.all, ...data.popular].sort((a, b) => {
                if (a.iso.toLowerCase() < b.iso.toLowerCase()) {
                    return -1;
                }
                if (a.iso.toLowerCase() > b.iso.toLowerCase()) {
                    return 1;
                }
                return 0;
            });
            const selected = all.filter(item => item.idCurrency == OYO.appParams.idCurrency)[0];
            this.prepareSelector(this.$currencies, selected.iso);
            let htmlPop = data.popular.map(item => fxMap(item));
            let htmlAll = data.all.map(item => fxMap(item));
            let html = [...htmlPop, '<hr class="w-p100 mt-4 mb-4">', ...htmlAll];
            this.$currencies.find(".list").html(html.join(''));
            this.addListListeners('currencies');

            this.renderSimpleCurrencies(all, selected);
        });
    }

    renderSimpleLanguages(items, selected) {
        let html = `
            <select class='form-control'>
                ${items.map(item => {
                    return `<option value='${item.url}' ${item.id == selected.id ? 'selected' : ''}>${item.title}</option>`
                }).join('')}
            <select>
        `;
        this.$simpleLanguages.html(html);
        this.$simpleLanguages.find('select').change(e => {
            this.lock();
            window.location.href = e.currentTarget.value;
        });
    }

    renderSimpleCurrencies(items, selected) {
        let html = `
            <select class='form-control'>
                ${items.map(item => {
                    return `<option value='${item.idCurrency}' ${item.idCurrency == selected.idCurrency ? 'selected' : ''}>${item.iso} (${item.description})</option>`
                }).join('')}
            <select>
        `;
        this.$simpleCurrencies.html(html);
        this.$simpleCurrencies.find('select').change(e => {
            this.lock();
            const id = e.currentTarget.value;
            OYO.utils.setCurrency(id);
            window.location.reload();
        });
    }

    lock() {
        $("body").append(`
            <div class="loader-wrapper">
                <div class="lds-roller">
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
    }

    addListListeners(type) {
        if(type == 'languages') {
            this.$languages.find('a').on('mouseenter', e => {
                const $list = this.$currencies.find('.list');
                $list.css('display', 'none');
                setTimeout(() => {
                    $list.css('display', 'flex');
                }, 10);
            });
            this.$languages.find('.list .item').on('click', e => {
                this.lock();
            });    
        }
        if(type == 'currencies') {
            this.$currencies.find('a').on('mouseenter', e => {
                const $list = this.$languages.find('.list');
                $list.css('display', 'none');
                setTimeout(() => {
                    $list.css('display', 'flex');
                }, 10);
            });
            this.$currencies.find('.list .item').on('click', e => {
                this.lock();
                const id = $(e.currentTarget).data('id');
                OYO.utils.setCurrency(id);
                window.location.reload();
            });
        }
    }

}