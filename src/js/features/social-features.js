import { Stat } from './stat.js';

export let SocialFeatures = {
    active: false,
    locked: false,
    urlHashName: 'share',
    gpShare: function (url) {
        window.open(
                'https://plus.google.com/share?url=' + url,
                'popupwindow',
                'scrollbars=yes,width=800,height=400'
                ).focus();
        return false;
    },
    inShare: function (url) {
        window.open(
                'https://www.linkedin.com/cws/share?url=' + url,
                'popupwindow',
                'scrollbars=yes,width=800,height=400'
                ).focus();
        return false;
    },
    tweet: function (url) {
        var width = 575,
            height = 400,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            url = 'http://twitter.com/intent/tweet?text=' + url,
            opts = 'status=1' +
            ',width=' + width +
            ',height=' + height +
            ',top=' + top +
            ',left=' + left;
        window.open(url, 'twitter', opts);
        return false;
    },
    viberSend: function () {
        document.location.href = "viber://forward?text=" + encodeURIComponent(window.location.href);
    },
    messengerSend: function () {
        document.location.href = "fb-messenger://share?link=" + encodeURIComponent(window.location.href);
    },
    whatsappSend: function () {
        document.location.href = "whatsapp://send?text=" + encodeURIComponent(window.location.href);
    },
    openD: function (options) {
        //share-desktop

        var trigElemHeight = $("._js-hook-share.share-desktop").height();
        var listWidth = $(".share-options").width();




        //odredjivanje pozicije liste
        //treba da bude ispod trigElem-a, ali da se ravna uz desnu ivicu kontejnera
        var containerWidth = $(window).width();
        if ($(".share-options").closest('.container').length > 0) {
            containerWidth = $(".container").width();
        }
        var windowWidth = $(window).width();
        var x = windowWidth - (windowWidth - containerWidth) / 2 - listWidth;

        /*
         1) odrediti velicinu
         */
        var _self = this;
        if (!_self.locked && !_self.active) {
            _self.locked = true;
            $("._js-hook-share").addClass("active");
            $(".share-options .oicon-soc").each(function () {
                $(this).addClass('sm');
            });
            $(".share-options").css({
                left: x,
                top: trigElemHeight,
                display: 'none'
            }).fadeIn(200, function () {
                if (options && options.changehash) {
                    OYO.urlHashHelper.changeHash(_self.urlHashName, {
                        recordLastHash: true
                    });
                }
                _self.active = true;
                _self.locked = false;
            });
        }
    },
    closeD: function (options) {
        var _self = this;
        if (!_self.locked) {
            _self.locked = true;

            $(".share-options").fadeOut(100, function () {
                $("._js-hook-share").removeClass("active");
                $(".share-options .oicon-soc").each(function () {
                    $(this).removeClass('sm');
                });
                $(".share-options").css({
                    left: '110%',
                    top: 0,
                    display: 'none'
                });
                if (options && options.changehash) {
                    OYO.urlHashHelper.changeHash(_self.urlHashName, {
                        useLastHash: true
                    });
                }
                _self.active = false;
                _self.locked = false;
            });
        }
    },
    openM: function (options) {
        var _self = this;
        if (!_self.locked) {
            _self.locked = true;
            var winHeight = $(window).outerHeight();
            var titleHeight = $(".share-options .title").outerHeight();
            var listHeight = $(".share-options ul").outerHeight();
            var height = Math.min(winHeight - titleHeight, listHeight);
            $("._js-count-android-promo").hide();
            $(".share-options").animate({
                left: 0
            }, 200, function () {
                $(".share-options ul").css({height: height, overflow: 'scroll'});
                $('.share-options .title span').fadeIn(500);
                if (options && options.changehash) {
                    OYO.urlHashHelper.changeHash(_self.urlHashName, {
                        recordLastHash: true
                    });
                }
                _self.active = true;
                _self.locked = false;
            });
        }
    },
    closeM: function (options) {
        var _self = this;
        if (!_self.locked) {
            _self.locked = true;
            $("._js-count-android-promo").fadeIn(200);
            $(".share-options").animate({
                left: '110%'
            }, 200, function () {
                $(".share-options ul").removeAttr("style");
                $('.share-options .title span').fadeOut(10);
                if (options && options.changehash) {
                    OYO.urlHashHelper.changeHash(_self.urlHashName, {
                        useLastHash: true
                    });
                }
                _self.active = false;
                _self.locked = false;
            });
        }
    },
    open: function (options) {
        var _self = this;
        if (OYO.utils.res.isDesktop()) {
            _self.openD(options);
        } else {
            _self.openM(options);
        }
    },
    close: function (options) {
        var _self = this;
        if (OYO.utils.res.isDesktop()) {
            _self.closeD(options);
        } else {
            _self.closeM(options);
        }
    },
    init: function () {
        var _self = this;
        OYO.urlHashHelper.register(_self.urlHashName, {
            start: function () {
                _self.open();
            },
            end: function () {
                if (_self.active) {
                    _self.close();
                }
            }
        });
        _self.addEventHandlers();
    },
    addEventHandlers: function () {
        var _self = this;
        $(document).on('click', '._js-fb-share', function () {
            Stat.countShareEvent("facebook");
            var url = window.location.href;
            $.ajaxSetup({cache: true});
            if (_self.fbScriptLoaded) {
                FB.ui({
                    method: 'share',
                    href: url
                });
            } else {
                $.getScript('//connect.facebook.net/en_US/sdk.js', function () {
                    _self.fbScriptLoaded = true;
                    FB.init({
                        appId: '312313269151583',
                        version: 'v2.8' // or v2.0, v2.1, v2.2, v2.3, v2.5
                    });
                    $.ajaxSetup({cache: false});
                    FB.ui({
                        method: 'share',
                        href: url
                    });
                });
            }
        });
        $(document).on('click', '._js-gp-share', function () {
            Stat.countShareEvent("google_plus");
            var url = window.location.href;
            _self.gpShare(url);
        });
        $(document).on('click', '._js-in-share', function () {
            Stat.countShareEvent("linkedin");
            var url = window.location.href;
            _self.inShare(url);
        });
        $(document).on('click', '._js-tweet', function () {
            Stat.countShareEvent("twitter");
            var url = window.location.href;
            _self.tweet(url);
        });
        $(document).on('click', '._js-viber-send', function () {
            Stat.countShareEvent("viber");
            _self.viberSend();
        });
        $(document).on('click', '._js-messenger-send', function () {
            Stat.countShareEvent("messenger");
            _self.messengerSend();
        });
        $(document).on('click', '._js-whatsapp-send', function () {
            Stat.countShareEvent("whatsapp");
            _self.whatsappSend();
        });

        var lastEventTimestamp = 0;
        $('._js-hook-share').addMouseTimeout({
            content: $(".share-options"),
            customFunctionality: function (e) {
                lastEventTimestamp = e.timeStamp;
                _self.open({changehash: true});               
                Stat.countShareEvent("mouseover-open");
            },
            customHideFunctionality: function (e) {
                _self.close({changehash: true});
                Stat.countShareEvent("mouseover-close");
            }
        }).click(function (e) {
            
            var x = e.timeStamp - lastEventTimestamp;
            lastEventTimestamp = 0;
            if (x > 500) {
                if (_self.active) {
                    Stat.countShareEvent("click-close");
                    _self.close();
                } else {
                    Stat.countShareEvent("click-open");
                    $(".share-options").show(); //ovo je bitno
                    _self.open();
                }
            }
        });

        $(document).on('click', '._js-share-close', function (e) {
            _self.close({changehash: true});
        });
    },
    onReady: function(){
        this.init();
    }
};








