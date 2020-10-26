export let Slider = function (slider, duration) {
    var siid, timer = 4000,
    directions = {
        left: '-',
        right: '+'
    },
    slide = function (direction) {
        var ul = slider.find("ul"),
            itemWidth = ul.find("li").outerWidth(true) + 4,
            allWidth = ul.find("li").length * itemWidth,
            sliderWidth = slider.outerWidth(true),
            diff = allWidth - sliderWidth,
            move = Math.min(itemWidth, diff);
    
        if(ul.scrollLeft() + sliderWidth >= allWidth){
            ul.animate({
                scrollLeft: '0'
            }, duration * 2);
        }else{
            ul.animate({
                scrollLeft: directions[direction] + '=' + move
            }, duration);
        }
    },
    
    siid = setInterval(function () {
        slide("right");
    }, timer);

    slider.find('.arrow.right').click(function () {
        slide("right");
    });
    slider.find('.arrow.left').click(function () {
        slide("left");
    });
    
    slider.mouseenter(function () {
        clearInterval(siid);
    });
    slider.mouseleave(function () {
        siid = setInterval(function () {
            slide("right");
        }, timer);
    });
    slider.on("touchstart", function () {
        clearInterval(siid);
    });
    slider.on("touchend", function () {
        siid = setInterval(function () {
            slide("right");
        }, timer);
    });
};