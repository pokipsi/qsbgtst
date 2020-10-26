export default class ImagesUI {
    constructor({ urls, limit, $target, minimumImageSize = 60, fxOnHover = () => {}, fxOnClick = () => {}, fxOnCheckDone = () => {} }) {
        this.minimumImageSize = minimumImageSize;
        this.$target = $target;
        this.urls = urls;
        this.perPage = limit;
        this.chunksCount = Math.floor(urls.length / this.perPage) + 1;
        this.trailingChunkIndex = -1;
        this.loadingState = {
            success: 0,
            failed: Number.MAX_SAFE_INTEGER,
            targetSum: 0
        }
        this.onHover = fxOnHover;
        this.onClick = fxOnClick;
        this.passedUrls = [];
        this.onCheckDone = fxOnCheckDone;
    }
    addImage(url, callback = () => {}){
        let image = new Image();
        image.onload = e => {
            if(image.width > this.minimumImageSize && image.height > this.minimumImageSize) {
                this.loadingState.success += 1;
                callback();
            } else {
                this.loadingState.failed += 1;
            }
            this.check();
        };
        image.onerror = e => {
            this.loadingState.failed += 1;
            this.check();
        };
        image.src = url;
    }
    check() {
        let { success, failed, targetSum} = { ...this.loadingState };
        if(failed + success == targetSum) {
            if(failed) {
                this.do();
            }
            else {
                this.onCheckDone(this.passedUrls);
            }
        }
    }
    addToPage({ chunk }) {
        chunk.forEach(url => {
            this.addImage(url.imageurl, () => { 
                let $wrapper = $(`<div class="img-wrapper"><img src="${url.imageurl}" data-site="${url.idSite}" /></div>`);
                $wrapper.on('mouseenter', () => {
                    this.onHover($wrapper);
                });
                $wrapper.on('click', () => {
                    this.onClick($wrapper);
                });
                this.$target.append($wrapper);
            });
        });
    }
    addToPassedUrls({ chunk }) {
        chunk.forEach(url => {
            this.addImage(url.imageurl, () => { 
                this.passedUrls.push(url.imageurl);
            });
        });
    }
    do() {
        this.trailingChunkIndex = Math.min(this.perPage, this.urls.length, this.loadingState.failed);
        this.loadingState.success = 0;
        this.loadingState.failed = 0;
        let chunk = this.urls.splice(0, this.trailingChunkIndex);
        this.loadingState.targetSum = chunk.length;
        if(chunk.length) {
            this.$target ? this.addToPage({ chunk }) : this.addToPassedUrls({ chunk });
        }
    }
}