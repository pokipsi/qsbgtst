OYO.Dropdown = {};
OYO.Dropdown.activeDropdown = null;

let Dropdown = function (selectorName, listName) {
    var self = this,
        urlHashName = 'dd-' + selectorName.replace('#', '');
    var open = function (options) {
        
        if(OYO.Dropdown.activeDropdown){
            OYO.Dropdown.activeDropdown.closePublic();
        }
        OYO.Dropdown.activeDropdown = self;
        
        self.doBeforeOpening();
        if (!OYO.utils.res.isDesktop()) {
            $("header").hide();
            $(listName).fadeIn(200);
        } else {
            $(listName).slideDown(10);
        }
        if (options && options.changehash) {
            OYO.urlHashHelper.changeHash(urlHashName);
        }
    };
    var close = function (options) {
        self.doBeforeClosing();
        $(listName).fadeOut(10);
        $("header").show();
        if (options && options.changehash) {
            OYO.urlHashHelper.changeHash("_");
        }
    };
    this.closePublic = close;
    this.doOnItemSelected = function () {
    };
    this.doBeforeOpening = function(){
    };
    this.doBeforeClosing = function(){  
    };
    this.doOnFilter = function () {
    };
    OYO.urlHashHelper.register(urlHashName, {
        start: function () {
            open();
        },
        end: function () {
            close();
        }
    });
    $(document).on("click", selectorName, function (e) {
        var dropdownOpen = $(listName).is(':visible');
        if (dropdownOpen) {
            close({changehash: true});
        } else {
            open({changehash: true});
        }
        e.stopPropagation();
    });
    $(document).on("click", listName + " li", function (e) {
        self.doOnItemSelected($(this), e);
    });
    $(document).on("click", listName + " input", function (e) {
        e.stopPropagation();
    });
    $(document).on("keyup", listName + " input", function (e) {
        self.doOnFilter($(this), e);
    });
    $(document).on("click", listName + " .heading", function (e) {
        e.stopPropagation();
    });
    $(document).on("click", listName + " .heading .close", function (e) {
        close({changehash: true});
    });
    $(document).on("click", "body", function () {
        close({changehash: true});
    });
    $(document).keydown(function (e) {
        if (e.which === 27) {
            close({changehash: true});
        }
    });
};

export { Dropdown };


