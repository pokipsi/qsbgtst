export default () => {
    $("body").append("<div class='back-to-top'><i class='icon-cheveron-up'></i></div>");
    $(".back-to-top").click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });
    $(window).on('scroll', function () {
        var x = $(window).scrollTop();
        var lock = false;
        if (!lock) {
            lock = true;
            if (x === 0) {
                if ($(".back-to-top").css('right') === '10px') {
                    $(".back-to-top").animate({
                        right: '-500px'
                    }, 500, function () {
                        lock = false;
                    });
                } else {
                    lock = false;
                }

            } else {
                if ($(".back-to-top").css('right') === '-500px') {
                    $(".back-to-top").animate({
                        right: '10px'
                    }, 500, function () {
                        lock = false;
                    });
                } else {
                    lock = false;
                }
            }
        }

    });
}