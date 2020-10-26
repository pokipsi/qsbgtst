let counter = 0;
let GLOBALS = {};
export class MouseTimeout{
    showContent(hook, options){
        //prvo sacekati odredjeno vreme, jer je moguce da je korisnik presao misem slucajno, ne zeleci da se prikaze lista

        GLOBALS[hook].timeout_id_show = setTimeout(function () {

            //ovo je los deo koda, izvrsava se customFunctionality koji mozda overriduje dalju logiku, a ona ipak postoji

            if(options && options.customFunctionality){
                options.customFunctionality(options.e);
            }

            //ukoliko je content skriven, prikazati ga
            //ukoliko je content prikazan i traje brojanje vremena do skrivanja content-a, 
            //prekinuti brojac
            var duration = 200;
            if (options && options.duration) {
                duration = options.duration;
            }
            $("#" + hook).addClass('mouseover-timeout-hover');
            GLOBALS[hook].content.slideDown(duration, function () {
                $.each(GLOBALS, function (key, value) {
                    if (key !== hook) {
                        $("#" + key).removeClass('mouseover-timeout-hover');
                        value.content.hide(duration);
                    }
                });
            });
            if (GLOBALS[hook].timeout_id_hide) {
                clearTimeout(GLOBALS[hook].timeout_id_hide);
            }
            if (options && options.e) {
                options.e.stopPropagation();
            }
        }, 300);
    }
    clearMouseTimeout(hook){
        //iskljuciti brojanje
        if (GLOBALS[hook].timeout_id_hide) {
            clearTimeout(GLOBALS[hook].timeout_id_hide);
        }
    }
    hideContent(hook, options, conf){
        //startovati brojanje vremena do skrivanja content-a, kad istekne, sakriti content
        var delay = 400;
        var duration = 200;
        try {
            if (GLOBALS[hook].timeout_id_show) {
                clearTimeout(GLOBALS[hook].timeout_id_show);
            }
            if (conf) {
                if (conf.delay) {
                    delay = conf.delay;
                }
                if (conf.duration) {
                    duration = conf.duration;
                }
            }
            GLOBALS[hook].timeout_id_hide = setTimeout(function () {
                if (options.customHideFunctionality) {
                    options.customHideFunctionality();
                } else {
                    GLOBALS[hook].content.slideUp(duration);
                }
                $("#" + hook).removeClass('mouseover-timeout-hover');
            }, delay);

        } catch (ex) {
            //console.log(ex);
        }
    }
    addMouseTimeout(options){
        var self = this;
        //ovde se dodaju u GLOBALS podaci o hook-u i content-u. 
        //key u GLOBALS je ID hook-a. Content je DOM objekat i obavezan je parametar funkcije. 
        //koristi se kod obrade dogadjaja
        if (options && options.content) {
            var element = options.element;
            if (!element.attr("id")) {
                counter += 1;
                element.attr("id", "mouse_timeout_" + counter);
            }
            var key = element.attr("id");
            if (GLOBALS[key] === undefined) {
                GLOBALS[key] = {};
                GLOBALS[key].timeout_id_show = null;
                GLOBALS[key].timeout_id_hide = null;
                GLOBALS[key].content = options.content;
                element.mouseleave(function () {
                    self.hideContent(key, options);
                });
                GLOBALS[key].content.mouseenter(function () {
                    self.clearMouseTimeout(key);
                });
                GLOBALS[key].content.mouseleave(function () {
                    self.hideContent(key, options);
                });
                element.mouseenter(function (e) {
                    if (options.customFunctionality) {
                        var showContentOptions = {
                            customFunctionality: options.customFunctionality,
                            e: e
                        };
                    }
                    self.showContent(key, showContentOptions);
                });
                $("html, body").click(function () {
                    //self.hideContent(key, options, {duration: 10, delay: 1});
                });
            }
        }
    }
    static init(){
        $.fn.addMouseTimeout = function (options) {
            var element = $(this);
            options.element = element;
            (new MouseTimeout()).addMouseTimeout(options);
            return this;
        };
    }
    static onReady(){
        $("._js-mouse-timeout-trigger").each(function () {
            var target = $(this).next("._js-mouse-timeout-target");
            $(this).addMouseTimeout({
                content: target
            });
        });
    }
}
