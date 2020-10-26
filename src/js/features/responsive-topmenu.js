export default class ResponsiveTopmenu {
    constructor() {
        this.active = false;
        this.lock = false;
        this.defaultUrl = window.location.href;
    }
    onReady() {
        this.$hamburger = $(".hamburger");
        this.$menu = $("menu");
        $("body").prepend("<div class='menu-backdrop'></div>")
        this.$backdrop = $(".menu-backdrop");
        this.addEventHandlers();
    }
    show() {
        this.$backdrop.addClass("active");
        this.$hamburger.addClass('active');
        this.$menu.addClass('active');
        this.active = true;
        history.pushState(null, null, '#feature:menu');
    }
    close(ignoreHistory) {
        this.$backdrop.removeClass("active");
        this.$hamburger.removeClass('active');
        this.$menu.removeClass('active');
        this.active = false;
        if (!ignoreHistory) history.pushState(null, null, this.defaultUrl);
    }
    addEventHandlers() {
        this.$hamburger.click(e => {
            if(!this.lock) {
                this.lock = true;
                if(!this.active) {
                    this.show();
                    setTimeout(() => {
                        this.lock = false;    
                    }, 500);
                }
                else {
                    this.close();
                    setTimeout(() => {
                        this.lock = false;    
                    }, 500);
                }
            }
            e.stopPropagation();
        });
        this.$backdrop.click(() => {
            this.close();
            setTimeout(() => {
                this.lock = false;    
            }, 500);
        });
        window.addEventListener('popstate', e => {
            const lastChunk = window.location.href.split("/").pop();
            const isFeature = lastChunk.startsWith("#feature");
            if(!isFeature) {
                this.close();
            } 
            else {
                const featureType = lastChunk.split(":")[1];
                if(featureType == "menu") {
                    this.show();
                }
            }
        });
    }
};


