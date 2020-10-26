let urlHashHelper = {
    lastHash: window.location.hash,
    namesMap: {},
    ignore: false,
    /**
     * @param {String} hashName - hash name
     * @param {Object} callbacks - object that holds callback functions for start and end
     * @returns undefined
     */
    register: function (hashName, callbacks) {
        if (hashName[0] !== '#') {
            hashName = '#' + hashName;
        }
        if (this.namesMap[hashName]) {
            alert('duplicate url hash: ' + hashName);
        } else {
            this.namesMap[hashName] = {};
            this.namesMap[hashName].callbackStart = callbacks.start;
            this.namesMap[hashName].callbackEnd = callbacks.end;
            this.namesMap[hashName].lastHash = "";
        }
    },
    changeHash: function (hashName, params) {
        if (!OYO.utils.blockHashFeature) {
            var duration = 500;
            if (!hashName) {
                hashName = '_';
            } else {
                if (hashName[0] !== '#') {
                    hashName = '#' + hashName;
                }
            }
            if (params) {
                if (params.duration) {
                    duration = params.duration;
                }
                if (params.recordLastHash) {
                    this.namesMap[hashName].lastHash = window.location.hash;
                }
                if (params.useLastHash) {
                    var _hashName = this.namesMap[hashName].lastHash;
                    if (!_hashName) {
                        _hashName = '_';
                    }
                    this.namesMap[hashName].lastHash = "";
                    hashName = _hashName;
                }
            }
            this.ignore = true;
            window.location.hash = hashName;

            var elem = window.location.hash.replace("#", "._js-hash-");

            if ($(elem).length > 0) {
                if(OYO.utils.res.isMobile()){
                    if (!$(elem).data('noscroll-m')) {
                        OYO.utils.scrollToThat({
                            what: $(elem),
                            duration: duration
                        });
                    }
                }
                else if(OYO.utils.res.isTablet()){
                    if (!$(elem).data('noscroll-t')) {
                        OYO.utils.scrollToThat({
                            what: $(elem),
                            duration: duration
                        });
                    }
                }
                else if(OYO.utils.res.isDesktop()){
                    if (!$(elem).data('noscroll-d')) {
                        OYO.utils.scrollToThat({
                            what: $(elem),
                            duration: duration
                        });
                    }
                }
            }
        }

    },
    executeHashFunction: function () {
        var hash = window.location.hash;
        if (!this.ignore) {
            if (this.namesMap[this.lastHash]) {
                this.namesMap[this.lastHash].callbackEnd();
            }
            if (this.namesMap[hash]) {
                this.namesMap[hash].callbackStart();
            }
        }
        this.ignore = false;
        this.lastHash = hash;
    }
};

export class URLHashHelper{
    constructor(){
        $(window).on('hashchange', function () {
            OYO.urlHashHelper.executeHashFunction();
        });
        return urlHashHelper;
    }
}