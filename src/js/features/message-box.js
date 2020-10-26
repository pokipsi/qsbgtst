export let messageBox = {
    htmlElement: null,
    show: function (options) {
        var _self = this;
        var text = options.text;
        if (OYO.utils.res.isMobile()) {
            if (_self.htmlElement === null) {
                var height = $(window).height();
                _self.htmlElement = $("<div>")
                        .addClass('oyo-message')
                        .text(text)
                        .css({
                            position: 'fixed',
                            top: height,
                            left: 0
                        });
                $('body').append(_self.htmlElement);
                var messageHeight = _self.htmlElement.outerHeight();
                _self.htmlElement.animate({
                    top: height - messageHeight
                }, 500, function () {
                    setTimeout(function () {
                        _self.htmlElement.animate({
                            top: height
                        }, 300, function () {
                            _self.htmlElement.remove();
                            _self.htmlElement = null;
                        });
                    }, 2000);
                });
            }
        }else {
            if (_self.htmlElement === null) {
                var width = $(window).width();
                var height = $(window).height();
                _self.htmlElement = $("<div>")
                        .addClass('oyo-message')
                        .text(text)
                        .css({
                            position: 'fixed',
                            left: width,
                            width: 300
                        });
                $('body').append(_self.htmlElement);
                var messageHeight = _self.htmlElement.outerHeight();
                var messageWidth = _self.htmlElement.outerWidth();
                _self.htmlElement.css({
                    top: (height - messageHeight) / 2
                });
                _self.htmlElement.animate({
                    left: (width - messageWidth) / 2
                }, 200, function () {
                    setTimeout(function () {
                        _self.htmlElement.animate({
                            left: width
                        }, 100, function () {
                            _self.htmlElement.remove();
                            _self.htmlElement = null;
                        });
                    }, 2000);
                });
            }
        }
        _self.htmlElement.click(function(){
            _self.htmlElement.fadeOut(200, function () {
                _self.htmlElement.remove();
            });
        });
    }
};

