import { StringBuilder } from '../utils/string-builder.js';

export class CountryConnector {
    constructor() {
        this.cache = null;
        this.serviceUrl = {
            index: '/ooyyo-services/resources/indexpage/countryweburls',
            result: '/ooyyo-services/resources/resultpage/countryweburls',
            info: '/ooyyo-services/resources/indexpage/countryweburls',
            widget: '/ooyyo-services/resources/indexpage/countryweburls'
        };
    }

    getCountries(page, callback) {
        let self = this;
        let params = OYO.utils.getParams({
            type: 'countries'
        });
        if (this.cache) {
            if (callback) {
                callback(this.cache);
            }
        } else {
            $.getJSONData(this.serviceUrl[page], params, function (data) {

                let countries = [];
                Object.keys(data).forEach(key => {
                    countries.push({
                        idCountry: key,
                        ...data[key]
                    })
                });

                let sorted = countries.sort((a, b) => {
                    return a.title.toUpperCase() > b.title.toUpperCase() ? 1 : -1;
                })
                
                self.cache = sorted;
                if (callback) {
                    callback(sorted);
                }
            });
        }
    }

    getCountriesOld(page, callback) {
        let self = this;
        let params = OYO.utils.getParams({
            type: 'countries'
        });
        if (this.cache) {
            if (callback) {
                callback(this.cache);
            }
        } else {
            $.getJSONData(this.serviceUrl[page], params, function (data) {
                self.cache = data;
                if (callback) {
                    callback(data);
                }
            });
        }
    }
    createCountryHTML(options) {
        var selector = options.selector;
        var list_position = 'left';
        if (options && options.list_position) {
            list_position = options.list_position;
        }
        var countryHTML = "<div class='country-list " + list_position + " list _js-mouse-timeout-target'>\n\
                                <ul class='col-sm-3'>#lis1#</ul>\n\
                                <ul class='col-sm-3'>#lis2#</ul>\n\
                                <ul class='col-sm-3'>#lis3#</ul>\n\
                                <ul class='col-sm-3'>#lis4#</ul>\n\
                                <h2 class='info'>" + OYO.labels.carAdsAll + "</h2>\n\
                            </div>";
        var imgFlag = "<img src='" + OYO.images.EMPTY + "' alt='flag' class='flag f#idCountry#'/>";

        this.getCountries(options.page, function (data) {
            var li = "<li><a href='#url#'>"
                    + imgFlag + "<span class='count'>#count#</span>#title#</a></li>";
            var count = OYO.utils.getCount(data);
            var x = (count - 1) / 4 + 1;
            x = x - x % 1;
            var temp = 0;
            var i = 0;
            var inverted = OYO.utils.invertJSON(data, {inner: "title"});
            var sorted = OYO.utils.sortJSON(inverted, {datatype: "string"});
            var size = 0;
            $.each(sorted, function (key, value) {
                size += 1;
                if (temp >= 0 && temp < x) {
                    i = 1;
                }
                if (temp >= x && temp < 2 * x) {
                    i = 2;
                }
                if (temp >= 2 * x && temp < 3 * x) {
                    i = 3;
                }
                if (temp >= 3 * x && temp < 4 * x) {
                    i = 4;
                }
                var _key = inverted[value];
                var _value = data[_key];
                var _li = li.replace("#url#", _value.url)
                        .replace("#idCountry#", _key)
                        .replace("#title#", _value.title)
                        .replace("#count#", _value.displayCount);

                countryHTML = countryHTML.replace("#lis" + i + "#", _li + "#lis" + i + "#");
                temp += 1;
            });
            selector.prepend(imgFlag.replace("#idCountry#", OYO.appParams.idCountry))
                    .append(data[OYO.appParams.idCountry].title)
                    .append('<span class="caret"></span>');
            countryHTML = countryHTML.replace("#lis1#", "")
                    .replace("#lis2#", "")
                    .replace("#lis3#", "")
                    .replace("#lis4#", "")
                    .replace("{NUM}", size);
            selector.after(countryHTML);
            var country_list = selector.next('.list');
            country_list.css({
                top: (selector.outerHeight() + selector.position().top)
            });
            selector.click(function (e) {
                country_list.toggle();
                e.stopPropagation();
            });
            try {
                selector.addMouseTimeout({content: country_list});
            } catch (ex) {

            }
            if (options && options.callback) {
                options.callback();
            }
        });
    }
    createCountrySimpleHTML(options) {
        var selector = options.selector;
        var country = OYO.appParams.idCountry;
        var html = new StringBuilder();
        this.getCountries(options.page, function (data) {
            var inverted = OYO.utils.invertJSON(data, {inner: "title"});
            var sortedByTitle = OYO.utils.sortJSON(inverted, {datatype: "string"});
            $.each(sortedByTitle, function (index, value) {
                var selected = country.toString() === inverted[value].toString() ? "selected" : "";
                var count = "";
                if (options && options.show_count) {
                    count = " (" + data[inverted[value]].displayCount + ")"
                }
                html.append("<option value='" + data[inverted[value]].url + "' " + selected + ">"
                        + data[inverted[value]].title + count + "</option>");
            });

            //android promo more countries
            html.append("<option style='font-weight: bold; text-transform: uppercase' value='" + OYO.URLs.androidCountries + "'>" + OYO.labels.moreCountries + "</option>");

            selector.html(html.toString());
            if (options && options.display_only) {

            } else {
                selector.change(function () {
                    OYO.utils.lockScreen();
                    OYO.utils.gotoPage({url: $(this).val(), encoded: false});
                });
            }
        });
    }
    init() {
        let self = this;
        $.fn.initCountryList = function (options) {
            var type = $(this).data('type') || 'type1',
                display_only = $(this).data('display_only'),
                show_count = $(this).data('show_count'),
                list_position = $(this).data('list-position') || 'left';
            if (options && options.type) {
                type = options.type;
            }
            var params = {};
            params.page = options.page;
            params.selector = $(this);
            params.list_position = list_position;
            if (display_only) {
                params.display_only = true;
            }
            if (show_count) {
                params.show_count = true;
            }
            switch (type) {
                case 'type1':{
                    self.createCountryHTML(params);
                    break;
                }
                case 'type2':{
                    self.createCountrySimpleHTML(params);
                    break;
                }
            }
        };
    }
}
