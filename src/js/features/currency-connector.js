import { StringBuilder } from '../utils/string-builder.js';

export class CurrencyConnector{
    constructor(){
        this.cache = null;
        this.serviceUrl = {
            index: '/ooyyo-services/resources/common/currenciesweb',
            result: '/ooyyo-services/resources/common/currenciesweb',
            detail: '/ooyyo-services/resources/common/currenciesweb'
        };
    }
    getCurrencies(page, callback){
        var self = this,
            params = OYO.utils.getParams();
        if(self.cache){
            if(callback){
                callback(self.cache);
            }
        }else{
            $.getJSONData(this.serviceUrl[page], params, function(data) {
                self.cache = data;
                var currencies = {};
                $.each(data.popular, function(k,v){
                    currencies[v.idCurrency] = v;
                });
                $.each(data.all, function(k,v){
                    currencies[v.idCurrency] = v;
                });
                $(document).trigger("currencies-loaded", currencies);
                if(callback){
                    callback(data);    
                }
            });
        }
    }
    getCurrencyDisplay(currency){
        return currency.iso + " " + currency.description;
    }
    getCurrencyStyledDisplay(currency){
        return currency.iso + " <span class='marked'>" + currency.description + "</span>";
    }
    createCurrencyHTML(options) {
        var self = this;
        var selector = options.selector;
        var list_position = 'left';
        if (options && options.list_position) {
            list_position = options.list_position;
        }
        var currencyHTML = "<div class='currency-list " + list_position + " list'>\n\
                                <ul class='col-sm-12 w50p'>#lisPop#</ul>#divider#\n\
                                <ul class='col-sm-6'>#lis1#</ul>\n\
                                <ul class='col-sm-6'>#lis2#</ul>\n\
                            </div>";
        
        this.getCurrencies(options.page, function(data) {
            var li = "<li><a href='javascript:void(0)' data-what='#idCurrency#' class='_lckscrn' data-cfield='idCurrency'>#title#</a></li>";
            
            var deleteDivider = true;
            var invertedPop = OYO.utils.invertJSON(data.popular, {inner: "iso"});
            var sortedPop = OYO.utils.sortJSON(invertedPop, {datatype: "string"});
            var selectedObj = null;
            
            $.each(sortedPop, function(key, value) {
                
                if(data.popular[invertedPop[value]].idCurrency.toString() === OYO.appParams.idCurrency.toString()){
                    selectedObj = data.popular[invertedPop[value]];
                }
                
                deleteDivider = false;
                var _li = li.replace("#idCurrency#", data.popular[invertedPop[value]].idCurrency)
                        .replace("#title#", self.getCurrencyStyledDisplay(data.popular[invertedPop[value]]));
                        
                currencyHTML = currencyHTML.replace("#lisPop#", _li + "#lisPop#");
            });
            
            if(deleteDivider){
                currencyHTML = currencyHTML.replace("#divider#", "");
            }else{
                currencyHTML = currencyHTML.replace("#divider#", "<ul class='col-sm-12'><hr></ul>");
            }
            
            
            
            var count = OYO.utils.getCount(data.all);
            var x = (count - 1) / 2 + 1;
            x = x - x % 1;
            var temp = 0;
            var i = 0;

            var inverted = OYO.utils.invertJSON(data.all, {inner: "iso"});
            var sorted = OYO.utils.sortJSON(inverted, {datatype: "string"});

            
            $.each(sorted, function(key, value) {
                if(selectedObj === null && data.all[inverted[value]].idCurrency.toString() === OYO.appParams.idCurrency.toString()){
                    selectedObj = data.all[inverted[value]];
                }
                if (temp >= 0 && temp < x) {
                    i = 1;
                }
                if (temp >= x && temp < 2 * x) {
                    i = 2;
                }

                var _li = li.replace("#idCurrency#", data.all[inverted[value]].idCurrency)
                        .replace("#title#", self.getCurrencyStyledDisplay(data.all[inverted[value]]));
                        
                currencyHTML = currencyHTML.replace("#lis" + i + "#", _li + "#lis" + i + "#");
                temp += 1;
            });

            selector.append(selectedObj.iso).append('<span class="caret"></span>');

            currencyHTML = currencyHTML
                    .replace("#lisPop#", "")
                    .replace("#lis1#", "")
                    .replace("#lis2#", "");

            selector.after(currencyHTML);
            
            

            var currency_list = selector.next('.list');
            
            currency_list.css({
                top: (selector.outerHeight() + selector.position().top)
            });

            selector.click(function(e) {
                currency_list.toggle();
                e.stopPropagation();
            });
            
            try{
                selector.addMouseTimeout({content: currency_list});
            }catch(ex){
                
            }

            if (options && options.callback) {
                options.callback();
            }
            
            currency_list.find('li a').click(function(){
                var newCurr = $(this).data('what');
                OYO.utils.setCurrency(newCurr);
                window.location.reload();
            });
        });
    }
    createCurrencySimpleHTML(options) {
        var self = this;
        var selector = options.selector;
        var currency = OYO.appParams.idCurrency;
        var html = new StringBuilder();
        this.getCurrencies(options.page, function(data) {
            var checked = false;
            var invertedPop = OYO.utils.invertJSON(data.popular, {inner: "iso"});
            var sortedPop = OYO.utils.sortJSON(invertedPop, {datatype: "string"});
            $.each(sortedPop, function(index, value) {
                var selected = currency === data.popular[invertedPop[value]].idCurrency.toString() ? "selected" : "";
                if (selected === 'selected')
                    checked = true;
                html.append("<option value='"+data.popular[invertedPop[value]].idCurrency+"' " + selected + ">" + self.getCurrencyDisplay(data.popular[invertedPop[value]]) + "</option>");
            });
            if (data.popular && OYO.utils.getCount(data.popular) > 0) {
                html.append("<option disabled>-------------------</option>");
            }
            var inverted = OYO.utils.invertJSON(data.all, {inner: "iso"});
            var sorted = OYO.utils.sortJSON(inverted, {datatype: "string"});
            $.each(sorted, function(index, value) {
                var selected = '';
                if (!checked) {
                    selected = currency === data.all[inverted[value]].idCurrency.toString() ? "selected" : "";
                }
                html.append("<option value='"+data.all[inverted[value]].idCurrency+"' " + selected + ">" + self.getCurrencyDisplay(data.all[inverted[value]]) + "</option>");
            });
            selector.html(html.toString());
            selector.change(function() {
                OYO.utils.lockScreen();
                var newCurr = $(this).val();
                OYO.utils.setCurrency(newCurr);
                window.location.reload();
            });
        });
    }
    init(){
        let self = this;
        $.fn.initCurrencyList = function(options) {
            var type = $(this).data('type') || 'type1',
                params = {
                    selector: $(this)
                };
            if(options && options.type){
                type = options.type;
            }
            params.page = options.page;
            switch (type) {
                case 'type1':{
                    self.createCurrencyHTML(params);
                    break;
                }
                case 'type2':{
                    self.createCurrencySimpleHTML(params);
                    break;
                }
            }
        };
    }
}




/*
carTO: 5000 CHF
user: USD

display: $5.500

1) konverzija CHF -> USD
   5000 * multiplikator = 5500
2) formatiranje (SIMBOL, TACKA/ZAREZ) $5.500

Primer:

user 
uidCurrency = 14, ueurValue = 0.10384863023656718

carTO 
cPrice = 5000, cidCurrency = 4, ceurValue = 0.6517205422314911

konverzija:

cPriceEUR = cPrice * ceurValue = 3258.6027
uPrice = cPriceEUR / ueurValue = 31378.3888

uPrice = (cPrice * ceurValue) / ueurValue
*/