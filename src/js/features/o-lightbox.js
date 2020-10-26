export default class OLightbox {
    constructor({ title, price, year, mileage, contactLink, fxOnOpen = () => {}, fxOnClose = () => {} }) {

        this.lock = false;
        this.activeIndex = 0;

        this.title = title;
        this.price = price;
        this.year = year;
        this.mileage = mileage;
        this.contactLink = contactLink;
        this.fxOnOpen = fxOnOpen;
        this.fxOnClose = fxOnClose;

        this.$backdrop = $("<div class='olb-backdrop'><div class='olb-wrapper'></div></div>");
        $("section").prepend(this.$backdrop);
        this.$wrapper = this.$backdrop.find('.olb-wrapper');
        this.addEventHandlers();
    }
    open(images) {
        this.activeIndex = 0;
        this.lock = false;
        let html = `
            <div class="olb-header">
                <h1 class="m-0">${this.title}</h1>
                <div class="olb-close">
                    <i class="icon-close"></i>
                </div>
            </div>
            <div class="olb-content">
                <div class="olb-images-wrapper">
                    <div class="olb-image" style="background-image: url('${images[0]}')">
                        <div class="olb-image-scroll-left"></div>
                        <div class="olb-image-scroll-right"></div>
                    </div>
                    <div class="olb-images">
                        <div class="olb-scroller olbs-left"></div>
                        <div class="olb-scroll-content">
                            ${images.map((item, index) => {
                                return `<div class="img-wrapper ${index === 0 ? 'active' : ''}" data-index="${index}"><img src="${item}" /></div>`
                            }).join('')}
                        </div>
                        <div class="olb-scroller olbs-right"></div>
                    </div>
                </div>
                <div class="olb-info">
                    <div><span class="tw-bold">${ OYO.labels.price }</span>: ${this.price}</div>
                    <div><span class="tw-bold">${ OYO.labels.year }</span>: ${this.year}</div>
                    <div class="mb-8"><span class="tw-bold">${ OYO.labels.mileageLong }</span>: ${this.mileage}</div>
                    <div class="adsns-wrapper" id="ad-for-popup-marker"></div>
                    <a href="${this.contactLink}" class="btn btn-lg btn-warning btn-block mt-auto" target="_blank">${OYO.labels.contactSeller}</a>
                </div>
            </div>
        `;
        this.$wrapper.html(html);
        $("body").addClass('noscroll');
        this.addScrollersEventHandlers();
        this.$backdrop.find('.img-wrapper').mouseenter(e => {
            this.activeIndex = $(e.currentTarget).data('index');
            this.renderImages();
        });
        this.$wrapper.find('.olb-close').click(() => {
            this.close();
        });
        $("header").css('visibility', 'hidden');
        this.$backdrop.addClass('active');
        this.setSize();
        this.fxOnOpen();
    }
    close() {
        $("body").removeClass('noscroll');
        this.$backdrop.removeClass('active');
        $("header").css('visibility', 'visible');
        this.fxOnClose();
    }
    setSize() {
        let wrapperHeight = this.$wrapper.height();
        let contentHeight = this.$wrapper.find('.olb-content').outerHeight(true);
        let imagesHeight = this.$wrapper.find('.olb-images').outerHeight(true);
        let headerHeight = this.$wrapper.find('.olb-header').outerHeight(true);
        let imageHeight = this.$wrapper.find('.olb-image').outerHeight();
        let imageMargin = this.$wrapper.find('.olb-image').outerHeight(true) - imageHeight;

        if(wrapperHeight < headerHeight + contentHeight) {
            let calcContentHeight = wrapperHeight - headerHeight;
            let calcImageHeight = calcContentHeight - imagesHeight - imageMargin;
            this.$wrapper.find('.olb-image').animate({
                height: `${calcImageHeight}px`
            }, 200);
        }
    }
    scroll(direction, step) {
        let sign = direction == 'left' ? '+' : '-';
        this.$wrapper.find('.olb-scroll-content').animate({
            left: sign + '=' + step
        }, 300, () => {
            this.lock = false;
        });
    }
    renderImages() {
        this.$wrapper.find('.img-wrapper').removeClass('active');
        let $activeImage = $(this.$wrapper.find('.img-wrapper')[this.activeIndex]);
        $activeImage.addClass('active');
        this.$wrapper.find('.olb-image').css('background-image', `url('${$activeImage.find('img').attr('src')}')`);
    }
    check(direction) {
        if(!this.lock) {
            let imagesCount = this.$wrapper.find('.img-wrapper').length;
            this.lock = true;
            
            let imagesWrapperWidth = this.$wrapper.find(".olb-images").outerWidth() - 2 * this.$wrapper.find(".olb-scroller").width();
            let offset = parseInt(this.$wrapper.find('.olb-scroll-content').css('left'));
            let imageWidth = $('.olb-wrapper .img-wrapper').outerWidth();

            if(direction == "left") {
                if (this.activeIndex == 0) {
                    this.lock = false;
                    return; 
                }
                this.activeIndex -= 1;
                this.renderImages();
                if ((this.activeIndex + 1) * imageWidth == Math.abs(offset)) {
                    this.scroll(direction, imageWidth);
                }
                else {
                    this.lock = false;
                }
            } 
            else {
                let diff = (this.activeIndex + 2) * imageWidth + offset - imagesWrapperWidth;
                if (this.activeIndex == imagesCount - 1) { 
                    this.lock = false;
                    return; 
                }
                this.activeIndex += 1;
                this.renderImages();
                if (diff > 0) {
                    this.scroll(direction, imageWidth);
                }
                else {
                    this.lock = false;
                }
            }
            
        }
    }
    addScrollersEventHandlers() {
        this.$wrapper.find('.olbs-left').click(() => {
            this.check('left');
        });
        this.$wrapper.find('.olbs-right').click(() => {
            this.check('right');
        });
        this.$wrapper.find('.olb-image-scroll-left').click(() => {
            this.check('left');
        });
        this.$wrapper.find('.olb-image-scroll-right').click(() => {
            this.check('right');
        });
    }
    addEventHandlers() {
        this.$backdrop.click(() => {
            this.close();
        });
        this.$wrapper.click(e => {
            e.stopPropagation();
        });
        $(document).on('keyup', e => {
            switch(e.which) {
                case 27: 
                    this.close();
                    break;
                case 37: 
                    this.check('left');
                    break;
                case 39: 
                    this.check('right');
                    break;
            }
        });
    }
}