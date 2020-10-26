import { Base64 } from './base64.js';
import { storage } from './ooyyo-storage.js';
import { ResponsiveHelper } from './responsive-helper.js';
let responsiveHelper = new ResponsiveHelper();


/**
 * common functions for all files
 * requires: jquery
 */
window.OYO.utils = {
    
    res: responsiveHelper,
    storage: storage,
    base64: Base64,
    /**
     * <strong>regContainsAllDigits(_string, options)</strong>
     * @param {String} _string - required parameter - string to be checked
     * @param {Object} options - optional parameter, holds inner parameters like:
     * <ul>
     *   <li>
     *       {Number} count
     *   </li>
     * </ul>
     * @returns {Boolean} - if _string consists of all digits method returns true.
     * But, if options.count set, _string length has to be equal to the options.count value
     */
    // regContainsAllDigits: function (_string, options) {
    //     var a = "+";
    //     if (options && options.count) {
    //         a = "{" + options.count + "}";
    //     }
    //     var reg = new RegExp("^[0-9]" + a + "$");
    //     return (reg.test(_string));
    // },
    /**
     * <strong>loadNoPhoto(img)</strong>
     * @param {HTMLImageElement} img
     * @returns {undefined}
     */
    loadNoPhoto: function (img) {
        $(img).attr('src', OYO.images.NO_IMAGE);
    },
    /**
     * <strong>gotoPage(options)</strong>
     * @param {Object} options (required: options.url parameter)
     * @returns {Boolean} 
     */
    blockHashFeature: false,
    gotoPage: function (options) {
        var url;
        if (options.encoded) {
            //decode base 64 encoded url. 
            //options.encoded flag value must be set to true if url is encoded (base 64)
            url = Base64.decode(options.url);
        } else {
            url = options.url;
        }
        if (url.toString() !== "") {
            //depending on flowtype, page will be opened in new window
            if (options.flowtype) {
                var flowtype = parseInt(options.flowtype);
                if (flowtype === 5 || flowtype === 6) {
                    window.open(url, "_blank");
                } else {
                    //block hash functionality
                    this.blockHashFeature = true;
                    document.location.href = url;
                }
            }
            //if page should be opened in new tab - set newTab parameter
            else if (options.newTab) {
                window.open(url, "_blank");
            } else {
                //block hash functionality
                this.blockHashFeature = true;
                document.location.href = url;
            }
        }
        return false;
    },
    /**
     * <strong>refreshPage(options)</strong>
     * @param {Object} options
     * @returns {undefined}
     */
    refreshPage: function (options) {
        if (options && options.ignoreHash) {
            //set ignoreHash parameter if # in url should be ignored
            window.location.href = window.location.href.split("#")[0];
        } else {
            //or just reload current url
            window.location.reload();
        }
    },
    /**
     * <strong>getScrollBarWidth()</strong>
     * @returns {Number} scroll bar width
     */
    getScrollBarWidth: function () {
        var inner = document.createElement('p');
        inner.style.width = "100%";
        inner.style.height = "200px";

        var outer = document.createElement('div');
        outer.style.position = "absolute";
        outer.style.top = "0px";
        outer.style.left = "0px";
        outer.style.visibility = "hidden";
        outer.style.width = "200px";
        outer.style.height = "150px";
        outer.style.overflow = "hidden";
        outer.appendChild(inner);

        document.body.appendChild(outer);
        var w1 = inner.offsetWidth;
        outer.style.overflow = 'scroll';
        var w2 = inner.offsetWidth;
        if (w1 === w2)
            w2 = outer.clientWidth;

        document.body.removeChild(outer);

        return (w1 - w2);
    },
    /**
     * <strong>changeScrollStatus(options)</strong>
     * @param {Object} options (in options specify element with scroll bars and action: enable/disable)
     * @returns {undefined}
     */
    changeScrollStatus: function (options) {
        var what = "html";
        var padding, visibility;
        if (options.what) {
            what = options.what;
        }
        if (options.disable) {
            padding = this.getScrollBarWidth() + "px";
            visibility = "hidden";
        } else if (options.enable) {
            padding = '0px';
            visibility = "scroll";
        }
        if (padding) {
            $(what).css({
                'overflow-y': visibility,
                'padding-right': padding
            });
        }
    },
    
    /**
     * <strong>getCount(json)</strong>
     * @param {Object} json
     * @returns {Number} count
     */
    getCount: function (json) {
        var count = 0;
        $.each(json, function (key, value) {
            count += 1;
        });
        return count;
    },
    /** 
     * <strong>sortJSON(json, options)</strong>
     * JSON to sorted array of keys/values.
     * @param {Object} json
     * @returns {Object} sorted json
     * Function takes keys or values of input, 
     * creates array and returns sorted array.
     * @param {Object} options
     * 'options' is optional parameter and it can have:
     * options.type - sort method - asc or desc (asc default - if not specified)
     * options.byValue - if set, function will manipulate with values, if not,   
     * function will manipulate with keys, by default  
     */
    sortJSON: function (json, options) {
        var arr = new Array();
        $.each(json, function (key, value) {
            if (options && options.byValue) {
                if (options.byValue === true) {
                    arr.push(value);
                } else {
                    arr.push(value[options.byValue]);
                }
            } else {
                arr.push(key);
            }
        });
        //sort - type default asc
        if (options) {
            if (options.desc) {
                if (options.datatype && options.datatype === "string") {
//                    arr.reverse();
                    arr.sort(function (a, b) {
                        return (b.toLowerCase()).localeCompare(a.toLowerCase());
//                        if (a.toLowerCase() < b.toLowerCase()) return -1;
//                        if (a.toLowerCase() > b.toLowerCase()) return 1;
//                        return 0;
                    });
                    //'a'.localeCompare('c')
                } else {
                    arr.sort(function (a, b) {
                        return b - a;
                    });
                }
            } else {
                if (options.datatype && options.datatype === "string") {
                    //'a'.localeCompare('c')

                    arr.sort(function (a, b) {
                        return (a.toLowerCase()).localeCompare(b.toLowerCase());
//                        if (a.toLowerCase() < b.toLowerCase()) return -1;
//                        if (a.toLowerCase() > b.toLowerCase()) return 1;
//                        return 0;
                    });
                } else {
                    arr.sort(function (a, b) {
                        return a - b;
                    });
                }
            }
        } else {
            arr.sort(function (a, b) {
                return a - b;
            });
        }
        return arr;
    },
    /**
     * <strong>isEmpty(obj)</strong>
     * @param {Object} obj
     * @returns {Boolean} false if empty, true if not
     */
    isEmpty: function (obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }
        return true;
    },
    /**
     * <strong>invert(json, options)</strong>
     * <h1>D A N G E R O U S    M E T H O D ! ! ! - possible items loss</h1>
     * @param {Object} json
     * @param {Object} options
     * @returns {Object}
     */
    // invertJSON: function (json, options) {
    //     /** Keys become values, values become keys. 
    //      *  {key : value} -> {value : key}
    //      *  For complex json (one level only - value consists inner json), 
    //      *  use options.inner = value1. 
    //      *  Other fields are ignored.
    //      *  example:
    //      *  {key : {value1 : value1, value2 : value2}} -> {value1 : key}
    //      */
    //     var new_json = {};
    //     $.each(json, function (key, value) {
    //         if (options && options.inner)
    //             new_json[value[options.inner]] = key;
    //         else
    //             new_json[value] = key;
    //     });
    //     return new_json;
    // },
    /**
     * <strong>isIntoView(el)</strong>
     * @param {HTMLElement} el
     * @returns {Boolean} true if element is scrolled into view
     * @deprecated
     */
    isIntoView: function (el) {
        var et = el.getBoundingClientRect().top;
        var eb = el.getBoundingClientRect().bottom;
        var eh = el.getBoundingClientRect().height;
        var wt = window.pageYOffset;
        var wh = window.innerHeight;

//        console.log(el);
//        console.log(`Element top: ${et} Element height: ${eh} Element bottom: ${eb} Window top: ${wt} Window height: ${wh}`);
//        console.log((et + eh > 0) && (et + eh < wh));

        return (et + eh > 0) && (et < wh);


    },
    /**
     * <strong>getFormattedDate(millis)</strong>
     * @param {Number} millis - date in miliseconds
     * @returns {String} - custom formatted date
     */
    getFormattedDate: function (millis) {
        var ret = "";
        var d = new Date();
        d.setTime(millis);
        var hours = d.getHours();
        if (hours < 10) {
            hours = "0" + hours;
        }
        var minutes = d.getMinutes();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        ret = d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + ". " + hours + ":" + minutes;
        return ret;
    },
    /**
     * <strong>updateUserSettingsCookie(field, value)</strong>
     * @param {String} field - 'user_setting' cookie value consists of 3 fields (idLanguage, idCountry, idCurrency)
     * @param {String} value - new value of specified field
     * @returns {undefined}
     * @deprecated user_setting cookie removed
     */
    updateUserSettingsCookie: function (field, value) {
        var us = this.storage.get(OYO.cookieNames.user_setting, this.storage.types.COOKIE);
        var x = us.split(",");
        var l = x.length;
        var is_changed = false;
        for (var i = 0; i < l; i++) {
            if (x[i].split(":")[0].toString() === field.toString()) {
                us = us.replace(x[i], field + ":" + value);
                is_changed = true;
                break;
            }
        }
        if (is_changed) {
            this.storage.set(OYO.cookieNames.user_setting, us, this.storage.types.COOKIE);
        }
    },
    /**
     * <strong>setCurrency(id)</strong>
     * @param {Number} id - idCurrency
     * @returns {undefined}
     */
    setCurrency: function (id) {
        id = parseInt(id);
        //if new currency is EUR, don't set cookie, delete if exists
        if (id === 3) {
            this.storage.remove(OYO.cookieNames.currency, this.storage.types.LOCAL);
        }
        //if not EUR - create cookie
        else {
            this.storage.set(OYO.cookieNames.currency, id, this.storage.types.LOCAL);
        }
    },
    //added for truck project
    /**
     * <strong>centerAbsoluteImage(imageWidth, imageHeight, containerWidth, containerHeight)</strong>
     * @param {Number} imageWidth
     * @param {Number} imageHeight
     * @param {Number} containerWidth
     * @param {Number} containerHeight
     * @returns {Object} css object with style for centered image
     */
    centerAbsoluteImage: function (imageWidth, imageHeight, containerWidth, containerHeight) {
        var css = {};
        var containerWidthHeightRatio = containerHeight / containerWidth;
        if (imageHeight / imageWidth > containerWidthHeightRatio) {
            css.left = (Math.abs(containerWidth - imageWidth * (containerHeight / imageHeight)) / 2) + "px";
            css.height = "100%";
            css.top = 0;
            css.width = "auto";
        } else if (imageHeight / imageWidth < containerWidthHeightRatio) {
            css.top = (Math.abs(containerHeight - imageHeight * (containerWidth / imageWidth)) / 2) + "px";
            css.width = "100%";
            css.left = 0;
            css.height = "auto";
        } else {
            css.top = 0;
            css.left = 0;
            css.height = "100%";
            css.width = "100%";
        }
        return css;
    },
    /**
     * <strong>adjustImageJQ(img)</strong>
     * @param {HTMLImageElement} img
     * @returns {undefined}
     */
    adjustImageJQ: function (img) {
        //do the job for img
        var image = $(img);
        var parent = image.parent();
        var w = parent.width();
        var h = parent.height();
        var css = this.centerAbsoluteImage(image.width(), image.height(), w, h);
        image.css(css).fadeIn(300);
        parent.prev(".loading").fadeOut(300);
    },
    /**
     * <strong>scrollToThat(params)</strong>
     * @param {Object} params
     * @returns {undefined}
     */
    scrollToThat: function (params) {
        var duration = 100;
        if (params.duration) {
            duration = params.duration;
        }
        var top = 0;
        if (params && params.what) {
            top = params.what.offset().top;
        }
        var headerHeight = 0;
        if ($('header').length > 0) {
            headerHeight = $('header').height();
        }
        $('html, body').animate({
            scrollTop: top - (headerHeight + 10)
        }, duration);
    },
    /**
     * <strong>getParams()</strong>
     * @returns {Object} parameters for service call
     */
    getParams: function (options) {
        var params = {};
        if (options && options.type) {
            switch (options.type) {
                case 'countries':
                {
                    var keys = ['isNew', 'idPageType', 'idCountry', 'idLanguage',
                        'idDomain', 'idCurrency', 'idMake', 'idModel', 'idTrim',
                        'priceFrom', 'priceTo', 'yearFrom', 'yearTo',
                        'mileageFrom', 'mileageTo', 'idBodytype', 'idFueltype',
                        'zipCode', 'radius', 'idState', 'idCity', 'idTransmission',
                        'idColor', 'power', 'idRecord'];
                    $.each(keys, function (k, v) {
                        if (OYO.appParams[v] !== '') {
                            params[v] = OYO.appParams[v];
                        }
                    });
                    break;
                }
            }
        } else {
            $.each(OYO.appParams, function (key, value) {
                if (value !== "") {
                    params[key] = value;
                }
            });
        }
        return params;
    },
    showNativeAppDownloadDialog: function () {
        var stopShowingIosMessage = this.storage.get(OYO.cookieNames.cookieIosStop);
        if (stopShowingIosMessage === 'true') {
            
        } else {
            var downloadLink = "https://itunes.apple.com/us/app/ooyyo-car-search/id1409604054?mt=8";
            var html = '<div class="dialog-backdrop" id="download-native-holder"><div class="dialog"><div class="close">&times;</div><h1>' + OYO.labels.downloadiOSApp + '</h1><div class="text-center"><a target="_blank" href="' + downloadLink + '"><img src="' + OYO.images.DOWNLOAD + '"/></a></div><div><div class="checkbox"><label><input type="checkbox">' + OYO.labels.dontShowMessage + '</label></div></div></div></div>';
            var remove = function () {
                $("#download-native-holder").fadeOut(150, function () {
                    $("#download-native-holder").remove();
                });
                this.storage.set(OYO.cookieNames.cookieIosAppClosed, 'true');
                this.storage.set(OYO.cookieNames.cookieIosAppQCounter, 1);
            };
            var iOS = !!navigator.platform && /iPhone|iPod/.test(navigator.platform);
            if (iOS) {
                var counter = this.storage.get(OYO.cookieNames.cookieIosAppQCounter);
                var counterCheck = true;
                if (counter === undefined) {
                    //nista
                } else {
                    counter = parseInt(counter);
                    counter += 1;
                    if (counter <= 5) {
                        counterCheck = false;
                    } else {
                        counter = 0;
                        this.storage.remove(OYO.cookieNames.cookieIosAppClosed);
                    }
                    this.storage.set(OYO.cookieNames.cookieIosAppQCounter, counter);
                }
                var m = !this.res.isDesktop();
                if (counterCheck && m && this.storage.get(OYO.cookieNames.cookieIosAppClosed) === undefined) {
                    this.storage.remove(OYO.cookieNames.cookieIosAppQCounter);
                    $("body").append(html);
                    $("#download-native-holder .checkbox").click(function (e) {
                        var isChecked = $(this).find("input").is(":checked");
                        if(isChecked){
                            this.storage.set(OYO.cookieNames.cookieIosStop, 'true');
                        }else{
                            this.storage.set(OYO.cookieNames.cookieIosStop, 'false');
                        }
                        e.stopPropagation();
                    });
                    $("#download-native-holder a").click(function () {
                        remove();
                        this.storage.set(OYO.cookieNames.cookieIosStop, 'true');
                    });
                    $("#download-native-holder").click(function () {
                        remove();
                    });
                    $("#download-native-holder .close").click(function (e) {
                        remove();
                        e.stopPropagation();
                    });
                }
            }
        }
    },
