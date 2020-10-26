//import { Utils } from '../utils/utils.js';
OYO = OYO || {};
//OYO.utils = Utils.create();

import { StringBuilder } from '../../utils/string-builder.js';
import { Popup } from '../popup.js';
import { FHCFactory } from './fhc.js';
OYO.fhc = FHCFactory.create();

import { Stat } from "../stat.js";

/* 
 fhc = favorite, history, compare
 cookie value (N items): "r0,c0,isnew0,time0|r1,c1,isnew1,time1|...rN-1,cN-1,isnewN-1,timeN-1", N <= 5
 */

//OVDE POSTOJI PROBLEM OKO KONFLIKTA MOUSE OVER I MOUSE KLIKA

OYO.fhcDisplay = {
    duration: 200,
    init: function (what) {
        var fxs = {};
        var self = this;
        fxs[OYO.fhc.getTypes().favorite] = function () {
            var favoriteList = $("#favorite-selector").next(".list");
            var lastEventTimestamp = 0;
            $("#favorite-selector").addMouseTimeout({
                content: favoriteList,
                customFunctionality: function (e) {
                    lastEventTimestamp = e.timeStamp;
                    self.getFavoriteContent();
                }
            }).click(function (e) {
                var x = e.timeStamp - lastEventTimestamp;
                lastEventTimestamp = 0;
                if (x > 500) {
                    $(".history.list").slideUp(self.duration);
                    if ($(".favorite.list").css('display') !== 'none') {
                        $(".favorite.list").slideUp(self.duration, function () {
//                            $(document).trigger('topmenu-changed');
                        });
                    } else {
                        self.getFavoriteContent(function () {
                            $(".favorite.list").slideDown(self.duration, function () {
//                                $(document).trigger('topmenu-changed');
                            });
                        });
                    }
                }
                // e.stopPropagation();
            });
        };
        fxs[OYO.fhc.getTypes().history] = function () {
            var historyList = $("#history-selector").next(".list");
            var lastEventTimestamp = 0;
            $("#history-selector").addMouseTimeout({
                content: historyList,
                customFunctionality: function (e) {
                    lastEventTimestamp = e.timeStamp;
                    self.getHistoryContent();
                }
            }).click(function (e) {
                var x = e.timeStamp - lastEventTimestamp;
                lastEventTimestamp = 0;
                if (x > 500) {
                    $(".favorite.list").slideUp(self.duration);
                    if ($(".history.list").css('display') !== 'none') {
                        $(".history.list").slideUp(self.duration, function () {
//                            $(document).trigger('topmenu-changed');
                        });
                    } else {
                        self.getHistoryContent(function () {
                            $(".history.list").slideDown(self.duration, function () {
//                                $(document).trigger('topmenu-changed');
                            });
                        });
                    }
                }
                //e.stopPropagation();
            });
        };
        fxs[OYO.fhc.getTypes().compare] = function () {
            $("#compare-selector").click(function () {
                self.getCompareContent();
            });
        };
        for (var i = 0; i < what.length; i++) {
            fxs[what[i]]();
            self.displayCount(what[i]);
            setInterval((function (i) {
                return function () {
                    self.displayCount(what[i]);
                };
            })(i), 1000);
        }
    },
    getContent: function (fhcType, callback) {
        Stat.countFHCDisplay({ fhcType });
        //nacrtati listu sa spinnerom
        //prvo pozivanje je provera da li se COOKIE_CONTENT.xxxxxx razlikuje od cookie-a
        var spinner = "<li class='spinner'><img src='" + OYO.images.LOADING_2 + "' /></li>";
        var cookieName = OYO.cookieNames[fhcType];
        $(".list." + cookieName).find("ul").html(spinner);
        var cookieValue = OYO.utils.storage.getJSON(cookieName) || [];

        if (cookieValue.length === 0 || !OYO.fhc.compareCookieValues(cookieValue, OYO.fhc.cookieContent[cookieName])) {
            //zovi servis
            OYO.fhc.controller.resolveCars(fhcType, callback);
        } else {
            this.showList(fhcType);
        }
        //ako jeste treba pozvati servis, ako nije, treba uzeti podatke iz objekta CARS.xxxxxx
        //update-ovati COOKIE_CONTENT.xxxxxx
        //iscrtati podatke i skloniti spinner (spinner biva pregazen ostalim li tagovima)
    },
    showList: function (fhcType) {
        var self = this;
        if (fhcType === OYO.fhc.getTypes().compare) {
            if (OYO.fhc.comparePopup) {
                OYO.fhc.comparePopup.open();
            }
        } else {
            $("." + fhcType + ".list").show(self.duration, function () {
//                $(document).trigger('topmenu-changed');
            });
        }
    },
    addCloseButton: function (list) {
        if (list.find(".close").length === 0) {
            list.append("<div class='close'>&times;</div>");
            list.find(".close").click(function () {
                list.toggle();
            });
        }
    },
    getHistoryContent: function (callback) {
        var self = this;
        self.getContent(OYO.fhc.getTypes().history, function () {
            self.drawHistoryContent.call(self, callback);
        });
    },
    drawHistoryContent: function (callback) {
        var self = this;
        var htmlLITag = `<li>
                            <div class='car-type4-title visible-xs visible-sm'>#hlabel#</div>
                            <a href='#url#' rel='nofollow' class='car type4' target='_blank'> 
                                <div class='alpha'>
                                    <img src='#imageLoading#' class='loading' alt='loading...'/>
                                    <div class='image-holder'>
                                        <img src='#imageUrl#' 
                                            alt='image' 
                                            onerror='OYO.lpr.setNoPhoto(this);'/>
                                    </div>
                                </div>
                                <div class='beta'>
                                    <h2 class='hidden-xs hidden-sm'>#hlabel#</h2>
                                    <div class='price'>
                                        #labelPrice#:
                                        <span><strong>#price#</strong></span>
                                    </div>
                                    <div class='price'>
                                            <span>#orig_price#</span>
                                        </div>
                                    <div class='mileage'>
                                        #labelMileage#:
                                        <span><strong>#mileage#</strong></span>
                                    </div>
                                    <div class='location'>#location#</div>
                                    #comparehook#
                                    #favoriteshook#
                                </div>
                                <div class='gama'>
                                    <div class='price'>
                                        <span><strong>#price#</strong></span>
                                    </div>
                                    <div class='other price'>
                                        <span>#orig_price#</span>
                                    </div>
                                    #deal#
                                    #save#
                                </div>
                                <div class='time'>#time#h</div>
                            </a>
                        </li>`;
        var favoritesHookHTML = "<span class='favhook' data-record='#record#'><i class='small fheart #fheart#'></i><i class='large fheart #fheart#'></i></span>";
        var compareHookHTML = "<span class='comphook' data-record='#record#'><i class='cbox #checked#'></i></span>";
        var sb = new StringBuilder();
        var items = OYO.fhc.cookieContent[OYO.cookieNames.history];
        this.addCloseButton($(".history.list"));


        if (items.length === 0) {
            sb.append("<li class='message'>" + OYO.labels.emptyList + "</li>");
            $("#history-selector-holder").find(".history.list").addClass("nostyle");
            $("#history-selector-holder").find(".history.list ul").html(sb.toString());
        } else {
            for (var i = 0; i < items.length; i++) {
                var value = OYO.fhc.getCache().history[items[i].idRecord];
                if (value) {
                    var hlabel = value.year + " " + value.make + " " + value.model + " " + value.trim;
                    var time = OYO.utils.getFormattedDate(items[i].dateCreated);
                    var location = "";
                    if (value.city) {
                        location += "<strong>" + value.city + "</strong>";
                    }
                    if (value.state) {
                        location += ", " + value.state;
                    }
                    if (value.country) {
                        if (value.city || value.state) {
                            location += ", ";
                        }
                        location += value.country;
                    }
                    var orig_price = '';
                    if (value.displayPrice !== '') {
                        orig_price = value.displayPrice;
                    }


                    var compareChecked = "";
                    if (OYO.fhc.controller.isExisting(value.record, OYO.cookieNames.compare)) {
                        compareChecked = "checked";
                    }
                    var favoritesStar = "white";
                    if (OYO.fhc.controller.isExisting(value.record, OYO.cookieNames.favorite)) {
                        favoritesStar = "blue";
                    }

                    var idDeal = value.deal ? value.deal.idDeal : 0;
                    var dealText = value.deal ? value.deal.translation : 'N/A';

                    var deal = self.getDealHTML(idDeal, dealText, 'right');

                    var save = "";
                    if (value.savePercent) {
                        save = "<div class='you-save'><span>" + OYO.labels.youSave + "</span>" + value.savePercent + "</div>";
                    }


                    sb.append(htmlLITag.
                            split("#url#").join(value.url.url).
                            split("#imageUrl#").join(value.imgUrl.url).
                            split("#imageLoading#").join(OYO.images.LOADING_2).
                            split("#record#").join(items[i].idRecord).
                            split("#time#").join(time).
                            split("#location#").join(location).
                            split("#price#").join(value.displayConvertedPrice).
                            split("#orig_price#").join(orig_price).
                            split("#labelPrice#").join(OYO.labels.price).
                            split("#labelMileage#").join(OYO.labels.mileage).
                            split("#mileage#").join(value.displayMileage).
                            split("#hlabel#").join(hlabel).
                            split("#deal#").join(deal).
                            split("#save#").join(save).
                            split("#comparehook#").join(compareHookHTML.replace("#record#", value.record).
                            replace("#checked#", compareChecked)).
                            split("#favoriteshook#").join(favoritesHookHTML.replace("#record#", value.record).
                            split("#fheart#").join(favoritesStar)));
                } else {
                    OYO.fhc.removeFrom({
                        idRecord: items[i].idRecord,
                        cookieName: OYO.cookieNames.history
                    });
                }
            }
            $("#history-selector-holder").find(".history.list").removeClass("nostyle");
            $("#history-selector-holder").find(".history.list ul").html(sb.toString());

            $("#history-selector-holder").find(".favhook").click(function (e) {
                var idRecord = $(this).data("record");
                var itemByIDRecord = OYO.fhc.controller.getItemByIDRecord(OYO.cookieNames.history, idRecord);
                if (itemByIDRecord !== null) {
                    var fheart = $(this).find(".fheart");
                    var options = {
                        idRecord: idRecord,
                        idCountry: itemByIDRecord.idCountry,
                        isNew: itemByIDRecord.isNew,
                        fheart: fheart
                    };
                    return OYO.fhc.doOnClickFavorite(options, e);
                }
            }).mousedown(function (e) {
                if (e.which === 1)
                    e.stopPropagation();
            });

            $("#history-selector-holder").find(".comphook").click(function (e) {
                var idRecord = $(this).data("record");
                var itemByIDRecord = OYO.fhc.controller.getItemByIDRecord(OYO.cookieNames.history, idRecord);
                if (itemByIDRecord !== null) {
                    var cbox = $(this).find(".cbox");
                    var options = {
                        idRecord: idRecord,
                        idCountry: itemByIDRecord.idCountry,
                        isNew: itemByIDRecord.isNew,
                        cbox: cbox
                    };
                    return OYO.fhc.doOnClickCompare(options, e);
                }
            }).mousedown(function (e) {
                if (e.which === 1)
                    e.stopPropagation();
            });
        }
        if (callback) {
            callback();
        }
    },
    getFavoriteContent: function (callback) {
        var self = this;
        self.getContent(OYO.fhc.getTypes().favorite, function () {
            self.drawFavoriteContent.call(self, callback);
        });
    },
    drawFavoriteContent: function (callback) {
        var self = this;
        var htmlLITag = `<li>
                            <div class='car-type4-title visible-xs visible-sm'>#hlabel#</div>
                            <a href='#url#' rel='nofollow' class='car type4' target='_blank'> 
                                <div class='alpha'>
                                    <img src='#imageLoading#' class='loading' alt='loading...'/>
                                    <div class='image-holder'>
                                        <img src='#imageUrl#' 
                                            alt='image'
                                            onerror='OYO.lpr.setNoPhoto(this);'/>
                                    </div>
                                </div>
                                <div class='beta'>
                                    <h2 class='hidden-xs hidden-sm'>#hlabel#</h2>
                                    <div class='price'>
                                        #labelPrice#:
                                        <span><strong>#price#</strong></span>
                                    </div>
                                    <div class='price'>
                                            <span>#orig_price#</span>
                                        </div>
                                    <div class='mileage'>
                                        #labelMileage#:
                                        <span><strong>#mileage#</strong></span>
                                    </div>
                                    <div class='location'>#location#</div>
                                    #comparehook#
                                </div>
                                <div class='gama'>
                                    <div class='price'>
                                        <span><strong>#price#</strong></span>
                                    </div>
                                    <div class='other price'>
                                        <span>#orig_price#</span>
                                    </div>
                                    #deal#
                                    #save#
                                    <span class='rmv btn btn-xs btn-danger' data-record='#record#'>${OYO.labels.remove}</span>
                                </div>
                                <div class='time'>#time#h</div>
                            </a>
                        </li>`;
        var compareHookHTML = "<span class='upper comphook' data-record='#record#'><i class='cbox #checked#'></i></span>";
        var sb = new StringBuilder();

        var items = OYO.fhc.cookieContent[OYO.cookieNames.favorite];
        this.addCloseButton($(".favorite.list"));

        if (items.length === 0) {
            sb.append("<li class='message'>" + OYO.labels.emptyList + "</li>");
            $("#favorite-selector-holder").find(".favorite.list").addClass("nostyle");
            $("#favorite-selector-holder").find(".favorite.list ul").html(sb.toString());
        } else {
            for (var i = 0; i < items.length; i++) {
                var value = OYO.fhc.getCache().favorite[items[i].idRecord];
                if (value) {
                    var hlabel = value.year + " " + value.make + " " + value.model + " " + value.trim;
                    var time = OYO.utils.getFormattedDate(items[i].dateCreated);
                    var location = "";
                    if (value.city) {
                        location += "<strong>" + value.city + "</strong>";
                    }
                    if (value.state) {
                        location += ", " + value.state;
                    }
                    if (value.country) {
                        if (value.city || value.state) {
                            location += ", ";
                        }
                        location += value.country;
                    }
                    var orig_price = '';
                    if (value.displayPrice !== '') {
                        orig_price = value.displayPrice;
                    }
                    var compareChecked = "";
                    if (OYO.fhc.controller.isExisting(value.record, OYO.cookieNames.compare)) {
                        compareChecked = "checked";
                    }

                    var idDeal = value.deal ? value.deal.idDeal : 0;
                    var dealText = value.deal ? value.deal.translation : 'N/A';

                    var deal = self.getDealHTML(idDeal, dealText, 'right');

                    var save = "";
                    if (value.savePercent) {
                        save = "<div class='you-save'><span>" + OYO.labels.youSave + "</span>" + value.savePercent + "</div>";
                    }

                    sb.append(htmlLITag.
                            split("#url#").join(value.url.url).
                            split("#imageUrl#").join(value.imgUrl.url).
                            split("#imageLoading#").join(OYO.images.LOADING_2).
                            split("#record#").join(items[i].idRecord).
                            split("#time#").join(time).
                            split("#location#").join(location).
                            split("#price#").join(value.displayConvertedPrice).
                            split("#orig_price#").join(orig_price).
                            split("#labelPrice#").join(OYO.labels.price).
                            split("#labelMileage#").join(OYO.labels.mileage).
                            split("#mileage#").join(value.displayMileage).
                            split("#hlabel#").join(hlabel).
                            split("#deal#").join(deal).
                            split("#save#").join(save).
                            split("#comparehook#").join(compareHookHTML.replace("#record#", value.record).
                            replace("#checked#", compareChecked)));
                } else {
                    OYO.fhc.removeFrom({
                        idRecord: items[i].idRecord,
                        cookieName: OYO.cookieNames.favorite
                    });
                }
            }
            $("#favorite-selector-holder").find(".favorite.list").removeClass("nostyle");
            $("#favorite-selector-holder").find(".favorite.list ul").html(sb.toString());
            OYO.fhc.assignEventHandlerForFavoriteRmv($("#favorite-selector-holder").find(".favorite.list ul"), $(".favhook"));

            $("#favorite-selector-holder").find(".comphook").click(function (e) {
                var idRecord = $(this).data("record");
                var itemByIDRecord = OYO.fhc.controller.getItemByIDRecord(OYO.cookieNames.favorite, idRecord);
                if (itemByIDRecord !== null) {
                    var cbox = $(this).find(".cbox");
                    var options = {
                        idRecord: idRecord,
                        idCountry: itemByIDRecord.idCountry,
                        isNew: itemByIDRecord.isNew,
                        cbox: cbox
                    };
                    return OYO.fhc.doOnClickCompare(options, e);
                }
            }).mousedown(function (e) {
                if (e.which === 1)
                    e.stopPropagation();
            });
        }
        if (callback) {
            callback();
        }
    },
    getCompareContent: function () {
        var self = this;
        self.getContent(OYO.fhc.getTypes().compare, function () {
            self.drawCompareContent.call(self);
        });
    },
    drawCompareContent: function () {
        var self = this;
        if ($("#compare-selector-holder span.cmp-info").length === 0) {
            $("#compare-selector-holder a").after("<span class='cmp-info'>" + OYO.labels.emptyList + "</span>");
        }

        var items = OYO.fhc.cookieContent[OYO.cookieNames.compare];
        if (items.length > 0) {
            $("#compare-selector-holder span.cmp-info").hide();
            var html = new StringBuilder();
            var contentChunk = "<div class='compare-item #classes#'>\n\
                                    <div class='number-holder'><div class='number'>#number#</div></div>\n\
                                    <ul #url# class='_js-car-id-#idrecord# _js-link' data-newtab='true'>\n\
                                        <li class='image'>#image#</li>\n\
                                        <li class='_make' data-row='_make'>#make##star#</li>\n\
                                        <li class='_model' data-row='_model'>#model#</li>\n\
                                        <li class='_trim' data-row='_trim'>#trim#</li>\n\
                                        <li class='_price' data-row='_price'>#price# #orig_price#</li>\n\
                                        <li class='_deal' data-row='_deal'>#deal#</li>\n\
                                        <li class='_save' data-row='_save'>#save#</li>\n\
                                        <li class='_year' data-row='_year'>#year#</li>\n\
                                        <li class='_mileage' data-row='_mileage'>#mileage#</li>\n\
                                        <li class='_bodytype' data-row='_bodytype'>#bodytype#</li>\n\
                                        <li class='_fueltype' data-row='_fueltype'>#fueltype#</li>\n\
                                        <li class='_transmission' data-row='_transmission'>#transmission#</li>\n\
                                        <li class='_power' data-row='_power'>#power#</li>\n\
                                        <li class='_color' data-row='_color'>#color#</li>\n\
                                        <li><span class='#hidden# remove btn btn-sm btn-danger' data-record='#record#'>#remove#</span></li>\n\
                                    </ul>\n\
                                </div>";
            var noContentChunk = "<div class='compare-item'><div class='number-holder'><div class='number'>#number#</div></div></div>";



            var summary = contentChunk
                    .replace('#classes#', 'summary')
                    .replace('#url#', '')
                    .replace('#image#', '')
                    .replace('#star#', '')
                    .replace('#make#', OYO.labels.make)
                    .replace('#model#', OYO.labels.model)
                    .replace('#trim#', OYO.labels.trim)
                    .replace('#price#', OYO.labels.price)
                    .replace('#orig_price#', '')
                    .replace('#deal#', OYO.labels.deal)
                    .replace('#save#', OYO.labels.youSave)
                    .replace('#year#', OYO.labels.year)
                    .replace('#mileage#', OYO.labels.mileage)
                    .replace('#bodytype#', OYO.labels.bodytype)
                    .replace('#fueltype#', OYO.labels.fueltype)
                    .replace('#transmission#', OYO.labels.transmission)
                    .replace('#power#', OYO.labels.power)
                    .replace('#color#', OYO.labels.color)
                    .replace('#record#', '')
                    .replace('#idcountry#', '')
                    .replace('#isnew#', '')
                    .replace('#remove#', '')
                    .replace('#hidden#', 'hidden');
            html.append(summary);
            for (var i = 0; i < items.length; i++) {
                var value = OYO.fhc.getCache().compare[items[i].idRecord];
                if (value) {
                    var img = "<img src='" + value.imgUrl.url + "' onerror='OYO.lpr.setNoPhoto(this);' alt='fhc'>";

                    var fueltype = "";
                    if (value.fueltype !== null) {
                        fueltype = value.fueltype;
                    }
                    var bodytype = "";
                    if (value.bodytype !== null) {
                        bodytype = value.bodytype;
                    }
                    var transmission = "";
                    if (value.transmission !== null) {
                        transmission = value.transmission;
                    }
                    var year = "";
                    if (value.year !== null) {
                        year = value.year;
                    }

                    var color = "";
                    if (value.color !== null) {
                        color = value.color;
                    }

                    var star = "";
                    if (OYO.fhc.controller.isExisting(value.record, OYO.cookieNames.favorite)) {
                        star = "<i class='small blue fheart'></i>";
                    }

                    var orig_price = "";
                    if (value.displayPrice !== '') {
                        orig_price = "<span>(" + value.displayPrice + ")</span>";
                    }

                    var idDeal = value.deal ? value.deal.idDeal : 0;
                    var dealText = value.deal ? value.deal.translation : 'N/A';

                    var deal = self.getDealHTML(idDeal, dealText, 'left');

                    var save = "";
                    if (value.savePercent) {
                        save = "<div class='you-save'>" + value.savePercent + "</div>";
                    }

                    var chunk = contentChunk
                            .replace('#classes#', 'content')
                            .replace('#url#', 'data-where="' + value.url.url + '"')
                            .replace('#idrecord#', value.record)
                            .replace('#image#', img)
                            .replace('#star#', star)
                            .replace('#make#', value.make)
                            .replace('#model#', value.model)
                            .replace('#trim#', value.trim)
                            .replace('#price#', value.displayConvertedPrice)
                            .replace('#orig_price#', orig_price)
                            .replace('#deal#', deal)
                            .replace('#save#', save)
                            .replace('#year#', year)
                            .replace('#mileage#', value.displayMileage)
                            .replace('#bodytype#', bodytype)
                            .replace('#fueltype#', fueltype)
                            .replace('#transmission#', transmission)
                            .replace('#power#', value.displayPower)
                            .replace('#color#', color)
                            .replace('#record#', value.record)
                            .replace('#idcountry#', value.idCountry)
                            .replace('#isnew#', value.isNew)
                            .replace('#number#', i + 1)
                            .replace('#remove#', OYO.labels.remove)
                            .replace('#hidden#', '');
                    html.append(chunk);
                } else {
                    OYO.fhc.removeFrom({
                        idRecord: items[i].idRecord,
                        cookieName: OYO.cookieNames.compare
                    });
                }
            }

            for (i = items.length; i < OYO.fhc.getSettings().max[OYO.fhc.getTypes().compare]; i++) {
                var x = noContentChunk.replace('#number#', i + 1);
                html.append(x);
            }
            if (!OYO.fhc.comparePopup) {
                OYO.fhc.comparePopup = new Popup("compare");
            }
            var htmlForPopup = "<div class='compare-box'>" + html.toString() + "</div>";
            OYO.fhc.comparePopup.setContent({html: htmlForPopup, onHTMLInsert: function () {
                    OYO.fhc.assignEventHandlerForCompareRmv($(".comphook"));
                    OYO.fhc.markBestFields();
                }
            });
            OYO.fhc.comparePopup.open();
        } else {
            $("#compare-selector-holder span.cmp-info").show();
            setTimeout(function () {
                $("#compare-selector-holder span.cmp-info").hide();
            }, 1200);
        }
    },
    doOnHistoryUpdate: function () {
        this.displayCount(OYO.fhc.getTypes().history);
    },
    doOnFavoriteUpdate: function () {
        this.displayCount(OYO.fhc.getTypes().favorite);
    },
    doOnCompareUpdate: function () {
        this.displayCount(OYO.fhc.getTypes().compare);
    },
    displayCount: function (type) {
        var count = 0,
                cookieContent = OYO.utils.storage.getJSON(OYO.cookieNames[type]),
                badge = $('#' + type + '-selector .oyo-badge');
        if (cookieContent) {
            count = cookieContent.length;
        }
        badge.text(count);
        badge.show();
    },
    getDealHTML: function (idDeal, dealText, position) {
        return "<div class='deal type" + idDeal + "'>\n\
                                    <ul class='pull-" + position + "'>\n\
                                        <li class='_1'></li>\n\
                                        <li class='_2'></li>\n\
                                        <li class='_3'></li>\n\
                                        <li class='_4'></li>\n\
                                        <li class='_5'></li>\n\
                                    </ul>\n\
                                    <div class='label pull-left text-left'><span>" + dealText + "</div>\n\
                                </div>";
    },
    onReady: function () {
        var self = this;
        $(document).on('fhc-updated', function (e, type) {
            switch (type) {
                case OYO.fhc.getTypes().history:
                {
                    self.doOnHistoryUpdate();
                    break;
                }
                case OYO.fhc.getTypes().favorite:
                {
                    self.doOnFavoriteUpdate();
                    break;
                }
                case OYO.fhc.getTypes().compare:
                {
                    self.doOnCompareUpdate();
                    break;
                }
            }
        });

        $(document).on('mouseenter', '.compare-box ul>li', function (e) {
            var row = $(this).data('row');
            if (row) {
                $('.compare-box').find("li." + row).addClass('hovered');
            }
        });
        $(document).on('mouseleave', '.compare-box ul>li', function (e) {
            var row = $(this).data('row');
            if (row) {
                $('.compare-box').find("li." + row).removeClass('hovered');
            }
        });

        $(".favhook").each(function () {
            OYO.fhc.updateFavHook($(this));
        }).click(function (e) {
            var options = {
                idRecord: $(this).data("record").toString(),
                idCountry: OYO.appParams.idCountry.toString(),
                isNew: OYO.appParams.isNew.toString()
            };
            return OYO.fhc.doOnClickFavorite(options, e);
        });

        $(".comphook").each(function () {
            OYO.fhc.updateCompHook($(this));
        }).click(function (e) {
            var options = {
                idRecord: $(this).data("record").toString(),
                idCountry: OYO.appParams.idCountry.toString(),
                isNew: OYO.appParams.isNew.toString()
            };
            return OYO.fhc.doOnClickCompare(options, e);
        });
    }
};


