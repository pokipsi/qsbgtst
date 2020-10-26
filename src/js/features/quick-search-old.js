import { StringBuilder } from '../utils/string-builder.js';
import { Dropdown } from './dropdown.js';
import { messageBox } from './message-box.js';
import noUiSlider from 'nouislider';
import { Stat } from './stat.js';

import Prompt from '../features/custom-user-messaging-and-input/prompt';
import Confirm from '../features/custom-user-messaging-and-input/confirm';
import Toast from '../features/custom-user-messaging-and-input/toast';

OYO.quickSearch = {
    cached: {},
    locked: false,
    lockElement: null,
    lockStart: 0,
    lockTimeout: null,
    qsTypes: {BASIC: "basic", ADVANCED: "advanced"},
    serviceUrls: {
        SERVICE_QS_ELEMENTS: '/ooyyo-services/resources/quicksearch/qselements'
    },
    savedSearches: {},
    defaults: {
        idMake: 'any',
        idModel: 'any',
        idTrim: 'any',
        idBodytype: 'any',
        idFueltype: 'any',
        idTransmission: 'any',
        idColor: 'any',
        priceFrom: 'any',
        priceTo: 'any',
        yearFrom: 'any',
        yearTo: 'any',
        mileageFrom: 'any',
        mileageTo: 'any',
        radius: '30'
    },
    searchButtonEnabled: true,
    message: '',
    helpers: {
        ZIPCODE_FOCUSED: false,
        RELOAD_ON_RESET: false,
        REFINED: false
    },
    paramMap: {
        isNew: 0,
        idCountry: 0,
        idLanguage: 0,
        idDomain: 0
    },
    priceRange: null,
    yearRange: null,
    mileageRange: null,
    rangesSet: false,
    rangeData: {
        prices: [],
        years: [],
        mileages: []
    },
    qsHTML: {
        radius: `<option value='10'>10 #lengthunit#</option>
                <option value='20'>20 #lengthunit#</option>
                <option value='30' selected='selected'>30 #lengthunit#</option>
                <option value='60'>60 #lengthunit#</option>
                <option value='100'>100 #lengthunit#</option>
                <option value='500'>500 #lengthunit#</option>`
    },
    //functions
    change: function (options) {
        var _self = this;
        if (!_self.locked) {
            if (options.prepareParams)
                options.prepareParams.call();
            var timeout = 500;
            _self.lockStart = (new Date()).getTime();
            _self.lockQS({timeout: timeout});
            _self.loadData({
                callback: function () {
                    _self.renderSearchHistoryButtons();
                    _self.unlockQS({timeout: timeout});
                    if (options.doAfterDataLoaded)
                        options.doAfterDataLoaded.call();
                }
            });
        }
    },
    changeModel: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#model").val() !== _self.defaults.idModel) {
                    if (_self.isNew()) {
                        delete _self.paramMap.idBodytype;
                    }
                    _self.paramMap.idModel = $("#model").val();
                } else {
                    delete _self.paramMap.idModel;
                }
                delete _self.paramMap.idTrim;
            }
        });
    },
    changeTrim: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#trim").val() !== _self.defaults.idTrim) {
                    _self.paramMap.idTrim = $("#trim").val();
                } else {
                    delete _self.paramMap.idTrim;
                }
            }
        });
    },
    changePriceFrom: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#pricefrom").val() !== _self.defaults.priceFrom) {
                    _self.paramMap.priceFrom = $("#pricefrom").val();
                } else {
                    delete _self.paramMap.priceFrom;
                }
            }
        });
    },
    changePriceTo: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#priceto").val() !== _self.defaults.priceTo) {
                    _self.paramMap.priceTo = $("#priceto").val();
                } else {
                    delete _self.paramMap.priceTo;
                }
            }
        });
    },
    changeYearFrom: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#yearfrom").val() !== _self.defaults.yearFrom) {
                    _self.paramMap.yearFrom = $("#yearfrom").val();
                } else {
                    delete _self.paramMap.yearFrom;
                }
            }
        });
    },
    changeYearTo: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#yearto").val() !== _self.defaults.yearTo) {
                    _self.paramMap.yearTo = $("#yearto").val();
                } else {
                    delete _self.paramMap.yearTo;
                }
            }
        });
    },
    changeMileageFrom: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#mileagefrom").val() !== _self.defaults.mileageFrom) {
                    _self.paramMap.mileageFrom = $("#mileagefrom").val();
                } else {
                    delete _self.paramMap.mileageFrom;
                }
            }
        });
    },
    changeMileageTo: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#mileageto").val() !== _self.defaults.mileageTo) {
                    _self.paramMap.mileageTo = $("#mileageto").val();
                } else {
                    delete _self.paramMap.mileageTo;
                }
            }
        });
    },
    changeBodytype: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#bodytype").val() !== _self.defaults.idBodytype) {
                    _self.paramMap.idBodytype = $("#bodytype").val();
                } else {
                    delete _self.paramMap.idBodytype;
                }
            }
        });
    },
    changeTransmission: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#transmission").val() !== _self.defaults.idTransmission) {
                    _self.paramMap.idTransmission = $("#transmission").val();
                } else {
                    delete _self.paramMap.idTransmission;
                }
            }
        });
    },
    changeColor: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#color").val() !== _self.defaults.idColor) {
                    _self.paramMap.idColor = $("#color").val();
                } else {
                    delete _self.paramMap.idColor;
                }
            }
        });
    },
    changeFueltype: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                if ($("#fueltype").val() !== _self.defaults.idFueltype) {
                    _self.paramMap.idFueltype = $("#fueltype").val();
                } else {
                    delete _self.paramMap.idFueltype;
                }
            }
        });
    },
    changeZip: function (obj, e) {
        var _self = this;
        var currentValue = obj.val();
        if (e.which === 13) {
            $("#search-button").focus();
        } else {
            if (currentValue.length === 5 && OYO.utils.regContainsAllDigits($("#zipcode").val(), {count: 5})) {
                this.change({
                    prepareParams: function () {
                        _self.paramMap.zipCode = $("#zipcode").val();
                        if ($("#radius").val())
                            _self.paramMap.radius = $("#radius").val();
                        else
                            _self.paramMap.radius = _self.defaults.radius;
                    }
                });
            }
            if ($("#zipcode").val() === '') {
                this.change({
                    prepareParams: function () {
                        delete _self.paramMap.zipCode;
                        delete _self.paramMap.radius;
                    }
                });
            }
        }
    },
    changeRadius: function () {
        var _self = this;
        if ($("#zipcode").val().length === 5 && OYO.utils.regContainsAllDigits($("#zipcode").val(), {count: 5})) {
            this.change({
                prepareParams: function () {
                    _self.paramMap.zipCode = $("#zipcode").val();
                    _self.paramMap.radius = $("#radius").val();
                }
            });
        }
    },
    updateBodytypeCollectionView: function (bodytypes) {
        var _self = this,
                sb = new StringBuilder();
        $.each(bodytypes, function (k, v) {
            var bt = new StringBuilder();
            bt.append("<div class='cv-item' id='bt-item-#id#' data-id='#id#'>")
                    .append("<div class='cv-img bt-img-#id#'></div>")
                    .append("<div class='cv-display'>")
                    .append(v.displayBodytype)
                    .append("</div>")
                    .append("<div class='cv-count'>(")
                    .append(v.displayCount)
                    .append(")</div>")
                    .append("</div>");
            sb.append(bt.toString().split('#id#').join(v.idBodytype));
        });
        $("#bodytypes-collection-view").html(sb.toString());
        if (_self.paramMap.idBodytype) {
            $("#bt-item-" + _self.paramMap.idBodytype).addClass("selected");
        }
    },
    updateTransmissionCollectionView: function (transmissions) {
        var _self = this,
                sb = new StringBuilder();
        $.each(transmissions, function (k, v) {
            var bt = new StringBuilder();
            bt.append("<div class='cv-item' id='tr-item-#id#' data-id='#id#'>")
                    .append("<div class='cv-display'>")
                    .append(v.displayName)
                    .append("</div>")
                    .append("<div class='cv-count'>(")
                    .append(v.displayCount)
                    .append(")</div>")
                    .append("</div>");
            sb.append(bt.toString().split('#id#').join(v.idTransmission));
        });
        $("#transmissions-collection-view").html(sb.toString());
        if (_self.paramMap.idTransmission) {
            $("#tr-item-" + _self.paramMap.idTransmission).addClass("selected");
        }
    },
    updateColorCollectionView: function (colors) {
        var _self = this,
                sb = new StringBuilder();
        $.each(colors, function (k, v) {
            var bt = new StringBuilder();
            bt.append("<div class='cv-item' id='co-item-#id#' data-id='#id#'>")
                    .append("<div class='cv-bdg co-bdg-#id#'></div>")
                    .append("<div class='cv-display'>")
                    .append(v.displayName)
                    .append("</div>")
                    .append("<div class='cv-count'>(")
                    .append(v.displayCount)
                    .append(")</div>")
                    .append("</div>");
            sb.append(bt.toString().split('#id#').join(v.idColor));
        });
        $("#colors-collection-view").html(sb.toString());
        if (_self.paramMap.idColor) {
            $("#co-item-" + _self.paramMap.idColor).addClass("selected");
        }
    },
    rangeSlidersSetup: {
        price: {
            divider: 50,
            dividerPosition: 50
        },
        year: {
            divider: 80,
            dividerPosition: 25
        }
    },
    initRangeSliders: function (data) {
        var self = this,
                setup = {
                    start: [0, 100],
                    connect: true,
                    animate: true,
                    animationDuration: 300,
                    range: {
                        min: 0,
                        max: 100
                    }
                };

        $.each(data.pricesFrom, function (k, v) {
            self.rangeData.prices.push({
                id: k,
                display: v.displayPrice
            });
        });

        self.rangeData.prices.push({
            id: '200000',
            display: self.rangeData.prices[self.rangeData.prices.length - 1].display + '+'
        });

        for (var i = data.yearsFrom.length - 1; i > -1; i--) {
            var v = data.yearsFrom[i];
            self.rangeData.years.push({
                id: v,
                display: v
            });
        }

        $.each(data.mileagesFrom, function (k, v) {
            self.rangeData.mileages.push({
                id: k,
                display: v.displayMileage
            });
        });

        self.rangeData.mileages.push({
            id: '200000',
            display: self.rangeData.mileages[self.rangeData.mileages.length - 1].display + '+'
        });

        self.priceRange = document.getElementById('pricerange');
        noUiSlider.create(self.priceRange, setup);
        self.priceRange.noUiSlider.on('update', function (values) {
            var range = self.getDataForRangeSlidersSplitted(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.prices, self.rangeSlidersSetup.price.divider, self.rangeSlidersSetup.price.dividerPosition);
            $("#range-min-price").html(range.minDisplay);
            $("#range-max-price").html(range.maxDisplay);
            $(".rsp-price").html(range.minDisplay + " - " + range.maxDisplay).parent().show();
        });
        self.priceRange.noUiSlider.on('set', function () {
            $(".rsp-price").parent().hide();
        });
        self.priceRange.noUiSlider.on('end', function (values) {
            var range = self.getDataForRangeSlidersSplitted(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.prices, self.rangeSlidersSetup.price.divider, self.rangeSlidersSetup.price.dividerPosition);
            var priceFromDefault = self.rangeData.prices[0].id.toString();
            var priceToDefault = self.rangeData.prices[self.rangeData.prices.length - 1].id.toString();
            var sendRequestMin = function () {
                self.change({
                    prepareParams: function () {
                        if (range.minId.toString() !== priceFromDefault) {
                            self.paramMap.priceFrom = range.minId.toString();
                        } else {
                            delete self.paramMap.priceFrom;
                        }
                    }
                });
            };
            var sendRequestMax = function () {
                self.change({
                    prepareParams: function () {
                        if (range.maxId.toString() !== priceToDefault) {
                            self.paramMap.priceTo = range.maxId.toString();
                        } else {
                            delete self.paramMap.priceTo;
                        }
                    }
                });
            };
            if (self.paramMap.priceFrom) {
                if (self.paramMap.priceFrom !== range.minId.toString()) {
                    sendRequestMin();
                }
            } else {
                if (range.minId.toString() !== priceFromDefault) {
                    sendRequestMin();
                }
            }

            if (self.paramMap.priceTo) {
                if (self.paramMap.priceTo !== range.maxId.toString()) {
                    sendRequestMax();
                }
            } else {
                if (range.maxId.toString() !== priceToDefault) {
                    sendRequestMax();
                }
            }

            $(".rsp-price").parent().hide();
            Stat.countQSElementsUsage("price-slider");
        });
        self.setPriceRangeByValue();

        self.yearRange = document.getElementById('yearrange');
        noUiSlider.create(self.yearRange, setup);
        self.yearRange.noUiSlider.on('update', function (values) {
            var range = self.getDataForRangeSlidersSplitted(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.years, self.rangeSlidersSetup.year.divider, self.rangeSlidersSetup.year.dividerPosition);
            $("#range-min-year").html(range.minDisplay);
            $("#range-max-year").html(range.maxDisplay);
            $(".rsp-year").html(range.minDisplay + " - " + range.maxDisplay).parent().show();
        });
        self.yearRange.noUiSlider.on('set', function () {
            $(".rsp-year").parent().hide();
        });
        self.yearRange.noUiSlider.on('end', function (values) {
            var range = self.getDataForRangeSlidersSplitted(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.years, self.rangeSlidersSetup.year.divider, self.rangeSlidersSetup.year.dividerPosition);
            var yearFromDefault = self.rangeData.years[0].id.toString();
            var yearToDefault = self.rangeData.years[self.rangeData.years.length - 1].id.toString();
            var sendRequestMin = function () {
                self.change({
                    prepareParams: function () {
                        if (range.minId.toString() !== yearFromDefault) {
                            self.paramMap.yearFrom = range.minId.toString();
                        } else {
                            delete self.paramMap.yearFrom;
                        }
                    }
                });
            };
            var sendRequestMax = function () {
                self.change({
                    prepareParams: function () {
                        if (range.maxId.toString() !== yearToDefault) {
                            self.paramMap.yearTo = range.maxId.toString();
                        } else {
                            delete self.paramMap.yearTo;
                        }
                    }
                });
            };
            if (self.paramMap.yearFrom) {
                if (self.paramMap.yearFrom !== range.minId.toString()) {
                    sendRequestMin();
                }
            } else {
                if (range.minId.toString() !== yearFromDefault) {
                    sendRequestMin();
                }
            }

            if (self.paramMap.yearTo) {
                if (self.paramMap.yearTo !== range.maxId.toString()) {
                    sendRequestMax();
                }
            } else {
                if (range.maxId.toString() !== yearToDefault) {
                    sendRequestMax();
                }
            }

            $(".rsp-year").parent().hide();
            Stat.countQSElementsUsage("year-slider");
        });
        self.setYearRangeByValue();

        self.mileageRange = document.getElementById('mileagerange');
        noUiSlider.create(self.mileageRange, setup);
        self.mileageRange.noUiSlider.on('update', function (values) {
            var range = self.getDataForRangeSliders(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.mileages);
            $("#range-min-mileage").html(range.minDisplay);
            $("#range-max-mileage").html(range.maxDisplay);
            $(".rsp-mileage").html(range.minDisplay + " - " + range.maxDisplay).parent().show();
        });
        self.mileageRange.noUiSlider.on('set', function () {
            $(".rsp-mileage").parent().hide();
        });
        self.mileageRange.noUiSlider.on('end', function (values) {
            var range = self.getDataForRangeSliders(parseFloat(values[0]), parseFloat(values[1]), self.rangeData.mileages);
            var mileageFromDefault = self.rangeData.mileages[0].id.toString();
            var mileageToDefault = self.rangeData.mileages[self.rangeData.mileages.length - 1].id.toString();
            var sendRequestMin = function () {
                self.change({
                    prepareParams: function () {
                        if (range.minId.toString() !== mileageFromDefault) {
                            self.paramMap.mileageFrom = range.minId.toString();
                        } else {
                            delete self.paramMap.mileageFrom;
                        }
                    }
                });
            };
            var sendRequestMax = function () {
                self.change({
                    prepareParams: function () {
                        if (range.maxId.toString() !== mileageToDefault) {
                            self.paramMap.mileageTo = range.maxId.toString();
                        } else {
                            delete self.paramMap.mileageTo;
                        }
                    }
                });
            };
            if (self.paramMap.mileageFrom) {
                if (self.paramMap.mileageFrom !== range.minId.toString()) {
                    sendRequestMin();
                }
            } else {
                if (range.minId.toString() !== mileageFromDefault) {
                    sendRequestMin();
                }
            }

            if (self.paramMap.mileageTo) {
                if (self.paramMap.mileageTo !== range.maxId.toString()) {
                    sendRequestMax();
                }
            } else {
                if (range.maxId.toString() !== mileageToDefault) {
                    sendRequestMax();
                }
            }

            $(".rsp-mileage").parent().hide();
            Stat.countQSElementsUsage("mileage-slider");
        });
        self.setMileageRangeByValue();

    },
    setPriceRangeByValue: function () {
        var self = this,
                minValue = self.paramMap.priceFrom,
                maxValue = self.paramMap.priceTo;
        if (!minValue) {
            minValue = self.rangeData.prices[0].id;
        }
        if (!maxValue) {
            maxValue = self.rangeData.prices[self.rangeData.prices.length - 1].id;
        }
        var pos = self.getSliderPositionByValueSplitted(minValue, maxValue, self.rangeData.prices, self.rangeSlidersSetup.price.divider, self.rangeSlidersSetup.price.dividerPosition);
        self.priceRange.noUiSlider.set([pos.min, pos.max]);
    },
    setYearRangeByValue: function () {
        var self = this,
                minValue = self.paramMap.yearFrom,
                maxValue = self.paramMap.yearTo;
        if (!minValue) {
            minValue = self.rangeData.years[0].id;
        }
        if (!maxValue) {
            maxValue = self.rangeData.years[self.rangeData.years.length - 1].id;
        }
        var pos = self.getSliderPositionByValueSplitted(minValue, maxValue, self.rangeData.years, self.rangeSlidersSetup.year.divider, self.rangeSlidersSetup.year.dividerPosition);
        self.yearRange.noUiSlider.set([pos.min, pos.max]);
    },
    setMileageRangeByValue: function () {
        var self = this,
                minValue = self.paramMap.mileageFrom,
                maxValue = self.paramMap.mileageTo;
        if (!minValue) {
            minValue = self.rangeData.mileages[0].id;
        }
        if (!maxValue) {
            maxValue = self.rangeData.mileages[self.rangeData.mileages.length - 1].id;
        }
        var pos = self.getSliderPositionByValue(minValue, maxValue, self.rangeData.mileages);
        self.mileageRange.noUiSlider.set([pos.min, pos.max]);
    },
    getDataForRangeSliders: function (minValue, maxValue, items) {

        var ret,
                minDisplay,
                minId,
                minTO,
                maxDisplay,
                maxId,
                maxTO,
                minIndex,
                maxIndex,
                x = 100 / items.length;

        minIndex = Math.min(Math.floor(minValue / x), items.length - 1);
        minTO = items[minIndex];
        minDisplay = minTO.display;
        minId = minTO.id;

        maxIndex = Math.min(Math.floor(maxValue / x), items.length - 1);
        maxTO = items[maxIndex];
        maxDisplay = maxTO.display;
        maxId = maxTO.id;

        ret = {
            minDisplay: minDisplay,
            maxDisplay: maxDisplay,
            minId: minId,
            maxId: maxId
        };

        return ret;
    },
    getDataForRangeSlidersSplitted: function (minValue, maxValue, items, divider, dividerPosition) {

        /*
         
         a = 80%
         c = [0,1,2,3,4,5,6,7,8,9]
         cmin = c[0]
         cmax = c[c.length-1]
         i = c.length * 80% = 8
         m = [0,1,2,3,4,5,6,7]
         n = [8,9]
         kmin = cmin = c[0]
         k
         
         
         
         
         */

        var ret,
                minDisplay,
                minId,
                minTO,
                maxDisplay,
                maxId,
                maxTO,
                minIndex,
                maxIndex,
                x;


//        var divider = 80; //%
//        var arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        var l = items.length;
        var indexOfDivider = Math.round(l * divider / 100);
        var items1 = items.slice();
        var items2 = items1.splice(indexOfDivider);
//        console.log(indexOfDivider);
//        var dividerPosition = 25; //%

        /*
         sad imamo dve kolekcije items1, i items2
         
         treba da utvrdimo gde pripadaju klizaci koje smo dobili preko varijabli minValue i maxValue
         
         */

        if (minValue < dividerPosition) {
            var minValue1 = minValue * 100/dividerPosition;
            x = 100 / items1.length;
            minIndex = Math.min(Math.floor(minValue1 / x), items1.length - 1);
            minTO = items1[minIndex];
            minDisplay = minTO.display;
            minId = minTO.id;
        } else {
            var minValue2 = ((minValue-dividerPosition) * 100)/(100-dividerPosition);
            x = 100 / items2.length;
            minIndex = Math.min(Math.floor(minValue2 / x), items2.length - 1);
            minTO = items2[minIndex];
            minDisplay = minTO.display;
            minId = minTO.id;
        }

        if (maxValue < dividerPosition) {
            var maxValue1 = maxValue * 100/dividerPosition;
            x = 100 / items1.length;
            maxIndex = Math.min(Math.floor(maxValue1 / x), items1.length - 1);
            maxTO = items1[maxIndex];
            maxDisplay = maxTO.display;
            maxId = maxTO.id;
        } else {
            var maxValue2 = ((maxValue-dividerPosition) * 100)/(100-dividerPosition);
            x = 100 / items2.length;
            maxIndex = Math.min(Math.floor(maxValue2 / x), items2.length - 1);
            maxTO = items2[maxIndex];
            maxDisplay = maxTO.display;
            maxId = maxTO.id;
        }

        ret = {
            minDisplay: minDisplay,
            maxDisplay: maxDisplay,
            minId: minId,
            maxId: maxId
        };

        return ret;
    },
    getSliderPositionByValue: function (min, max, items) {
        var ret,
                size = items.length,
                minValueIndex = 0,
                maxValueIndex = size - 1,
                i = 0;
        $.each(items, function (k, v) {
            if (min.toString() === v.id.toString()) {
                minValueIndex = i;
            }
            if (max.toString() === v.id.toString()) {
                maxValueIndex = i;
            }
            i += 1;
        });

        ret = {
            min: Math.round((minValueIndex / (size - 1)) * 100),
            max: Math.round((maxValueIndex / (size - 1)) * 100)
        };

        return ret;
    },
    getSliderPositionByValueSplitted: function (min, max, items, divider, dividerPosition) {
        var ret,
                size = items.length,
                minValueIndex = 0,
                maxValueIndex = size - 1,
                i = 0;
        
        $.each(items, function (k, v) {
            if (min.toString() === v.id.toString()) {
                minValueIndex = i;
            }
            if (max.toString() === v.id.toString()) {
                maxValueIndex = i;
            }
            i += 1;
        });
        
        var l = items.length;
        var indexOfDivider = Math.round(l * divider / 100);
        
        var items1 = items.slice();
        var items2 = items1.splice(indexOfDivider);
        
        var thumbPosSplittedMin, thumbPosSplittedMax;
        var thumbPosMin, thumbPosMax;
        
        if(minValueIndex < indexOfDivider){
            thumbPosSplittedMin = (minValueIndex * 100) / items1.length;
            thumbPosMin = (thumbPosSplittedMin*dividerPosition)/100;
    
        }else{
            thumbPosSplittedMin = ((minValueIndex-indexOfDivider) * 100) / (items2.length-1);
            thumbPosMin = ((100-dividerPosition)*thumbPosSplittedMin)/100+dividerPosition;
        }
        
        if(maxValueIndex < indexOfDivider){
            thumbPosSplittedMax = (maxValueIndex * 100) / items1.length;
            thumbPosMax = (thumbPosSplittedMax*dividerPosition)/100;
        }else{
            thumbPosSplittedMax = ((maxValueIndex-indexOfDivider) * 100) / (items2.length-1);
            thumbPosMax = ((100-dividerPosition)*thumbPosSplittedMax)/100+dividerPosition;
        }

        ret = {
            min: thumbPosMin,
            max: thumbPosMax
        };

        return ret;
    },
    lockQS: function (options) {
        var _self = this;
        _self.locked = true;
        _self.lockStart = (new Date()).getTime();
        var width,
                qh = $(".qs").outerHeight(),
                wh = $(window).outerHeight(),
                height = qh < wh ? qh : wh,
                spinner,
                spinnerWidth,
                spinnerHeight,
                spinnerTop,
                spinnerLeft,
                position = qh < wh ? 'absolute' : 'fixed';
        if (!_self.lockElement) {
            //create lock element
            width = $(".qs").outerWidth();
            spinnerWidth = 50;
            spinnerHeight = 50;
            spinnerTop = height / 2 - spinnerHeight;
            spinnerLeft = (width - spinnerWidth) / 2;
            spinner = $("<img>").attr('src', OYO.images.LOADING_2).attr('alt', 'loading...');
            _self.lockElement = $("<div>").addClass("lock").css({
                width: width
            }).append(spinner.css({
                top: spinnerTop,
                left: spinnerLeft
            })).appendTo(".qs");
        }
        //add transparent lock
        _self.lockElement.height(height).addClass("transparent").css('position', position).show();
        //after 500ms show lock (grey with spinner)
        _self.lockTimeout = setTimeout(function () {
            _self.lockElement.hide().removeClass("transparent").fadeIn(300);
        }, options.timeout);
        return _self;
    },
    unlockQS: function (options) {
        var _self = this;
        var time = (new Date()).getTime();
        if (time - _self.lockStart > options.timeout) {
            _self.lockElement.fadeOut(200);
        } else {
            _self.lockElement.hide();
        }
        clearTimeout(_self.lockTimeout);
        _self.locked = false;
        return _self;
    },
    initParamMap: function (options) {
        var _self = this;
        _self.paramMap.idDomain = OYO.appParams.idDomain;
        _self.paramMap.idCountry = OYO.appParams.idCountry;
        _self.paramMap.idLanguage = OYO.appParams.idLanguage;
        _self.paramMap.idCurrency = OYO.appParams.idCurrency;
        _self.paramMap.isNew = OYO.appParams.isNew;
        if (options && options.qsType && options.qsType === QS_TYPES.ADVANCED) {
            _self.paramMap.QS_TYPE = QS_TYPES.ADVANCED;
        }
        if (OYO.appParams.idMake !== '') {
            _self.paramMap.idMake = OYO.appParams.idMake;
            if (OYO.appParams.idModel !== '') {
                _self.paramMap.idModel = OYO.appParams.idModel;
                if (OYO.appParams.idTrim !== '') {
                    _self.paramMap.idTrim = OYO.appParams.idTrim;
                }
            }
        }
        if (OYO.appParams.priceFrom !== '') {
            _self.paramMap.priceFrom = OYO.appParams.priceFrom;
        }
        if (OYO.appParams.priceTo !== '') {
            _self.paramMap.priceTo = OYO.appParams.priceTo;
        }
        if (OYO.appParams.yearFrom !== '') {
            _self.paramMap.yearFrom = OYO.appParams.yearFrom;
        }
        if (OYO.appParams.yearTo !== '') {
            _self.paramMap.yearTo = OYO.appParams.yearTo;
        }
        if (OYO.appParams.mileageFrom !== '') {
            _self.paramMap.mileageFrom = OYO.appParams.mileageFrom;
        }
        if (OYO.appParams.mileageTo !== '') {
            _self.paramMap.mileageTo = OYO.appParams.mileageTo;
        }
        if (OYO.appParams.idBodytype !== '') {
            _self.paramMap.idBodytype = OYO.appParams.idBodytype;
        }
        if (OYO.appParams.idFueltype !== '') {
            _self.paramMap.idFueltype = OYO.appParams.idFueltype;
        }
        if (OYO.appParams.zipCode !== '') {
            _self.paramMap.zipCode = OYO.appParams.zipCode;
        }
        if (OYO.appParams.radius !== '') {
            _self.paramMap.radius = OYO.appParams.radius;
        }
        if (OYO.appParams.idState !== '') {
            _self.paramMap.idState = OYO.appParams.idState;
        }
        if (OYO.appParams.idCity !== '') {
            _self.paramMap.idCity = OYO.appParams.idCity;
        }
        if (OYO.appParams.idTransmission !== '') {
            _self.paramMap.idTransmission = OYO.appParams.idTransmission;
        }
        if (OYO.appParams.idColor !== '') {
            _self.paramMap.idColor = OYO.appParams.idColor;
        }
        if (OYO.appParams.power !== '') {
            _self.paramMap.power = OYO.appParams.power;
        }
    },
    getQSParams: function () {
        var _self = this;
        //required request parameters
        var params = {
            qsType: _self.paramMap.QS_TYPE.toString(),
            isNew: _self.paramMap.isNew.toString(),
            idCountry: _self.paramMap.idCountry.toString(),
            idLanguage: _self.paramMap.idLanguage.toString(),
            idCurrency: _self.paramMap.idCurrency.toString(),
            idDomain: _self.paramMap.idDomain.toString()
        };
        //optional reequest parameters
        if (_self.paramMap.idMake) {
            params.idMake = _self.paramMap.idMake.toString();
        }
        if (_self.paramMap.idModel) {
            params.idModel = _self.paramMap.idModel.toString();
        }
        if (_self.paramMap.idTrim) {
            params.idTrim = _self.paramMap.idTrim.toString();
        }
        if (_self.paramMap.priceFrom) {
            params.priceFrom = _self.paramMap.priceFrom.toString();
        }
        if (_self.paramMap.priceTo) {
            params.priceTo = _self.paramMap.priceTo.toString();
        }
        if (_self.paramMap.yearFrom) {
            params.yearFrom = _self.paramMap.yearFrom.toString();
        }
        if (_self.paramMap.yearTo) {
            params.yearTo = _self.paramMap.yearTo.toString();
        }
        if (_self.paramMap.mileageFrom) {
            params.mileageFrom = _self.paramMap.mileageFrom.toString();
        }
        if (_self.paramMap.mileageTo) {
            params.mileageTo = _self.paramMap.mileageTo.toString();
        }
        if (_self.paramMap.idBodytype) {
            params.idBodytype = _self.paramMap.idBodytype.toString();
        }
        if (_self.paramMap.idFueltype) {
            params.idFueltype = _self.paramMap.idFueltype.toString();
        }
        if (_self.paramMap.zipCode) {
            params.zipCode = _self.paramMap.zipCode.toString();
        }
        if (_self.paramMap.radius) {
            params.radius = _self.paramMap.radius.toString();
        }
        if (_self.paramMap.idState) {
            params.idState = _self.paramMap.idState.toString();
        }
        if (_self.paramMap.idCity) {
            params.idCity = _self.paramMap.idCity.toString();
        }
        if (_self.paramMap.idTransmission) {
            params.idTransmission = _self.paramMap.idTransmission.toString();
        }
        if (_self.paramMap.idColor) {
            params.idColor = _self.paramMap.idColor.toString();
        }
        if (_self.paramMap.power) {
            params.power = _self.paramMap.power.toString();
        }
        if (OYO.appParams.mobile === '1') {
            params.mobile = OYO.appParams.mobile;
        }
        return params;
    },
    deleteParams: function(){
        let _self = this;
        delete _self.paramMap.idMake;
        delete _self.paramMap.idModel;
        delete _self.paramMap.idTrim;
        delete _self.paramMap.priceFrom;
        delete _self.paramMap.priceTo;
        delete _self.paramMap.yearFrom;
        delete _self.paramMap.yearTo;
        delete _self.paramMap.mileageFrom;
        delete _self.paramMap.mileageTo;
        delete _self.paramMap.idBodytype;
        delete _self.paramMap.idFueltype;
        delete _self.paramMap.zipCode;
        delete _self.paramMap.radius;
        delete _self.paramMap.idState;
        delete _self.paramMap.idCity;
        delete _self.paramMap.idTransmission;
        delete _self.paramMap.idColor;
        delete _self.paramMap.power;
    },
    reset: function () {
        var _self = this;
        this.change({
            prepareParams: function () {
                _self.deleteParams();
            },
            doAfterDataLoaded: function () {
                _self.priceRange.noUiSlider.set([0, 100]);
                _self.yearRange.noUiSlider.set([0, 100]);
                _self.mileageRange.noUiSlider.set([0, 100]);
                _self.resetSavedSearchesSelector();
                if (_self.helpers.RELOAD_ON_RESET) {
                    OYO.utils.gotoPage({url: $("#search-button").attr("href")});
                }
            }
        });
    },
    assignEventHandlers: function () {
        var _self = this;
        $(document).on("click", "#qs-mobile-switch", function () {
            _self.switchQS();
        });
//        $(document).on("change", "#make", function () {
//            _self.changeMake();
//        });
//        $(document).on("change", "#model", function () {
//            Stat.countQSElementsUsage("model");
//            _self.changeModel();
//        });
        $(document).on("change", "#trim", function () {
            Stat.countQSElementsUsage("trim");
            _self.changeTrim();
        });
        $(document).on("change", "#pricefrom", function () {
            Stat.countQSElementsUsage("priceFrom");
            _self.changePriceFrom();
        });
        $(document).on("change", "#priceto", function () {
            Stat.countQSElementsUsage("priceTo");
            _self.changePriceTo();
        });
        $(document).on("change", "#yearfrom", function () {
            Stat.countQSElementsUsage("yearFrom");
            _self.changeYearFrom();
        });
        $(document).on("change", "#yearto", function () {
            Stat.countQSElementsUsage("yearTo");
            _self.changeYearTo();
        });
        $(document).on("change", "#mileagefrom", function () {
            Stat.countQSElementsUsage("mileageFrom");
            _self.changeMileageFrom();
        });
        $(document).on("change", "#mileageto", function () {
            Stat.countQSElementsUsage("mileageTo");
            _self.changeMileageTo();
        });
        $(document).on("change", "#bodytype", function () {
            Stat.countQSElementsUsage("bodytype");
            _self.changeBodytype();
        });
        $(document).on("change", "#transmission", function () {
            Stat.countQSElementsUsage("transmission");
            _self.changeTransmission();
        });
        $(document).on("change", "#color", function () {
            Stat.countQSElementsUsage("color");
            _self.changeColor();
        });
        $(document).on("change", "#fueltype", function () {
            Stat.countQSElementsUsage("fueltype");
            _self.changeFueltype();
        });
        $(document).on("keyup", "#zipcode", function (e) {
            _self.changeZip($(this), e);
        });
        $(document).on("focus", "#zipcode", function (e) {
            _self.helpers.ZIPCODE_FOCUSED = true;
            if (!OYO.utils.regContainsAllDigits($("#zipcode").val(), {count: 5})) {
                $("#zipcode").val("");
            }
        });
        $(document).on("focusout", "#zipcode", function (e) {
            Stat.countQSElementsUsage("zipcode");
            _self.helpers.ZIPCODE_FOCUSED = false;
            if (!OYO.utils.regContainsAllDigits($("#zipcode").val(), {count: 5})) {
                if (_self.paramMap.zipCode) {
                    $("#zipcode").val(_self.paramMap.zipCode);
                } else
                    $("#zipcode").val(OYO.labels.zipcode);
            }
        });
        $(document).on("change", "#radius", function () {
            Stat.countQSElementsUsage("radius");
            _self.changeRadius();
        });
        $(document).on("click", "._js-hook-reset", function () {
            _self.reset();
            $('html, body').animate({
                scrollTop: 0
            }, 500);
        });
        $(document).on("click", "#search-button", function () {
            _self.showResults();
        });
        $(document).on("click", ".btn-save-search", function () {
            _self.saveSearch();
        });
        $(document).on("click", "#search-dropdown .ic_trash", function (e) {
            const $li = $(this).parent();
            let key = $li.data('params');
            _self.deleteSearch(key, $li);
            e.stopPropagation();    
        });
        $(document).on("click", ".message", function () {
            $(this).fadeOut(10);
        });
        $(document).on("change", "#usednew", function () {
            _self.lockQS({timeout: 0});
            OYO.utils.gotoPage({url: $(this).val()});
        });
        $(document).on("click", "#bodytypes-collection-view .cv-item", function () {
            Stat.countQSElementsUsage("bodytype-cv");
            var bt = $(this);
            if (bt.hasClass("selected")) {
                bt.removeClass("selected");
                delete _self.paramMap.idBodytype;
            } else {
                _self.paramMap.idBodytype = bt.data('id').toString();
                bt.addClass("selected");
            }
            _self.change({});
        });
        $(document).on("click", "#transmissions-collection-view .cv-item", function () {
            Stat.countQSElementsUsage("transmission-cv");
            var bt = $(this);
            if (bt.hasClass("selected")) {
                bt.removeClass("selected");
                delete _self.paramMap.idTransmission;
            } else {
                _self.paramMap.idTransmission = bt.data('id').toString();
                bt.addClass("selected");
            }
            _self.change({});
        });
        $(document).on("click", "#colors-collection-view .cv-item", function () {
            Stat.countQSElementsUsage("color-cv");
            var bt = $(this);
            if (bt.hasClass("selected")) {
                bt.removeClass("selected");
                delete _self.paramMap.idColor;
            } else {
                _self.paramMap.idColor = bt.data('id').toString();
                bt.addClass("selected");
            }
            _self.change({});
        });
        //$(document).on("");
        $(document).on("qs-search", function (e, name, value) {
            _self.change({
                prepareParams: function () {
                    switch (name) {
                        case 'make':
                            _self.paramMap.idMake = value;
                            delete _self.paramMap.idModel;
                            delete _self.paramMap.idTrim;
                            break;
                        case 'model':
                            _self.paramMap.idModel = value;
                            delete _self.paramMap.idTrim;
                            break;
                        case 'trim':
                            _self.paramMap.idTrim = value;
                            break;
                        case 'price':
                            _self.paramMap.priceFrom = value.split('_')[0];
                            let priceTo = value.split('_')[1];
                            if(priceTo < 200000) {
                                _self.paramMap.priceTo = priceTo;
                            }else{
                                delete _self.paramMap.priceTo;
                            }
                            break;
                        case 'year':
                            _self.paramMap.yearFrom = value.split('_')[0];
                            _self.paramMap.yearTo = value.split('_')[1];
                            break;
                        case 'bodytype':
                            _self.paramMap.idBodytype = value;
                            break;
                        case 'fueltype':
                            _self.paramMap.idFueltype = value;
                            break;
                        case 'transmission':
                            _self.paramMap.idTransmission = value;
                            break;
                        case 'power':
                            _self.paramMap.power = value;
                            break;
                        case 'color':
                            _self.paramMap.idColor = value;
                            break;
                        case 'country':
                            _self.paramMap.idCountry = value;
                            break;
                        case 'state':
                            _self.paramMap.idState = value;
                            break;
                        case 'city':
                            _self.paramMap.idCity = value;
                            break;
                    }
                },
                doAfterDataLoaded: function () {
                    OYO.utils.gotoPage({url: $("#search-button").attr("href")});
                }
            });
        });
    },
    showMessage: function () {
        var text = this.message;
        messageBox.show({
            text: text
        });
    },
    showResults: function () {
        if (this.searchButtonEnabled) {

        } else {
            this.showMessage();
        }
    },
    getMakeItemsHtml: function(all, popular){
        let self = this;
        let html = `
            <li data-id='${self.defaults.idMake}'><label class='withimg'>${OYO.labels.make}</label><span></span></li>
        `;
        if(popular){
            $.each(popular, function (index, value) {
                html += `
                    <li data-id='${value.idMake}'>
                        <div class="dd-img logo-make logo-make-${value.idMake}"></div>
                        <label class='withimg'>${value.name}</label>
                        <span>${value.displayCount}</span>
                    </li>`;
            });
            html += "<li class='divider'></li>";
        }
        $.each(all, function (index, value) {
            html += `
                <li data-id='${value.idMake}'>
                    <div class="dd-img logo-make logo-make-${value.idMake}"></div>
                    <label class='withimg'>${value.name}</label>
                    <span>${value.displayCount}</span>
                </li>`;
        });
        return html;
    },
    getSelectedMake: function(makes){
        let _self = this;
        let selectedMake = {idMake: _self.defaults.idMake, name: OYO.labels.make, displayCount: null};
        $.each(makes.black, function (index, value) {
            if (_self.paramMap.idMake === value.idMake.toString()) {
                selectedMake = {idMake: value.idMake, name: value.name, displayCount: value.displayCount};
            }
        });
        return selectedMake;
    },
    getMakesDropdownHTML: function(data) {
        var _self = this;
        
        let html = `
            <div class='filter-wrapper'><input type='text' class='form-control' placeholder='${OYO.labels.filter}' /></div>
            <div class='heading'>
                <h3>${OYO.labels.make}</h3>
                <span class='close'>&times;</span>    
            </div>
            <ul>#lis#</ul>
        `;
        
        let makeItemsHtml = _self.getMakeItemsHtml(data.black, data.top);
        html = html.replace('#lis#', makeItemsHtml);

        let selectedMake = _self.getSelectedMake(data);
        if (selectedMake.idMake.toString() === _self.defaults.idMake) {
            $("#make .img-wrapper div").attr('class', '');
            $("#make").addClass('noimg');
        } else {
            $("#make .img-wrapper div").attr('class', 'logo-make logo-make-' + selectedMake.idMake);
            $("#make").removeClass('noimg');
        }

        $("#make label").html(selectedMake.name);
        var makeCount = selectedMake.displayCount !== null ? "(" + selectedMake.displayCount + ")" : '';
        $("#make span").html(makeCount);
        return { html, selectedMake };
    },
    loadData: function (options) {
        var _self = this;
        $.getJSONData(_self.serviceUrls.SERVICE_QS_ELEMENTS, _self.getQSParams(), function (data) {
            _self.cached = data;
            $("#results-count").html(data.count);
            if (data.status === '0') {
                _self.updateSearchButton({enabled: false, url: 'javascript:void(0)'});
                _self.message = data.message;
                _self.showMessage();
            } else if (data.status === '-1') { //invalid zipcode
                _self.updateSearchButton({enabled: false, url: 'javascript:void(0)'});
                _self.message = data.message;
                _self.showMessage();
                if (options && options.callback) {
                    options.callback.call();
                }
                return;
            } else {
                _self.updateSearchButton({enabled: true, url: data.url});
                _self.updateFieldsVisibility(options);
            }

            var selected, html = new StringBuilder();
            //idMakeS
//            html.clear();
//            html.append(_self.getDefaultOptionTag(_self.defaults.idMake, data.makeLabel));
//            $.each(data.makes.top, function (index, value) {
//                selected = _self.paramMap.idMake === value.idMake.toString() ? "selected" : "";
//                html.append("<option value='" + value.idMake + "' " + selected + ">" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
//            });
//            html.append("<option disabled='disabled'>-------------------</option>");
//            $.each(data.makes.black, function (index, value) {
//                selected = _self.paramMap.idMake === value.idMake.toString() ? "selected" : "";
//                html.append("<option value='" + value.idMake + "' " + selected + ">" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
//            });
//            html.append("<option disabled='disabled'></option>");
//            $("#make").html(html.toString());

            var html = new StringBuilder();
            
            let makesDropdownHTML = _self.getMakesDropdownHTML(data.makes);
            $("#make-dropdown").html(makesDropdownHTML.html);
            
            //idModel
//            html.clear();
//            html.append(_self.getDefaultOptionTag(_self.defaults.idModel, data.modelLabel));
//            if (data.models.black) {
//                $.each(data.models.black, function (index, value) {
//                    selected = _self.paramMap.idModel === value.idModel.toString() ? "selected" : "";
//                    html.append("<option value='" + value.idModel + "' " + selected + ">" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
//                });
//            }
//            if (data.models.grey) {
//                $.each(data.models.grey, function (index, value) {
//                    selected = _self.paramMap.idModel === value.idModel.toString() ? "selected" : "";
//                    html.append("<option disabled='disabled' value='" + value.idModel + "' " + selected + ">" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
//                });
//            }
//            html.append("<option disabled='disabled'></option>");
//            $("#model").html(html.toString());
            
            html.clear();
            var modelLI = "<li data-id='#id#'><label>#name#</label><span>#count#</span></li>";
            html.append("<div class='heading'><h3>").append(OYO.labels.model).append("</h3><span class='close'>&times;</span></div><ul class='mb-70'>");
            html.append(modelLI
                    .replace('#id#', _self.defaults.idModel)
                    .replace('#name#', makesDropdownHTML.selectedMake.name)
                    .replace('#count#', ''));
            var selectedModel = {idModel: _self.defaults.idModel, name: data.modelLabel, displayCount: null};
            var setLI = function (value) {
                if (_self.paramMap.idModel === value.idModel.toString()) {
                    selectedModel = {idModel: value.idModel, name: value.name, displayCount: value.displayCount};
                }

                html.append(modelLI
                        .replace('#id#', value.idModel)
                        .replace('#name#', value.name)
                        .replace('#count#', value.displayCount));
            }
            $.each(data.models.black, function (index, value) {
                setLI(value);
            });
            html.append("<li class='divider'></li>")
            $.each(data.models.grey, function (index, value) {
                setLI(value);
            });

            if (selectedModel.idModel.toString() === _self.defaults.idModel) {
                
                $("#model").addClass('noimg');
            } else {
                
                $("#model").removeClass('noimg');
            }

            $("#model label").html(selectedModel.name);
            var modelCount = selectedModel.displayCount !== null ? "(" + selectedModel.displayCount + ")" : '';
            $("#model span").html(modelCount);
            html.append("</ul>");
            $("#model-dropdown").html(html.toString());
            
            
            
            //PRICE TO
            html.clear();
            html.append(_self.getDefaultOptionTag(_self.defaults.priceTo, data.priceToLabel));
            if (data.pricesTo) {
                $.each(data.pricesTo, function (index, value) {
                    selected = _self.paramMap.priceTo === value.price.toString() ? "selected" : "";
                    html.append("<option value='" + value.price + "' " + selected + ">" + value.displayPrice + "</option>");
                });
            }
            html.append("<option disabled='disabled'></option>");
            $("#priceto").html(html.toString());
            //zipCode           
            if (data.zipCodeLabel) {
                OYO.labels.zipcode = data.zipCodeLabel;
            }
            if (_self.paramMap.zipCode) {
                $("#zipcode").val(_self.paramMap.zipCode);
            } else {
                if (_self.helpers.ZIPCODE_FOCUSED) {
                    $("#zipcode").val("");
                } else
                    $("#zipcode").val(OYO.labels.zipcode);
            }

            //radius
            var radius_option_tags = _self.qsHTML.radius.split("#lengthunit#").join(data.lengthunit);
            $("#radius").html(radius_option_tags);
            if (_self.paramMap.radius) {
                $("#radius").val(_self.paramMap.radius);
            }

            if (_self.paramMap.QS_TYPE === _self.qsTypes.ADVANCED) {

                //idTrim
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.idTrim, data.trimLabel));
                if (data.trims.black) {
                    $.each(data.trims.black, function (index, value) {
                        selected = _self.paramMap.idTrim === value.idTrim.toString() ? "selected" : "";
                        html.append("<option value='" + value.idTrim + "' " + selected + ">" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                    });
                }
                if (data.trims.grey) {
                    $.each(data.trims.grey, function (index, value) {
                        html.append("<option disabled='disabled' value='" + value.idTrim + "'>" + value.name + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#trim").html(html.toString());
                //PRICE FROM
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.priceFrom, data.fromLabel));
                $("#priceLabel").html(data.priceLabel);
                if (data.pricesFrom) {
                    $.each(data.pricesFrom, function (index, value) {
                        selected = _self.paramMap.priceFrom === value.price.toString() ? "selected" : "";
                        html.append("<option value='" + value.price + "' " + selected + ">" + value.displayPrice + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#pricefrom").html(html.toString());
                //YEAR FROM
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.yearFrom, data.fromLabel));
                $("#yearLabel").html(data.yearLabel);
                if (data.yearsFrom) {
                    var yearsFrom = OYO.utils.sortJSON(data.yearsFrom, {desc: true, byValue: true});
                    $.each(yearsFrom, function (index, value) {
                        selected = _self.paramMap.yearFrom === value.toString() ? "selected" : "";
                        html.append("<option value='" + value + "' " + selected + ">" + value + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#yearfrom").html(html.toString());
                //YEAR TO
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.yearTo, data.yearToLabel));
                if (data.yearsTo) {
                    var yearsTo = OYO.utils.sortJSON(data.yearsTo, {desc: true, byValue: true});
                    $.each(yearsTo, function (index, value) {
                        selected = _self.paramMap.yearTo === value.toString() ? "selected" : "";
                        html.append("<option value='" + value + "' " + selected + ">" + value + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#yearto").html(html.toString());
                //MILEAGE FROM
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.mileageFrom, data.fromLabel));
                $("#mileageLabel").html(data.mileageLabel);
                if (data.mileagesFrom) {
                    $.each(data.mileagesFrom, function (index, value) {
                        selected = _self.paramMap.mileageFrom === value.mileage.toString() ? "selected" : "";
                        html.append("<option value='" + value.mileage + "' " + selected + ">" + value.displayMileage + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#mileagefrom").html(html.toString());
                //MILEAGE TO
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.mileageTo, data.mileageToLabel));
                if (data.mileagesTo) {
                    $.each(data.mileagesTo, function (index, value) {
                        selected = _self.paramMap.mileageTo === value.mileage.toString() ? "selected" : "";
                        html.append("<option value='" + value.mileage + "' " + selected + ">" + value.displayMileage + "</option>");
                    });
                }
                html.append("<option disabled='disabled'></option>");
                $("#mileageto").html(html.toString());
                //idBodytype
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.idBodytype, data.bodytypeLabel));
                $.each(data.bodytypes, function (index, value) {
                    selected = _self.paramMap.idBodytype === value.idBodytype.toString() ? "selected" : "";
                    html.append("<option value='" + value.idBodytype + "' " + selected + ">" + value.displayBodytype + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                });
                html.append("<option disabled='disabled'></option>");
                $("#bodytype").html(html.toString());
                //idTransmission
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.idTransmission, OYO.labels.transmission));
                $.each(data.transmissions, function (index, value) {
                    selected = _self.paramMap.idTransmission === value.idTransmission.toString() ? "selected" : "";
                    html.append("<option value='" + value.idTransmission + "' " + selected + ">" + value.displayName + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                });
                html.append("<option disabled='disabled'></option>");
                $("#transmission").html(html.toString());
                //idColor
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.idColor, OYO.labels.color));
                $.each(data.colors, function (index, value) {
                    selected = _self.paramMap.idColor === value.idColor.toString() ? "selected" : "";
                    html.append("<option value='" + value.idColor + "' " + selected + ">" + value.displayName + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                });
                html.append("<option disabled='disabled'></option>");
                $("#color").html(html.toString());
                //idFueltype
                html.clear();
                html.append(_self.getDefaultOptionTag(_self.defaults.idFueltype, data.fueltypeLabel));
                $.each(data.fueltypes, function (index, value) {
                    selected = _self.paramMap.idFueltype === value.idFueltype.toString() ? "selected" : "";
                    html.append("<option value='" + value.idFueltype + "' " + selected + ">" + value.displayFueltype + " &nbsp;&nbsp;(" + value.displayCount + ")" + "</option>");
                });
                html.append("<option disabled='disabled'></option>");
                $("#fueltype").html(html.toString());
            }
            if (data.status === '1') {
                _self.updateBodytypeCollectionView(data.bodytypes);
                _self.updateTransmissionCollectionView(data.transmissions);
                _self.updateColorCollectionView(data.colors);
            }
            if (!_self.rangesSet && data.status === '1') {
                _self.initRangeSliders(data);
                _self.rangesSet = true;
            }
            _self.doHackForNewCars();
            if (options && options.callback) {
                options.callback.call();
            }
        });
    },
    isNew: function () {
        return this.paramMap.isNew.toString() === "1";
    },
    switchQS: function () {
        if ($("#qs-mobile-switch").hasClass("_expanded")) {
            $("#qs-mobile-switch").html(OYO.labels.advancedSearch).removeClass("_expanded");
            $(".hidden-fields").slideToggle(300);
        } else {
            $("#qs-mobile-switch").html(OYO.labels.quickSearch).addClass("_expanded");
            $(".hidden-fields").slideToggle(300);
        }
//        $('html, body').animate({
//            scrollTop: $("body").offset().top
//        }, 500);
        return false;
    },
    loadQSHTML: function (options) {
        var _self = this;
        _self.loadData({
            callback: function () {
                if (_self.helpers.REFINED) {
                    _self.switchQS();
                }
                if (options && options.additionalJob) {
                    options.additionalJob();
                }
            }
        });
    },
    updateSearchButton: function (options) {
        $("#search-button").attr("href", options.url);
        if (options.enabled) {
            this.searchButtonEnabled = true;
            $("#search-button").removeClass("dsbld");
        } else {
            this.searchButtonEnabled = false;
            $("#search-button").addClass("dsbld");
        }
    },
    updateFieldsVisibility: function (options) {
        if (this.paramMap.idMake) {
            $("#model-wrap").removeClass("hidden");
        } else {
            $("#model-wrap").addClass("hidden");
        }
        if (this.paramMap.idModel) {
            $("#trim-wrap").removeClass("hidden");
        } else {
            $("#trim-wrap").addClass("hidden");
        }
    },
    getDefaultOptionTag: function (value, text) {
        return "<option value='" + value + "'>" + text + "</option>";
    },
    enable: function (options) {
        $.each(options.what, function (key, value) {
            $("#" + value + "-wrap").removeClass("disabled");
            $("#" + value).removeAttr("disabled");
        });
    },
    disable: function (options) {
        $.each(options.what, function (key, value) {
            $("#" + value + "-wrap").addClass("disabled");
            $("#" + value).attr("disabled", "disabled");
        });
    },
    doHackForNewCars: function () {
        if (this.isNew()) {
            if (this.paramMap.idModel) {
                this.disable({what: ["pricefrom", "priceto", "bodytype"]});
            } else {
                this.enable({what: ["pricefrom", "priceto", "bodytype"]});
            }
        }
    },
    setSwitcherLabel: function () {
        if (this.paramMap.QS_TYPE === this.qsTypes.BASIC) {
            $('#qs-switch').html(OYO.labels.advancedSearch);
        } else if (this.paramMap.QS_TYPE === this.qsTypes.ADVANCED) {
            $('#qs-switch').html(OYO.labels.quickSearch);
        }
    },
    addCountries: function (page) {
        var country = OYO.appParams.idCountry;
        var html = new StringBuilder();
        OYO.countryConnector.getCountries(page, function (data) {
            var inverted = OYO.utils.invertJSON(data, {inner: "title"});
            var sortedByTitle = OYO.utils.sortJSON(inverted, {datatype: "string"});

            var countryLI = "<li data-url='#url#' data-id='#id#'><div class='dd-img flag-round flag-round-#imgid#'></div><label class='withimg'>#name#</label><span>#count#</span></li>";
            html.append("<div class='heading'><h3>").append(OYO.labels.country).append("</h3><span class='close'>&times;</span></div><ul class='mb-70'>");
            $.each(sortedByTitle, function (index, value) {
                if (country.toString() === inverted[value].toString()) {
                    $("#country .img-wrapper div").attr('class', 'flag-round flag-round-' + country);
                    $("#country label").html(value);
                    $("#country span").html("(" + data[inverted[value]].displayCount + ")");
                }
                html.append(countryLI
                        .replace('#imgid#', inverted[value])
                        .replace("#id#", inverted[value])
                        .replace('#url#', data[inverted[value]].url)
                        .replace('#name#', value)
                        .replace('#count#', data[inverted[value]].displayCount));
            });
            //html.append("<li class='more-countries' data-url='" + OYO.URLs.androidCountries + "'>" + OYO.labels.moreCountries + "</li>");
            html.append("</ul>");
            $("#country-dropdown").html(html.toString());
        });
    },
    addCountryDropdown: function () {
        var countryDropdown = new Dropdown('#country', '#country-dropdown');
        countryDropdown.doOnItemSelected = function (li) {
            $("#country .img-wrapper div").attr('class', 'flag-round flag-round-' + li.data('id'));
            $("#country label").html(li.find('label').text());
            $("#country span").html("(" + li.find('span').text() + ")");
            OYO.utils.lockScreen();
            OYO.utils.gotoPage({url: li.data('url'), encoded: false});
        };
    },
    addMakeDropdown: function () {
        var _self = this;
        var makeDropdown = new Dropdown('#make', '#make-dropdown');
        makeDropdown.doBeforeOpening = function(){
            $('#make-dropdown input')[0].focus();
        };
        makeDropdown.doOnFilter = function ($input, e){
            let value = $input.val();
            let html;
            if(value === ""){
                html = _self.getMakeItemsHtml(_self.cached.makes.black, _self.cached.makes.top);
            }else{
                let filtered = _self.cached.makes.black.filter(make => make.name.toLowerCase().startsWith(value));
                html = _self.getMakeItemsHtml(filtered);
            }
            $('#make-dropdown ul').html(html);
        };
        makeDropdown.doOnItemSelected = function (li) {
            Stat.countQSElementsUsage("make-dd");
            if (li.hasClass('divider')) {
                return;
            }

            $("#make label").html(li.find('label').text());
            var c = li.find('span').text();
            var makeCount = c !== '' ? "(" + c + ")" : '';
            $("#make span").html(makeCount);
            var idMake = li.data('id');
            if (idMake.toString() === _self.defaults.idMake) {
                $("#make .img-wrapper div").attr('class', '');
                $("#make").addClass('noimg');
            } else {
                $("#make .img-wrapper div").attr('class', 'logo-make logo-make-' + idMake);
                $("#make").removeClass('noimg');
            }

            _self.change({
                prepareParams: function () {
                    if (idMake.toString() !== _self.defaults.idMake) {
                        _self.paramMap.idMake = idMake.toString();
                    } else {
                        delete _self.paramMap.idMake;
                    }
                    delete _self.paramMap.idModel;
                    delete _self.paramMap.idTrim;
                }
            });
        };
        
    },
    addModelDropdown: function () {
        var _self = this;
        var modelDropdown = new Dropdown('#model', '#model-dropdown');
        modelDropdown.doOnItemSelected = function (li) {
            Stat.countQSElementsUsage("model-dd");
            if (li.hasClass('divider')) {
                return;
            }

            $("#model label").html(li.find('label').text());
            var c = li.find('span').text();
            var modelCount = c !== '' ? "(" + c + ")" : '';
            $("#model span").html(modelCount);
            var idModel = li.data('id');
            if (idModel.toString() === _self.defaults.idModel) {
                $("#model .img-wrapper div").attr('class', '');
                $("#model").addClass('noimg');
            } else {
                $("#model .img-wrapper div").attr('class', 'logo-model logo-model-' + idModel);
                $("#model").removeClass('noimg');
            }

            _self.change({
                prepareParams: function () {
                    if (idModel.toString() !== _self.defaults.idModel) {
                        _self.paramMap.idModel = idModel.toString();
                    } else {
                        delete _self.paramMap.idModel;
                    }
                    delete _self.paramMap.idTrim;
                }
            });
        };
    },
    addFixedSearchBtn: function () {
        if (OYO.utils.res.isMobile()) {
            $("#qs").addClass("fixed-search-button");
        }
        $(window).scroll(function () {
            if (OYO.utils.res.isMobile()) {
                var x = $("#qs").outerHeight(true) - $(document).scrollTop() - $(window).height() + $("#qs-sbh").outerHeight(true);
                if (x > -14) {
                    $("#qs").addClass("fixed-search-button");
                } else {
                    $("#qs").removeClass("fixed-search-button");
                }
            }
        });
    },
    getSavedSearchRelevantParams: function(params = this.paramMap){
        
        let ret = {};
        
        if (params.idMake) {
            ret.idMake = params.idMake;
        }
        if (params.idModel) {
            ret.idModel = params.idModel;
        }
        if (params.idTrim) {
            ret.idTrim = params.idTrim;
        }
        if (params.priceFrom) {
            ret.priceFrom = params.priceFrom;
        }
        if (params.priceTo) {
            ret.priceTo = params.priceTo;
        }
        if (params.yearFrom) {
            ret.yearFrom = params.yearFrom;
        }
        if (params.yearTo) {
            ret.yearTo = params.yearTo;
        }
        if (params.mileageFrom) {
            ret.mileageFrom = params.mileageFrom;
        }
        if (params.mileageTo) {
            ret.mileageTo = params.mileageTo;
        }
        if (params.idBodytype) {
            ret.idBodytype = params.idBodytype;
        }
        if (params.idFueltype) {
            ret.idFueltype = params.idFueltype;
        }
        if (params.zipCode) {
            ret.zipCode = params.zipCode;
        }
        if (params.radius) {
            ret.radius = params.radius;
        }
        if (params.idTransmission) {
            ret.idTransmission = params.idTransmission;
        }
        if (params.idColor) {
            ret.idColor = params.idColor;
        }
        return ret;
    
    },
    shouldSaveSearch: function(){
        let params = this.getSavedSearchRelevantParams();
        let keys = Object.keys(params).sort();
        let paramsStr = "";
        keys.forEach((k, v) => {
            paramsStr += `${k}=${params[k]}&`;
        });
        if(keys.length > 0){
            let key = paramsStr;
            return !this.savedSearches[key];
        }else { 
            return false; 
        }
    },
    saveSearch: function(){
        let params = this.getSavedSearchRelevantParams();
        let keys = Object.keys(params).sort();
        let paramsStr = "";
        keys.forEach(k => {
            paramsStr += `${k}=${params[k]}&`;
        });
        let savedSearchesSize = Object.keys(this.savedSearches).length;
        if(savedSearchesSize < 10){
            if(keys.length > 0){
                let key = paramsStr;
                let label = this.getSearchLabel(params);
                new Prompt(OYO.labels.enterNameForThisSearch, {
                    onConfirm: value => {
                        if(value.trim() !== ""){
                            label = value;
                        }
                        this.savedSearches[key] = label;
                        OYO.utils.storage.set('saved-searches', this.savedSearches);    
                        this.renderSearchDropdown();
                        this.renderSearchHistoryButtons();
                        this.showSearchSavedSuccessInfo();
                    },
                    defaultValue: label
                }).show();
            }
        }else{
            new Toast(OYO.labels.saveUpToLimitSearches.replace('{NUM}', 10)).show();
        }
    },
    showSearchSavedSuccessInfo: function(){
        $('#load-search .badge').remove();
        $('#load-search').append(`<span class="badge">+1</span>`);
        setTimeout(() => {
            $('#load-search .badge').addClass('badge-fade-in');
            setTimeout(() => {
                $('#load-search .badge').addClass('badge-move-up');
            }, 1500);
        }, 10);
    },
    getSearchLabel: function(params){
        let ret = new StringBuilder();
        if (params.idMake) {
            let makes = this.cached.makes.black;
            for(let i=0; i<makes.length; i++){
                if(makes[i].idMake == params.idMake){
                    ret.append(makes[i].name);
                    break;
                }
            }
        }
        if (params.idModel) {
            let models = this.cached.models.black;
            for(let i=0; i<models.length; i++){
                if(models[i].idModel == params.idModel){
                    ret.append(" ");
                    ret.append(models[i].name);
                    break;
                }
            }
        }
        if (params.idTrim) {
            let trims = this.cached.trims.black;
            for(let i=0; i<trims.length; i++){
                if(trims[i].idTrim == params.idTrim){
                    ret.append(" ");
                    ret.append(trims[i].name);
                    break;
                }
            }
        }
        
        
        if (params.idBodytype) {
            let bodytypes = this.cached.bodytypes;
            for(let i=0; i<bodytypes.length; i++){
                if(bodytypes[i].idBodytype == params.idBodytype){
                    ret.append(" ").append(bodytypes[i].displayBodytype);
                    break;
                }
            }
        }
        if (params.idFueltype) {
            let fueltypes = this.cached.fueltypes;
            for(let i=0; i<fueltypes.length; i++){
                if(fueltypes[i].idFueltype == params.idFueltype){
                    ret.append(" ").append(fueltypes[i].displayFueltype);
                    break;
                }
            }
        }
        
        if (params.idTransmission) {
            let transmissions = this.cached.transmissions;
            for(let i=0; i<transmissions.length; i++){
                if(transmissions[i].idTransmission == params.idTransmission){
                    ret.append(" ").append(transmissions[i].displayName);
                    break;
                }
            }
        }
        
        if (params.zipCode) {
            ret.append(" | ").append(OYO.labels.zipcode);
            ret.append(" ").append(params.zipCode);
            let radius = $("#radius :selected").text().replace(" ", "");
            ret.append(" ").append(radius);
        }
        
        if (params.priceFrom || params.priceTo) {
            ret.append(" | ").append(OYO.labels.price);
            if (params.priceFrom) {
                ret.append(" ").append(OYO.labels.from);
                ret.append(" ").append(this.cached.pricesFrom[params.priceFrom].displayPrice);
            }
            if (params.priceTo) {
                ret.append(" ").append(OYO.labels.to);
                ret.append(" ").append(this.cached.pricesTo[params.priceTo].displayPrice);
            }
        }
        
        if (params.yearFrom || params.yearTo) {
            ret.append(" | ").append(OYO.labels.year);
            if (params.yearFrom) {
                ret.append(" ").append(OYO.labels.from);
                ret.append(" ").append(params.yearFrom);
            }
            if (params.yearTo) {
                ret.append(" ").append(OYO.labels.to);
                ret.append(" ").append(params.yearTo);
            }
        }
        
        if (params.mileageFrom || params.mileageTo) {
            ret.append(" | ").append(OYO.labels.mileageLong);
            if (params.mileageFrom) {
                ret.append(" ").append(OYO.labels.from);
                ret.append(" ").append(this.cached.mileagesFrom[params.mileageFrom].displayMileage);
            }
            if (params.mileageTo) {
                ret.append(" ").append(OYO.labels.to);
                ret.append(" ").append(this.cached.mileagesTo[params.mileageTo].displayMileage);
            }
        }
        let str = ret.toString();
        
        if(str.startsWith(" | ")){
            return str.slice(3);
        }else {
            return str;
        }
    },
    deleteSearch: function(key, $li){
        new Confirm(OYO.labels.deleteThisSearch, {
            onConfirm: () => {
                delete this.savedSearches[key];
                OYO.utils.storage.set('saved-searches', this.savedSearches);
                $li.addClass('deleted');
                setTimeout(() => {
                    this.renderSearchHistoryButtons(); 
                    this.renderSearchDropdown();    
                }, 700);
            }
        }).show();
    },
    loadSavedSearchParams: function(paramsStr){
        let self = this;
        let params = {};
        let paramsArr = paramsStr.split('&');
        paramsArr.forEach(str => {
            if(str){
                let strArr = str.split('=');
                let paramName = strArr[0];
                let paramValue = strArr[1];
                params[paramName] = paramValue;
            }
        });
        self.deleteParams();
        self.paramMap = {...self.paramMap, ...params};
        
        if(OYO.Other.qsHasZip == "0"){
            delete self.paramMap.zipCode;
        }
        
        self.change({});
    },
    renderSearchHistoryButtons: function(){
        
        if(this.shouldSaveSearch()){
            $(".btn-save-search").removeAttr('disabled');
        }else{
            $(".btn-save-search").attr('disabled', 'disabled');
        }
        
        if(Object.keys(this.savedSearches).length === 0){
            $("#load-search").attr('disabled', 'disabled');
        }else{
            $("#load-search").removeAttr('disabled');
        }
    },
    initSavedSearches: function(){
        let data = OYO.utils.storage.getJSON('saved-searches');
        if(data){
            this.savedSearches = data;
        }else{
            this.savedSearches = {};
        }
    },
    addSavedSearchesDropdown: function () {
        var _self = this;
        var searchDropdown = new Dropdown('#load-search', '#search-dropdown');
        searchDropdown.doOnItemSelected = function (li) {
            let label = li.find('label').text();
            let paramsStr = li.data('params');
            $("#load-search label").html(label);
            _self.loadSavedSearchParams(paramsStr);
        };
        _self.renderSearchDropdown();
    },
    renderSearchDropdown: function(){
        var _self = this;
        var html = new StringBuilder();
        html.append("<div class='heading'><h3>").append(OYO.labels.savedSearches).append("</h3><span class='close'>&times;</span></div><ul>");
        let items = _self.getSearchDropdownItems();
        html.append(items).append("</ul>");
        $("#search-dropdown").html(html.toString());
        $("#load-search label").html(OYO.labels.savedSearches);
    },
    getSearchDropdownItems: function(){
        let html = [];
        let makeLI = "<li data-params='#params#' class='bb'><label>#label#</label><span class='pull-right oicon black ic_trash mr10'></span></li>";
        let setLI = function (paramsStr, label) {
            html.unshift(makeLI
                    .replace('#params#', paramsStr)
                    .replace('#label#', label));
        };
        Object.keys(this.savedSearches).forEach(k => {
            setLI(k, this.savedSearches[k]);
        });
        return html.join('');
    },
    resetSavedSearchesSelector: function(){
        $("#load-search label").html(OYO.labels.savedSearches);
    },
    init: function (options) {
        var self = this;
        self.initParamMap(options);
        self.paramMap.isNew = OYO.appParams.isNew;
        self.paramMap.QS_TYPE = this.qsTypes.ADVANCED;
        self.helpers.REFINED = !!(options.refined);
        self.helpers.RELOAD_ON_RESET = !!(options.reloadOnReset);
        self.assignEventHandlers();
        self.addCountries(options.page);
        self.addCountryDropdown();
        self.addMakeDropdown();
        self.addModelDropdown();
        self.loadQSHTML();
        self.setSwitcherLabel();
        self.initSavedSearches();
        self.addSavedSearchesDropdown();
        self.renderSearchHistoryButtons();
        if (options.additionalFunctionality) {
            options.additionalFunctionality.call();
        }
        return self;
    }
};

//export class QuickSearch {
//    static create(){
//        return quickSearch;    
//    }
//};
