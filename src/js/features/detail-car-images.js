export let detailCarImages = {
    sliderLock: false,
    step: 0,
    limit: 100,
    hasMore: true,
    lightBoxOpened: false,
    loadedCount: 0,
    max: 14,
    setMax: function(max){this.max = max;},
    selectImage: function(current, newone) {
        if(current){
            current.removeClass("selected");    
        }
        newone.addClass("selected");
        this.updateMainImage(newone.find("img"));
    },
    updateMainImage: function(img, options) {
        $(".main-image img").attr("src", img.attr("src"));
    },
    getImages: function(callback) {
        var self = this;
        var params = {
            idRecord: OYO.appParams.idRecord.toString(),
            idCountry: OYO.appParams.idCountry.toString(),
            start: "0",
            limit: self.limit.toString()
        };
        if(OYO.appParams.idSite.toString() !== ""){
            params.idSite = OYO.appParams.idSite.toString();
        }
        $.getJSONData("/ooyyo-services/resources/carimages/smallimages", params, function(data) {
            if(callback) callback(data);
        });
    },
    loadImages: function(options) {
        var _self = this;
        var _limit = _self.limit.toString();
        if (options && options.limit) {
            _limit = options.limit.toString();
        }
        var params = {
            idRecord: OYO.appParams.idRecord.toString(),
            idCountry: OYO.appParams.idCountry.toString(),
            start: (_self.limit * _self.step).toString(),
            limit: _limit
        };
        if(OYO.appParams.idSite.toString() !== ""){
            params.idSite = OYO.appParams.idSite.toString();
        }
        if (_self.hasMore) {
            $.getJSONData("/ooyyo-services/resources/carimages/smallimages", params, function(data) {
                var count = 0;
                if (data.urls) {
                    count = OYO.utils.getCount(data.urls);
                }
                //if (data.hasMore.toString() !== "1") {
                    _self.hasMore = false;
                //}
                var main = $(".main-image");
                if (options && options.initial) {
                    main.append("<div class='magnifier'><span class='small'></span></div>");
                    $("body").append("<div class='images-overlay'><div class='wrapper'><h2></h2><a class='close'>&times;</a><div class='images-box'></div><div class='info'></div></div></div>");
                }
                if (!((count === 1 && data.urls[0].imageurl === $(".main-image img").attr("src")) || count === 0)) {
                    if (options && options.initial) {
                        main.append("<div class='left arrow'></div>");
                        main.append("<div class='right arrow'></div>");

                        var parent = $(".images-list-holder").parent();
                        parent.before("<div class='left arrow'></div>");
                        parent.after("<div class='right arrow'></div>");
                    }
                    var target;
                    if (options && options.mobile) {
                        target = $("#images-list-holder");
                    } else {
                        target = $(".images-list-holder");
                    }
                    $.each(data.urls, function(index, value) {
                        let imageUrl = value.imageurl;
                        _self.addSmallImage({imageUrl, target});    
                    });
                    //_self.calculateImagesHolderDimension();
                    _self.step += 1;
                }
                if (options && options.callback) {
                    options.callback.call();
                }
            });
        } else {
            if (options && options.callback) {
                options.callback.call();
            }
        }
    },
    
    addSmallImage: function({imageUrl, target, template, callback}){
        let image = new Image();
        image.onload = (e) => {
            let addFlag = this.loadedCount < this.max;
            if(addFlag){
                if(image.width > 60 && image.width > 60){
                    this.loadedCount += 1;
                    if(target){
                        if(template){
                            target.append(template.replace('#imageUrl#', imageUrl));
                        }else{
                            target.append(`<div class='img-wrap'><img alt='image' src='${imageUrl}' /></div>`);
                        }
                    }
                    if(callback){
                        callback({imageUrl, addFlag});
                    }
                }
            }
        };
        image.src = imageUrl;
    },
    loadAnotherImage: function(imgToReplace) {
        var _self = this;
        imgToReplace.remove();
        _self.loadImages({
            limit: 1,
            callback: function() {
                //_self.prepareLayout();
                _self.assignEventHandlers();
            }
        });
    },
    calculateImagesHolderDimension: function() {
        if ($(".images-box .images-list .central").width() > $(".images-box .images-list-holder").width()) {
            $(".images-box .images-list .central").css("left", "0");
            $(".images-box .images-list-holder").css("margin", "auto").css("position", "relative");
            $(".images-box .images-list .arrow").remove();
        } else {
            var w = $(".images-box .images-list").width() - 2 * $(".images-box .images-list .arrow").width();
            $(".images-box .images-list .central").css("width", w + "px");
        }
    },
    prepareLayout: function() {
        $(".images-box .images-list .holder")
                .css("width", $(".images-box .images-list .holder .img-wrap").length *
                        parseInt($(".images-box .images-list .holder .img-wrap").css("width")));
    },
    openLightBox: function() {
        var _self = this;
        $(".images-overlay h2").html(OYO.carParams.make + " " + OYO.carParams.model + " " + OYO.carParams.trim);
        
        var firstImage = $($(".images-list img")[0]);
        var selectedImage = $($(".images-list img.selected")[0]);
        this.selectImage(selectedImage, firstImage);
        this.updateMainImage(firstImage);
        
        var mainImage = $(".main-image").clone(true);
        var imagesList = $(".images-list").clone(true);
        $(".images-box").append(mainImage).append(imagesList);
        $('.images-box .magnifier').remove();
        $('.images-box .main-image').removeClass('preview');
        $(".images-overlay").fadeIn(200);
        $(".images-list").addClass("large");
        var ad_info_html =
                "<hr>" +
                "<strong>" + OYO.labels.price + "</strong>" + ": " + OYO.carParams.displayPrice + "<br>" +
                "<strong>" + OYO.labels.year + "</strong>" + ": " + OYO.carParams.year + "<br>";
        if (OYO.carParams.mileage !== '' && OYO.carParams.mileage.toString() !== '-1') {
            ad_info_html += "<strong>" + OYO.labels.mileage + "</strong>" + ": " + OYO.carParams.displayMileage + "<br>";
        }
        ad_info_html += "<hr>";
        $(".images-overlay .info")
                .empty()
                .append("<div class='ad-info'>"+ad_info_html+"</div><div id='ad-for-popup-marker'></div>")
                .append($("#contactSeller").clone());
        _self.moveAdsns({'movein' : true});
        _self.calculateImagesHolderDimension();
//        OYO.utils.adjustImageJQ(mainImage.find("img"));
        _self.prepareLayout();
        window.location.href = "#images";
        _self.lightBoxOpened = true;
    },
    closeLightBox: function(){
        var firstImage = $($(".images-list img")[0]);
        var selectedImage = $($(".images-list img.selected")[0]);
        this.selectImage(selectedImage, firstImage);
        this.updateMainImage(firstImage);
        
        var _self = this;
        //var imagesList = $(".images-list").detach();
        $(".images-box").html("");
        //$(".main-image.preview").after(imagesList);
        $(".images-list").removeClass("large");
        //_self.calculateImagesHolderDimension();
        $(".images-overlay").fadeOut(200);
        //_self.prepareLayout();
        window.location.href = "#default";
        _self.moveAdsns({'moveout' : true});
        _self.lightBoxOpened = false;
    },
    moveAdsns: function(options){
        $('html,body').animate({scrollTop:0}, 200, function(){
            var offset = $("#ad-for-popup-marker").offset();
            var adsns_fxd_style = {};
            if(options.movein === true){
                adsns_fxd_style = {
                    'position': 'fixed',
                    'top': offset.top,
                    'left': offset.left,
                    'z-index': '10000000'
                };
            }else if(options.moveout === true){
                adsns_fxd_style = {
                    'position': 'initial',
                    'top': 'auto',
                    'left': 'auto',
                    'z-index': '1'
                };
            }
            let adHeight = $("#ad-for-popup").height();
            $("#ad-for-popup-marker").height(adHeight);
            $('#ad-for-popup').css(adsns_fxd_style);
        });
    },
    assignEventHandlers: function() {
        var _self = this;
        $(".images-list .holder").on('mouseover', '.img-wrap', function(e) {
            let current = $(".images-list .holder .img-wrap.selected");
            let newone = $(this);
            _self.selectImage(current, newone);
        });
        $(".magnifier").click(function() {
            _self.openLightBox();
        });
        $(".images-overlay, .images-overlay .close ").click(function(e) {
            _self.closeLightBox();
        });
        $(".images-overlay .wrapper").click(function(e) {
            e.stopPropagation();
        });
        $(".main-image").mouseenter(function() {
            $(".magnifier").addClass('add-bg');
        });
        $(".main-image").mouseleave(function() {
            $(".magnifier").removeClass('add-bg');
        });
        
        var gotoLeft = function() {
            if ($(".images-list .holder .img-wrap.selected").length > 0) {
                _self.slide({direction: "left"});
            } else {
                var img1 = $($($(".images-list .holder")[0]).find(".img-wrap")[0]);
                img1.addClass('selected');
                var img2 = $($($(".images-list .holder")[1]).find(".img-wrap")[0]);
                img2.addClass('selected');
                _self.updateMainImage(img1.find("img"));
            }
        };
        
        var gotoRight = function() {
            if ($(".images-list .holder .img-wrap.selected").length > 0) {
                _self.slide({direction: "right"});
            } else {
                var img1 = $($($(".images-list .holder")[0]).find(".img-wrap")[0]);
                img1.addClass('selected');
                var img2 = $($($(".images-list .holder")[1]).find(".img-wrap")[0]);
                img2.addClass('selected');
                _self.updateMainImage(img1.find("img"));
            }
        };
        
        $(".left.arrow").click(gotoLeft);
        $(".right.arrow").click(gotoRight);
    },
    loadMoreImages: function(options) {
        var _self = this;
        _self.loadImages({
            callback: function() {
                //_self.prepareLayout();
                $(".images-list .holder .img-wrap").mouseover(function() {
                    _self.selectImage($(".images-list .holder .img-wrap.selected"), $(this));
                });
                options.callback.call();
            }
        });
    },
    slide: function(options) {
        var _self = this;
        var visible_part_width = $(".images-box .images-list").width() - 2 * $(".images-box .images-list .arrow").width();
        var full_width = $(".images-box .images-list .holder").width();
        var step = $(".images-box .images-list .holder .img-wrap").width() + 2;
        var selected = $(".images-box .images-list .holder .img-wrap.selected");
        if (!_self.sliderLock) {
            if (options.direction === "left") {
                if (selected.prev().length !== 0) {
                    _self.selectImage(selected, selected.prev());
                }
                if (full_width > visible_part_width) {
                    _self.sliderLock = true;
                    var duplicate = $(".images-box .images-list .holder .img-wrap").last().clone(true);
                    $(".images-box .images-list .holder .img-wrap").last().hide();
                    $(".images-box .images-list .holder").prepend(duplicate).css("left", "-" + step + "px");
                    $(".images-box .images-list .holder").animate({
                        left: "+=" + step
                    }, 400, function() {
                        $(".images-box .images-list .holder .img-wrap").last().remove();
                        _self.sliderLock = false;
                    });
                }else{
                    if (selected.prev().length === 0) {
                        _self.selectImage(selected, $(".images-box .images-list .holder .img-wrap").last());
                    }
                }
            }
            else if (options.direction === "right") {
                if (selected.next().length !== 0) {
                    _self.selectImage(selected, selected.next());
                }
                if (full_width > visible_part_width) {
                    _self.sliderLock = true;
                    $(".images-box .images-list .holder").animate({
                        left: "-=" + step
                    }, 400, function() {
                        var move = $(".images-box .images-list .holder .img-wrap").first().detach();
                        $(".images-box .images-list .holder").append(move).css("left", 0);
                        //call more images
                        _self.loadMoreImages({
                            callback: function() {
                                _self.sliderLock = false;
                            }
                        });
                    });
                }else{
                    if (selected.next().length === 0) {
                        _self.selectImage(selected, $(".images-box .images-list .holder .img-wrap").first());
                    }
                }
            }
        }
    }
};

