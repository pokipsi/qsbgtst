import { messageBox } from '../message-box.js';
//import { Utils } from '../utils/utils.js';

import { Stat } from "../stat.js";

OYO = OYO || {};
//OYO.utils = Utils.create();

function FHC() {
    var _self = this;
    var types = {
        favorite: 'favorite',
        history: 'history',
        compare: 'compare'
    },
            serviceURL = '/ooyyo-services/resources/cars/feature',
            flags = {compareBlocked: false},
            settings = (function () {
                var sett = {};
                var max = {};
                max[types.favorite] = 5;
                max[types.history] = 5;
                max[types.compare] = 5;
                sett.max = max;
                return sett;
            }()),
            cache = {
                history: [],
                favorite: [],
                compare: []
            },
            getItem = function (params) {
                var ret,
                        idRecord = params.idRecord,
                        idCountry = params.idCountry,
                        isNew = params.isNew || 0,
                        dateCreated = params.dateCreated || (new Date()).getTime();
                ret = {
                    idRecord: idRecord,
                    idCountry: idCountry,
                    isNew: isNew,
                    dateCreated: dateCreated.toString()
                };
                return ret;
            };
    _self.cookieContent = {};
    _self.cookieContent[OYO.cookieNames.history] = [];
    _self.cookieContent[OYO.cookieNames.favorite] = [];
    _self.cookieContent[OYO.cookieNames.compare] = [];
    _self.getTypes = function () {
        return types;
    };
    _self.getCache = function () {
        return cache;
    };
    _self.getSettings = function () {
        return settings;
    };
    _self.controller = {
        removeItemFromCookie: function (idRecord, fhcType) {
            Stat.countFHCUpdate({
                fhcType: fhcType
            });
            //delete item from collection stored in cookie
            var cookieValue,
                    cookieName = OYO.cookieNames[fhcType];
            if (cookieName) {
                cookieValue = OYO.utils.storage.getJSON(cookieName);
                if (cookieValue) {
                    for (var i = 0; i < cookieValue.length; i++) {
                        if (cookieValue[i].idRecord.toString() === idRecord.toString()) {
                            cookieValue.splice(i, 1);
                            break;
                        }
                    }
                    OYO.utils.storage.set(cookieName, cookieValue);
                    _self.cookieContent[cookieName] = cookieValue;
                    $(document).trigger('fhc-updated', [fhcType]);
                }
            }
        },
        createCookieItemsFromCars: function (cars) {
            var items = [];
            $.each(cars, function (key, value) {
                items.push(getItem({
                    idRecord: value.record,
                    idCountry: value.idCountry.toString(),
                    isNew: value.isNew.toString()
                }));
            });
            return items;
        },
        updateCookie: function (options, collection) {
            var cookieName = options.cookieName,
                    cookieValues = this.createCookieItemsFromCars(collection);
            OYO.utils.storage.set(cookieName, cookieValues);
            _self.cookieContent[cookieName] = cookieValues;
        },
        resolveCars: function (fhcType, callback) {
            var _self = this,
                    cookieName = OYO.cookieNames[fhcType],
                    params,
                    cookieParams;
            if (cookieName) {
                params = {
                    cookie_params: {},
                    page_params: OYO.utils.getParams()
                };
                cookieParams = OYO.utils.storage.getJSON(cookieName);
                if (cookieParams) {
                    params.cookie_params = cookieParams;
                    $.getJSONData(serviceURL, params, function (data) {
                        if (data.cars === null) {
                            data.cars = {};
                        }
                        _self.updateCookie({cookieName: cookieName}, data.cars);
                        cache[fhcType] = data.cars;
                        if (callback) {
                            callback();
                        }
                    });
                } else {
                    _self.updateCookie({cookieName: cookieName}, []);
                }
            }
        },
        isExisting: function (record, cookieName) {
            var cookieValue = OYO.utils.storage.getJSON(cookieName) || [];
            var ret = false;
            $.each(cookieValue, function (key, value) {
                if (value.idRecord.toString() === record.toString()) {
                    ret = true;
                    return false;
                }
            });
            return ret;
        },
        addTo: function (options) {
            Stat.countFHCUpdate({
                fhcType: options.type
            });
            var success = false,
                    cookieName = OYO.cookieNames[options.type],
                    idRecord = options.idRecord,
                    idCountry = options.idCountry,
                    isNew = options.isNew,
                    itemToAdd = getItem({
                        idRecord: idRecord,
                        idCountry: idCountry,
                        isNew: isNew
                    }),
                    cookieValue = OYO.utils.storage.getJSON(cookieName) || [];

            if (cookieName === OYO.cookieNames.history) {
                this.removeItemByRecord(cookieValue, idRecord);
                if (cookieValue.length === settings.max[types.history]) {
                    cookieValue.pop();
                }
                cookieValue.unshift(itemToAdd);
                OYO.utils.storage.set(cookieName, cookieValue);
                success = true;
            }
            if (cookieName === OYO.cookieNames.favorite) {
                this.removeItemByRecord(cookieValue, idRecord);
                if (cookieValue.length === settings.max[types.favorite]) {
                    messageBox.show({
                        text: OYO.labels.favoritesFull
                    });
                } else {
                    cookieValue.unshift(itemToAdd);
                    OYO.utils.storage.set(cookieName, cookieValue);
                    success = true;
                }
            }
            if (cookieName === OYO.cookieNames.compare) {
                this.removeItemByRecord(cookieValue, idRecord);
                if (cookieValue.length === settings.max[types.compare]) {
                    messageBox.show({
                        text: OYO.labels.compareFull
                    });
                } else {
                    cookieValue.unshift(itemToAdd);
                    OYO.utils.storage.set(cookieName, cookieValue);
                    success = true;
                }
            }
            if (success) {
                $(document).trigger('fhc-updated', [options.type]);
            }
            return success;
        },
        removeItemByRecord: function (cookieValue, idRecord) {
            if (cookieValue) {
                for (var i = 0; i < cookieValue.length; i++) {
                    var value = cookieValue[i];
                    if (value.idRecord.toString() === idRecord.toString()) {
                        cookieValue.splice(i, 1);
                        return false;
                    }
                }
            }
        },
        getItemByIDRecordFromCookieValue: function (cookieValue, idRecord) {
            var ret;
            $.each(cookieValue, function (key, value) {
                if (value.idRecord.toString() === idRecord.toString()) {
                    ret = value;
                    return false;
                }
            });
            return ret;
        },
        getItemByIDRecord: function (cookieName, idRecord) {
            var cookieValue = _self.cookieContent[cookieName];
            if (cookieValue) {
                return this.getItemByIDRecordFromCookieValue(cookieValue, idRecord);
            }
        }
    };
    _self.compareCookieValues = function (cookieValue1, cookieValue2) {
        var flag = cookieValue1.length === cookieValue2.length;
        if (flag) {
            var lngth = cookieValue1.length;
            for (var i = 0; i < lngth; i++) {
                flag = flag && this.compareItems(cookieValue1[i], cookieValue2[i]);
            }
        }
        return flag;
    };
    _self.compareItems = function (item1, item2) {
        var flag = false;
        if (item1.idRecord.toString() === item2.idRecord.toString()) {
            if (item1.idCountry.toString() === item2.idCountry.toString()) {
                if (item1.isNew.toString() === item2.isNew.toString()) {
                    flag = true;
                }
            }
        }
        return flag;
    };
    _self.doOnClickFavorite = function (options, e) {
        var idRecord = options.idRecord,
                idCountry = options.idCountry,
                isNew = options.isNew,
                isFavorite = this.controller.isExisting(idRecord, OYO.cookieNames.favorite),
                removeClass = "blue",
                addClass = "white";
        if (isFavorite) {
            this.controller.removeItemFromCookie(idRecord, types.favorite);
        } else {
            var success = this.controller.addTo({
                type: types.favorite,
                idRecord: idRecord,
                idCountry: idCountry,
                isNew: isNew
            });
            if (success) {
                removeClass = "white";
                addClass = "blue";
            }
        }
        //sve zvezdice sa ovim idrecordom treba da update-ujem jer se negde dupliraju
        $(".favhook").each(function () {
            if ($(this).data("record").toString() === idRecord.toString()) {
                $(this).find(".fheart").removeClass(removeClass).addClass(addClass);
            }
        });
        e.stopPropagation();
        return false;
    };
    _self.doOnClickCompare = function (options, e) {
        var idRecord = options.idRecord,
                idCountry = options.idCountry,
                isNew = options.isNew,
                isCompare = this.controller.isExisting(idRecord, OYO.cookieNames.compare),
                action = "removeClass";
        if (isCompare) {
            this.controller.removeItemFromCookie(idRecord, types.compare);
        } else {
            var success = this.controller.addTo({
                type: types.compare,
                idRecord: idRecord,
                idCountry: idCountry,
                isNew: isNew
            });
            if (success) {
                action = "addClass";
            }
        }
        //sve cboxove sa ovim idrecordom treba da update-ujem jer se negde dupliraju
        $(".comphook").each(function () {
            if ($(this).data("record").toString() === idRecord.toString()) {
                $(this).find(".cbox")[action]("checked");
            }
        });
        e.stopPropagation();
        return false;
    };
    _self.assignEventHandlerForFavoriteRmv = function (favorite_list, hook) {
        var _self = this,
                idRecord,
                isFavorite;
        favorite_list.find(".rmv").on("click", function (e) {
            idRecord = $(this).data("record");
            isFavorite = _self.controller.isExisting(idRecord, OYO.cookieNames.favorite);
            if (isFavorite) {
                _self.controller.removeItemFromCookie(idRecord, types.favorite);
                $(this).fadeToggle({
                    complete: function () {
                        $(this).closest("li").remove();
                    }
                });
            }
            hook.each(function () {
                _self.updateFavHook($(this));
            });
            e.stopPropagation();
            return false;
        }).mousedown(function (e) {
            if (e.which === 1)
                e.stopPropagation();
        });
    };
    _self.markBestFields = function () {
        var comparison = {
            year: [],
            price: [],
            mileage: [],
            save: []
        };
        var items = _self.cookieContent[OYO.cookieNames.compare];
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                var value = OYO.fhc.getCache().compare[items[i].idRecord];
                if (value) {
                    //create structure that will be used for comparison - marking fields
                    comparison.price.push({value: value.price, id: value.record});
                    comparison.year.push({value: value.year, id: value.record});
                    if (value.mileage && value.mileage !== -1) {
                        comparison.mileage.push({value: value.mileage, id: value.record});
                    }
                    if (value.savePercent) {
                        comparison.save.push({value: parseFloat(value.savePercent), id: value.record});
                    }
                }
            }
        }

        $(".compare-box .best").each(function () {
            $(this).removeClass("best");
        });

        comparison.price.sort(function (a, b) {
            return a.value - b.value;
        });
        var bestPrices = [];
        var currentPrice = Math.pow(2, 32) - 1;
        $.each(comparison.price, function (k, v) {
            if (v.value > currentPrice) {
                return;
            } else {
                bestPrices.push(v.id);
                currentPrice = v.value;
            }
        });
        $.each(bestPrices, function (k, v) {
            $(".compare-box ._js-car-id-" + v).find('._price').addClass('best');
        });

        comparison.mileage.sort(function (a, b) {
            return a.value - b.value;
        });
        var bestMileages = [];
        var currentMileage = Math.pow(2, 32) - 1;
        $.each(comparison.mileage, function (k, v) {
            if (v.value > currentMileage) {
                return;
            } else {
                bestMileages.push(v.id);
                currentMileage = v.value;
            }
        });
        $.each(bestMileages, function (k, v) {
            $(".compare-box ._js-car-id-" + v).find('._mileage').addClass('best');
        });

        comparison.year.sort(function (a, b) {
            return b.value - a.value;
        });
        var bestYears = [];
        var currentYear = 0;
        $.each(comparison.year, function (k, v) {
            if (v.value < currentYear) {
                return;
            } else {
                bestYears.push(v.id);
                currentYear = v.value;
            }
        });
        $.each(bestYears, function (k, v) {
            $(".compare-box ._js-car-id-" + v).find('._year').addClass('best');
        });

        comparison.save.sort(function (a, b) {
            return b.value - a.value;
        });
        var bestSaves = [];
        var currentSave = 0;
        $.each(comparison.save, function (k, v) {
            if (v.value < currentSave) {
                return;
            } else {
                bestSaves.push(v.id);
                currentSave = v.value;
            }
        });
        $.each(bestSaves, function (k, v) {
            $(".compare-box ._js-car-id-" + v).find('._save').addClass('best');
        });
    };
    _self.assignEventHandlerForCompareRmv = function (hook) {
        var _self = this,
                x,
                idRecord,
                isCompare;
        $('.compare-box .remove').click(function (e) {
            idRecord = $(this).data("record");
            if (!flags.compareBlocked) {
                flags.compareBlocked = true;
                x = 0;
                for (var i = 0; i < $(".compare-box").find(".content").length; i++) {
                    if ($($(".compare-box").find(".remove")[i + 1]).data("record") === idRecord) {
                        x = i;
                    }
                }
                isCompare = _self.controller.isExisting(idRecord, OYO.cookieNames.compare);
                if (isCompare) {
                    _self.controller.removeItemFromCookie(idRecord, types.compare);
                    for (var i = x; i < $(".compare-box").find(".content").length; i++) {
                        var ul = $($(".compare-box").find(".content")[i + 1]).find("ul")[0];
                        $($(".compare-box").find(".content")[i]).find("ul").remove();
                        if (ul) {
                            $($(".compare-box").find(".content")[i]).append(ul);
                        }
                    }
                }
                hook.each(function () {
                    _self.updateCompHook($(this));
                });
                _self.markBestFields();
                flags.compareBlocked = false;
            }
            e.stopPropagation();
            return false;
        });
    };
    _self.updateFavHook = function (hook) {
        var idRecord = hook.data("record"),
                isFavorite = this.controller.isExisting(idRecord, OYO.cookieNames.favorite),
                star = hook.find(".fheart");
        if (isFavorite) {
            star.removeClass("white").addClass("blue");
        } else {
            star.removeClass("blue").addClass("white");
        }
    };
    _self.updateCompHook = function (hook) {
        var idRecord = hook.data("record"),
                isCompare = this.controller.isExisting(idRecord, OYO.cookieNames.compare),
                cbox = hook.find(".cbox");
        if (isCompare) {
            cbox.addClass("checked");
        } else {
            cbox.removeClass("checked");
        }
    };
}


export class FHCFactory{
    static create(){
        return new FHC();
    }
}
