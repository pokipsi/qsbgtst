export class ListingPhotoRecovery {

    constructor() {
        this.recoverImages = {};
        this.detailMainImageCounter = 0;
    }

    recoverResultImage(img, idRecord) {
        var images = this.recoverImages[idRecord].images;
        var counter = this.recoverImages[idRecord].counter;
        if (counter <= images.length - 1) {
            img.setAttribute('src', null);
            img.setAttribute('src', images[counter]);
            this.recoverImages[idRecord].counter += 1;
        } else {
            img.removeAttribute('onerror');
            img.setAttribute('src', null);
            img.setAttribute('src', OYO.images.NO_IMAGE);
        }
    }
    
    onResultImagesLoad(img){
        let self = this;
        if($(img).width() < 60 || $(img).height() < 60){
            self.onResultImagesError(img);
        }
    }
    
    onResultImagesError(img) {
        let self = this;
        let idRecord = img.getAttribute("data-record").toString();

        if (self.recoverImages[idRecord]) {
            //recover image from utils
            self.recoverResultImage(img, idRecord);
        } else {
            var params = {
                idRecord: idRecord,
                idCountry: OYO.appParams.idCountry,
                idPageType: OYO.appParams.idPageType
            };

            //send request
            fetch(this.endpoint(params)).then(data => data.json()).then(data => {
                let urls = data.urls;
                let images = [];
                Object.keys(urls).map(key => {
                    Object.keys(urls[key]).map(innerKey => {
                        if (img.getAttribute("src") !== urls[key][innerKey].imageurl) {
                            images.push(urls[key][innerKey].imageurl);
                        }
                    });
                });
                this.recoverImages[idRecord] = {};
                this.recoverImages[idRecord].images = images;
                this.recoverImages[idRecord].counter = 0;
                this.recoverResultImage(img, idRecord);
            });
        }
    }
    
    onDetailImageLoad(img){
        let self = this;
        if($(img).width() < 60 || $(img).height() < 60){
            self.onDetailImageError(img);
        }
    }
    
    onDetailImageError(img) {
        let urls = OYO.detailImageUrls;
        if (urls.length > 1 && (this.detailMainImageCounter < urls.length - 1)) {
            this.detailMainImageCounter += 1;
            img.setAttribute("src", null);
            img.setAttribute("src", urls[this.detailMainImageCounter].imageUrl);
            try {
                let sellerUrl = urls[this.detailMainImageCounter].pageUrl;
                let sellerUrlWithDeviceType = OYO.utils.addDeviceTypeToURL(sellerUrl);
                sellerUrlWithDeviceType = sellerUrlWithDeviceType.split("&amp;").join("&");
                $("#contactSeller").attr('href', sellerUrlWithDeviceType);
            } catch (ex) {

            }
        } else {
            img.removeAttribute('onerror');
            img.setAttribute('src', null);
            img.setAttribute('src', OYO.images.NO_IMAGE);
            $(img).parent().addClass("noimage");
        }
    }
    checkSize(img) {
        let self = this;
        if($(img).width() < 60 || $(img).height() < 60){
            self.setNoPhoto(img);
        }
    }
    setNoPhoto(img) {
        img.removeAttribute('onload');
        img.removeAttribute('onerror');
        img.setAttribute('src', null);
        img.setAttribute('src', OYO.images.NO_IMAGE);
    }
    api() {
        return `/ooyyo-services/resources/carimages/mainimages`;
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params));
    }
}
