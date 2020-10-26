import { StringBuilder } from '../utils/string-builder.js';

export class LanguageConnector {
    constructor() {
        this.cache = null;
        this.serviceUrl = {
            index: '/ooyyo-services/resources/indexpage/languageweburls',
            result: '/ooyyo-services/resources/resultpage/languageweburls',
            detail: '/ooyyo-services/resources/detailpage/languageweburls',
            info: '/ooyyo-services/resources/indexpage/languageweburls'
        };
    }
    getLanguages(page, callback) {
        var _self = this,
                params = OYO.utils.getParams();
        if (_self.cache) {
            if (callback) {
                callback(_self.cache);
                //console.log("Languages loaded from cache");
            }
        } else {
            $.getJSONData(this.serviceUrl[page], params, function (data) {
                _self.cache = data;
                if (callback) {
                    callback(data);
                }
                //console.log("Languages loaded from service");
            });
        }
    }
    createLanguageHTML(options) {
        var selector = options.selector;
        var list_position = 'left';
        if (options && options.list_position) {
            list_position = options.list_position;
        }
        var languageHTML = "<div class='language-list " + list_position + " list'>\n\
                                <ul class='col-sm-12 pop'>#lisPop#</ul>#divider#\n\
                                <ul class='col-sm-3'>#lis1#</ul>\n\
                                <ul class='col-sm-3'>#lis2#</ul>\n\
                                <ul class='col-sm-3'>#lis3#</ul>\n\
                                <ul class='col-sm-3'>#lis4#</ul>\n\
                            </div>";

        this.getLanguages(options.page, function (data) {

            var li = "<li><a href='#url#' class='_lckscrn'>#title#</a></li>";

            var deleteDivider = true;

            if (data.popular) {
                var pop_inverted = OYO.utils.invertJSON(data.popular, {inner: "title"});
                var pop_sorted = OYO.utils.sortJSON(pop_inverted, {datatype: "string"});
                $.each(pop_sorted, function (key, value) {
                    deleteDivider = false;
                    var _value = data.popular[pop_inverted[value]];
                    var _li = li.replace("#url#", _value.url)
                            .replace("#title#", _value.title);

                    languageHTML = languageHTML.replace("#lisPop#", _li + "#lisPop#");
                });
            }

            if (deleteDivider) {
                languageHTML = languageHTML.replace("#divider#", "");
            } else {
                languageHTML = languageHTML.replace("#divider#", "<ul class='col-sm-12'><hr></ul>");
            }

            var count = OYO.utils.getCount(data.all);
            var x = (count - 1) / 4 + 1;
            x = x - x % 1;
            var temp = 0;
            var i = 0;

            var all_inverted = OYO.utils.invertJSON(data.all, {inner: "title"});
            var all_sorted = OYO.utils.sortJSON(all_inverted, {datatype: "string"});

            $.each(all_sorted, function (key, value) {
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

                var _value = data.all[all_inverted[value]];
                var _li = li.replace("#url#", _value.url)
                        .replace("#title#", _value.title);

                languageHTML = languageHTML.replace("#lis" + i + "#", _li + "#lis" + i + "#");
                temp += 1;
            });

            selector.append(data.all[OYO.appParams.idLanguage].title).append('<span class="caret"></span>');

            languageHTML = languageHTML
                    .replace("#lisPop#", "")
                    .replace("#lis1#", "")
                    .replace("#lis2#", "")
                    .replace("#lis3#", "")
                    .replace("#lis4#", "");

            selector.after(languageHTML);

            var language_list = selector.next('.list');

            language_list.css({
                top: (selector.outerHeight() + selector.position().top)
            });

            selector.click(function (e) {
                language_list.toggle();
                e.stopPropagation();
            });

            try {
                selector.addMouseTimeout({content: language_list});
            } catch (ex) {

            }

            if (options && options.callback) {
                options.callback();
            }
        });
    }
    createLanguageSimpleHTML(options) {
        var selector = options.selector;
        var lang = OYO.appParams.idLanguage;
        var html = new StringBuilder();
        this.getLanguages(options.page, function (data) {
            var checked = false;
            if (data.popular) {
                $.each(data.popular, function (index, value) {
                    var selected = lang.toString() === index.toString() ? "selected" : "";
                    if (selected === 'selected')
                        checked = true;
                    html.append("<option value='" + value.url + "' " + selected + ">" + value.title + "</option>");
                });
                if (data.popular && OYO.utils.getCount(data.popular) > 0) {
                    html.append("<option disabled>-------------------</option>");
                }
            }

            var inverted = OYO.utils.invertJSON(data.all, {inner: "title"});
            var sortedByTitle = OYO.utils.sortJSON(inverted, {datatype: "string"});
            $.each(sortedByTitle, function (index, value) {
                var selected = '';
                if (!checked) {
                    selected = lang.toString() === inverted[value].toString() ? "selected" : "";
                }
                html.append("<option value='" + data.all[inverted[value]].url + "' " + selected + ">" + data.all[inverted[value]].title + "</option>");
            });
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
        $.fn.initLanguageList = function (options) {
            var type = $(this).data('type') || 'type1',
                display_only = $(this).data('display_only'),
                params = {
                    selector: $(this)
                };
            if (options && options.type) {
                type = options.type;
            }
            params.page = options.page;
            if (display_only) {
                params.display_only = true;
            }
            switch (type) {
                case 'type1':
                {
                    self.createLanguageHTML(params);
                    break;
                }
                case 'type2':
                {
                    self.createLanguageSimpleHTML(params);
                    break;
                }
            }
        };
    }
}

