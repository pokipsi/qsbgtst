export class PromoVideo {
    static addToPage($selector){
        let $obj = $("<div/>").hide();
        let html = `
        
        <div class="promo-android-wrapper">
            <a href="https://play.google.com/store/apps/details?id=com.oyo.oyoapp" target="_blank" class='promo-android' id="promo-android">
                <div class="header-part">
                    <div class="logo-part">
                        <img src='${OYO.images.OOYYO_HEAD}'/>
                        <div class="rating-part">
                            <span>OOYYO Android App</span>
                            <img src="${OYO.images.RATING}" alt=''>
                        </div>
                    </div>
                    <div class="badge-part">
                        <img src='${OYO.images.GP_BADGE}' alt='Google Play'/>
                    </div>
                </div>
                <div class="info-part">
                    ${OYO.labels.moreCountriesAndFeatures}
                </div>
                <div class="video-part">
                    <iframe src='https://www.youtube.com/embed/tK2FDqPAz4Q'
                        width='640' height='360' frameborder='0' allowfullscreen>
                    </iframe>
                </div>
            </a>
        </div>
        
        `;
        $obj.html(html);
        $selector.replaceWith($obj);
        $obj.slideDown(300);
    }
}

