export class Popup {
    constructor(id) {
        this.id = id;
        this.lock = false;
        this.urlHashName = '#popup-' + id;
        this.create();
        let self = this;
        OYO.urlHashHelper.register(self.urlHashName, {
            start: function () {
                self.openPopup();
            },
            end: function () {
                self.closePopup();
            }
        });
    }
    create() {
        var self = this;

        //add overlay
        if ($(`#popup-${self.id}`).length === 0) {
            $('body').append(
                    `<div class='popup-overlay' id='popup-${self.id}'>
                    <div class='popup'>
                        <div class='popup-header'><h1>${OYO.labels.compare}</h1>
                            <span class='close'>&times;</span>
                        </div>
                        <div class='popup-content'></div>
                    </div>
                </div>`
                    );
        }

        var popupOverlay = $("#popup-" + self.id);

        //close popup on click on overlay
        popupOverlay.click(function (e) {
            if ($(e.target).hasClass('popup-overlay')) {
                self.close();
            }
        });

        popupOverlay.find(".close").click(function () {
            self.close();
        });

        //close on ESC
        $(document).keydown(function (e) {
            if (e.which === 27) {
                self.close();
            }
        });
    }
    setContent(options) {
        var self = this;
        var popupOverlay = $(`#popup-${self.id}`);
        var popupContent = popupOverlay.find(".popup-content");
        //add html content
        if (options && options.html) {
            popupContent.html(options.html);
            if (options.onHTMLInsert) {
                options.onHTMLInsert.call();
            }
        }
    }
    openPopup(options) {
        var self = this;
        var popupOverlay = $("#popup-" + self.id);
        var popup = popupOverlay.find(".popup");

        //set popup size
        var w = $(window).width() - 100;
        if ($(".container").length > 0) {
            w = $(".container").outerWidth();
        }

        //max visina popup-a
        var h = $(window).height() - 100;
        //visina kontenta
        var hc = popup.find(".popup-content").children().first().outerHeight();

        h = Math.min(h, hc);


        popup.css({
            'width': w + 'px',
            'height': h + 'px'
        });

        if (!self.lock) {
            OYO.utils.changeScrollStatus({disable: true});
            self.lock = true;
            popupOverlay.fadeIn(function () {
                var top = ($(window).height() - popup.height()) / 2;
                popup.animate({
                    top: top
                }, function () {
                    self.lock = false;
                    if (options && options.changehash) {
                        OYO.urlHashHelper.changeHash(self.urlHashName);
                    }
                });
            });
        }

    }
    open() {
        this.openPopup({changehash: true});
    }
    closePopup(options) {
        var self = this;
        var popupOverlay = $("#popup-" + self.id);
        var popup = popupOverlay.find(".popup");

        if (!self.lock) {
            self.lock = true;
            popup.animate({
                top: '-100%'
            }, function () {
                popupOverlay.fadeOut();
                OYO.utils.changeScrollStatus({enable: true});
                self.lock = false;
                if (options && options.changehash) {
                    OYO.urlHashHelper.changeHash("_");
                }
            });
        }
    }
    close() {
        this.closePopup({changehash: true});
    }
}