//     showInfoAboutCookie: function () {
//         var html = "<div class='cookie-info-message-holder'><div class='cookie-box'><div class='times-cancel'>&times;</div><div class='row'><div class='col-xs-12'><div class='cookie-info-message'></div></div><div class='col-xs-12 text-right'><a href='javascript:void(0)' class='btn btn-indigo pull-right more-info'></a><button class='btn btn-indigo pull-right'></button></div><div class='col-xs-12 text-center'><a class='cookie-footer' href=''></a></div></div></div></div>";
//         if (this.storage.get(OYO.cookieNames.cookieInfoMessage) === undefined) {

//             var str = OYO.labels.longCookies_GDPR;
//             var patt = /(\[link\].+?\[\/link\])/g;
//             var res = patt.exec(str)[0];
//             var link = "<a href='" + OYO.URLs.cookiePolicy + "'>" + res.replace('[link]', '').replace('[/link]', '') + "</a>";
//             str = str.replace(res, link);

//             $("body").append(html);
//             $(".cookie-info-message-holder .cookie-info-message").html(str);
//             $(".cookie-info-message-holder button").text(OYO.labels.acceptGdpr);
//             $(".cookie-info-message-holder .cookie-footer").text(OYO.labels.cookiesGdprSmall);
//             $(".cookie-info-message-holder .cookie-footer").attr("href", OYO.URLs.cookiePolicy + "_choices");
//             $(".cookie-info-message-holder a.more-info").hide().text(OYO.labels.moreInfo).click(function () {
//                 $(".cookie-info-message-holder").removeClass('mini');
//                 $(".cookie-box").removeClass('mini');
//                 $(".cookie-info-message-holder .cookie-info-message").show();
//                 $(".cookie-info-message-holder button").show();
//                 $(".cookie-info-message-holder a.more-info").hide();
//                 $(".cookie-info-message-holder .times-cancel").show();
//                 $(".cookie-info-message-holder .cookie-footer").show();
//             });
// //                    .click(function(){
// //                if($(this).hasClass('minimized')){
// //                    $(".cookie-box").removeClass('mini');
// //                    $(".cookie-info-message-holder .cookie-info-message").show();
// //                    $(".cookie-info-message-holder button").show();
// //                    $(this).removeClass('minimized').text('Cancel');
// //                }else{
// //                    $(".cookie-box").addClass('mini');
// //                    $(".cookie-info-message-holder .cookie-info-message").hide();
// //                    $(".cookie-info-message-holder button").hide();
// //                    $(this).addClass('minimized').text('Show message');
// //                }
// //            });
//             $(".cookie-info-message-holder .times-cancel").click(function () {
//                 $(".cookie-info-message-holder").addClass('mini');
//                 $(".cookie-box").addClass('mini');
//                 $(".cookie-info-message-holder .cookie-info-message").hide();
//                 $(".cookie-info-message-holder button").hide();
//                 $(".cookie-info-message-holder a.more-info").show();
//                 $(".cookie-info-message-holder .cookie-footer").hide();
//                 $(this).hide();
//             });
//             $(".cookie-info-message-holder button").click(function () {
//                 this.storage.set(OYO.cookieNames.cookieInfoMessage, 'true');
//                 $(".cookie-info-message-holder").remove();
//             });
//             setTimeout(function () {
//                 $(".cookie-info-message-holder").animate({bottom: 0}, 700);
//             }, 3000);
//         }
//     },
//     showInfoAndroidApp: function () {
//         var iOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
//         if (!iOS) {
//             var counter = this.storage.get(OYO.cookieNames.cookieAndroidAppQCounter);
//             var counterCheck = true;
//             if (counter === undefined) {
//                 //nista
//             } else {
//                 counter = parseInt(counter);
//                 counter += 1;
//                 if (counter <= 5) {
//                     counterCheck = false;
//                 } else {
//                     counter = 0;
//                     this.storage.remove(OYO.cookieNames.cookieAndroidAppClosed);
//                 }
//                 this.storage.set(OYO.cookieNames.cookieAndroidAppQCounter, counter);
//             }
//             var m = !this.res.isDesktop();
//             if (counterCheck && m && this.storage.get(OYO.cookieNames.cookieAndroidAppClosed) === undefined) {
//                 this.storage.remove(OYO.cookieNames.cookieAndroidAppQCounter);
//                 var self = this;
// //                var html = "<div class='promo-app-old'>\n\
// //                            <div>\n\
// //                                <img src='" + OYO.images.GOOGLE_PLAY + "' alt='Google Play'/>\n\
// //                                <div class='text'>\n\
// //                                    <span class='link'>" + OYO.labels.downloadAndroidApp + "</span>\n\
// //                                </div>\n\
// //                                <span class='info'>" + OYO.labels.moreCountriesAndFeatures + "</span>\n\
// //                                <span class='close'>&times;</span>\n\
// //                            </div>\n\
// //                        </div>";
//                 var html = "<a href='https://play.google.com/store/apps/details?id=com.oyo.oyoapp' target='_blank' class='promo-app _js-count-android-promo'>\n\
//                                 <span class='close'>&times;</span>\n\
//                                 <div class='middle'>\n\
//                                     <img class='head' src='" + OYO.images.OOYYO_HEAD + "' alt=''>\n\
//                                     <div class='gp-rating'>\n\
//                                         <span>OOYYO Android</span>\n\
//                                         <img src='" + OYO.images.RATING + "' alt=''>\n\
//                                     </div>\n\
//                                     <img class='gp-badge' src='" + OYO.images.GP_BADGE + "' alt=''>\n\
//                                 </div>\n\
//                                 <div class='bottom'>\n\
//                                     <div class='info'>" + OYO.labels.moreCountriesAndFeatures + "</div>\n\
//                                 </div>\n\
//                             </a>";

