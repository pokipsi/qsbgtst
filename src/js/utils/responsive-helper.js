let responsiveHelper = function () {
    var edge = {
        XSS_MIN: 0,
        XS_MIN: 480,
        SM_MIN: 768,
        MD_MIN: 992,
        LG_MIN: 1150
    },
    screenType = null,
    screenTypes = {
        M: 'mobile',
        T: 'tablet',
        D: 'desktop'
    },
    getScreenWidth = function () {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    },
    getScreenType = function () {
        var w = getScreenWidth();
        if (w < edge.SM_MIN) {
            return screenTypes.M;
        } else if (w >= edge.SM_MIN && w < edge.MD_MIN) {
            return screenTypes.T;
        } else if (w >= edge.MD_MIN) {
            return screenTypes.D;
        }
    },
    handleDesktop,
    handleTablet,
    handleMobile,
    isDesktop = function(){
        return getScreenType() === screenTypes.D;
    },
    isTablet = function(){
        return getScreenType() === screenTypes.T;
    },
    isMobile = function(){
        return getScreenType() === screenTypes.M;
    },
    handle = function (callbacks) {
        if(!callbacks){
            return;
        }
        var switcher = function(){
            screenType = getScreenType();
            switch(screenType){
                case screenTypes.D:
                    if(handleDesktop) handleDesktop();
                    if (callbacks.onDesktop) {
                        callbacks.onDesktop();
                    }
                    break;
                case screenTypes.M:
                    if(handleMobile) handleMobile();
                    if (callbacks.onMobile) {
                        callbacks.onMobile();
                    }
                    break;
                case screenTypes.T:
                    if(handleTablet) handleTablet();
                    if (callbacks.onTablet) {
                        callbacks.onTablet();
                    }
                break;
            }
        };
        switcher();
        $(window).resize(function () {
            //check if screen size level changed
            if (getScreenType() !== screenType) {
                switcher();
            }
        });
    };
    return {
        getScreenType: getScreenType,
        handleDifferentScreenSizes: handle,
        setCommonHandlerDesktop: function(fx){
            handleDesktop = fx;
        },
        setCommonHandlerTablet: function(fx){
            handleTablet = fx;
        },
        setCommonHandlerMobile: function(fx){
            handleMobile = fx;
        },
        isMobile: isMobile,
        isTablet: isTablet,
        isDesktop: isDesktop
    };
};

export class ResponsiveHelper{
    constructor(){
        return responsiveHelper();
    }
}