//                 $("header").before(html);
//                 var x = $('.promo-app').outerHeight();
//                 $('.promo-app').css({
//                     top: -x
//                 });
//                 $("section, footer").css('position', 'relative');
//                 $("header, .under-header, section, footer, .above-footer").animate({
//                     top: x
//                 }, {duration: 500, queue: false});
//                 $('.promo-app').animate({
//                     top: 0
//                 }, {duration: 500, queue: false});

//                 $('.promo-app .close').click(function (e) {
//                     //clearInterval(focusInt);

//                     $("header, .under-header, section, footer, .above-footer").animate({
//                         top: 0
//                     }, {duration: 500, queue: false});
//                     $('.promo-app').animate({
//                         top: -x
//                     }, {duration: 500, queue: false}, function () {
//                         $(".promo-app").remove();
//                     });

//                     this.storage.set(OYO.cookieNames.cookieAndroidAppClosed, 'true');
//                     this.storage.set(OYO.cookieNames.cookieAndroidAppQCounter, 1);
//                     e.stopPropagation();
//                     return false;
//                 });
//             }
//         }
//     },
    // createContextMenu: function () {
    //     $('body').append('<ul class="contextmenu"><li class="goto">Open in new tab</li><li class="close">Close</li></ul>');
    //     return $("body .contextmenu");
    // },
    // showContextMenu: function (options) {
    //     var ctxmenu = $("body .contextmenu");
    //     if (ctxmenu.length === 0) {
    //         ctxmenu = this.createContextMenu();
    //     }
    //     ctxmenu.attr('data-where', options.url);
    //     ctxmenu.attr('data-isencoded', options.encoded);
    //     ctxmenu.show();
    //     return false;
    // },
    //@NOTE check if used
    // lockScreen: function () {
    //     var html = "<div class='full-screen-lock'><img src='" + OYO.images.LOADING_2 + "' alt='...'></div>";
    //     $('body').append(html);
    //     var img = $('.full-screen-lock img');
    //     var top = ($(window).height() - img.height()) / 2;
    //     var left = ($(window).width() - img.width()) / 2;
    //     img.css({
    //         top: top,
    //         left: left
    //     });
    //     $('.full-screen-lock').fadeIn(500);
    // },
    // unlockScreen: function () {
    //     $('.full-screen-lock').fadeOut(300).remove();
    // },
    getConvertedPrice: function (ammount, srcCurrency, destCurrency) {
        var ret = ammount;
        if (srcCurrency.idCurrency !== destCurrency.idCurrency) {
            ret = (ammount * srcCurrency.refValueMap.EUR) / destCurrency.refValueMap.EUR;
        }
        return ret;
    },
    getFormattedPrice: function (price, delimiter, symbol, order) {
        var arr = [];
        order = order.toString();
        price = parseInt(price, 10);
        price = price.toString().split('');
        var l = price.length;
        for (var i = l - 1; i >= 0; i--) {
            var j = l - i - 1;
            if (j > 0 && j % 3 === 0) {
                if (!(l % 3 === 0 && j === l - 1)) {
                    arr.unshift(delimiter);
                }
            }
            arr.unshift(price[i]);
        }
        var ret = arr.join('');
        if (order === '1') {
            ret = symbol + ' ' + ret;
        } else {
            ret = ret + ' ' + symbol;
        }
        return ret;
    },
    getCarPrices: function(currencies, cidCurrency, cPrice) {
        const cCurrency = currencies.filter(item => item.idCurrency == cidCurrency)[0];
        var uidCurrency = OYO.utils.storage.get(OYO.cookieNames.currency);
        const uCurrency = currencies.filter(item => item.idCurrency == uidCurrency)[0];
        var cPriceFormatted = OYO.utils.getFormattedPrice(cPrice, OYO.Other.priceDelimiter, cCurrency.iso, OYO.Other.priceCurrency);
        if (uidCurrency) {
            uidCurrency = uidCurrency.toString();
            if (cidCurrency == uidCurrency) {
                return {
                    primary: cPriceFormatted,
                    secondary: ''
                }
            } else {
                var uPriceConverted = OYO.utils.getConvertedPrice(cPrice, cCurrency, uCurrency);
                var uPriceFormatted = OYO.utils.getFormattedPrice(uPriceConverted, OYO.Other.priceDelimiter, uCurrency.iso, OYO.Other.priceCurrency);
                return {
                    primary: uPriceFormatted,
                    secondary: cPriceFormatted
                }
            }
        }
    },
    logParams: function (params) {
        fetch(`//analytics.ooyyo.com/ooyyo-services/resources/counter/ip_search_country?json=${encodeURIComponent(JSON.stringify(params))}`);
    },
    addDeviceTypeToURL: function (url) {
        if (url.indexOf('analytics.ooyyo.com/counter') > -1) {
            url += "&deviceType=" + this.res.getScreenType();
        }
        return url;
    },
    showFullPagePreloader: function() {
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
    },
    showPageScrollbar: function() {
        $("body").removeClass('noscroll');
    },
    hidePageScrollbar: function() {
        $("body").addClass('noscroll');
    }
};

//export class Utils{
//    static create(){
//        return utils;
//    }
//}