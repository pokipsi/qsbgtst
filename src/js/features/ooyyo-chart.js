export let OoyyoChart = function () {
    var _self = this;
    var widthRatio = 3 / 4;
    var container, X_MAX_VALUE, Y_MAX_VALUE;

    var tooltip;
    var tooltipCounter = 0;
    var x_label, y_label, x_unit, y_unit;
    var X_SHIFT = 0;
    var Y_SHIFT = 0;

    _self.CONF = {
        MAP_PADDING: 50,
        LABEL_WIDTH: 60,
        LABEL_HEIGHT: 15
    };

    _self.init = function (options) {
        /*za ovo nam je potrebno:
         - visina
         - sirina
         - y tacke
         - x tacke
         prvo se kreira pravougaonik, zatim se dodaju tacke na ose
         dimenizje pravougaonika se racunaju na sledeci nacin:
         - sirina zavisi od kontejnera u koji se ubacuje grafik
         - visina zavisi od sirine, racuna se na osnovu nekog koeficijenta, npr k=3/4
         
         options.container - kontejner u koji se ubacuje koordinatni sistem
         options.Xs, options.Ys - tacke na apscisi, odnosno, ordinati
         options.sizeRatio - koeficijent kojim se mnozi sirina da bi se izracunala visina, po defaultu je 3/4
         */

        x_label = options.x_label;
        y_label = options.y_label;

        x_unit = options.x_unit;
        y_unit = options.y_unit;

        container = options.container;
        var pixelWidth = container.width();

        var pixelHeight = pixelWidth * widthRatio;
        if (options.widthRatio) {
            pixelHeight = pixelWidth * options.widthRatio;
        }

        tooltip = $('<div>').addClass('tooltip');

        X_MAX_VALUE = options.Xs.sort(function (a, b) {
            return b - a;
        })[0];
        Y_MAX_VALUE = options.Ys.sort(function (a, b) {
            return b - a;
        })[0];

        container
                .addClass("graph-container")
                .width(pixelWidth)
                .height(pixelHeight)
                .append(tooltip)
                .fadeIn(100);
        _self.createSVGMap(container);

        //ORDER IMPORTANT
        _self.addTitle(options.diagram_title);
        _self.addAbscisa();
        _self.addOrdinate();
        _self.setShifts(options.Xs, options.Ys);
        _self.addAbscisaPoints(options.Xs);
        _self.addOrdinatePoints(options.Ys);

        _self.addAxisLabels();
    };

    _self.addTitle = function (title) {
        container.before("<h4 class='chart-heading'>" + title + "<span class='chart-beta'>BETA</span></h4>");
    };

    _self.addAxisLabels = function () {
        var x_label_element = $("<div>")
                .addClass("axis-label")
                .addClass("x")
                .html(x_label + " [" + x_unit + "]");
        var y_label_element = $("<div>")
                .addClass("axis-label")
                .addClass("y")
                .html(y_label + " [" + y_unit + "]");
        container
                .append(x_label_element)
                .append(y_label_element);
    };

    _self.addMainResult = function (point) {
        _self.addPoint({
            x: point.x,
            y: point.y,
            radius: 6,
            cssClass: 'mainPoint',
            dataParams: [
                {name: 'id', value: point.idRecord},
                {name: 'x', value: point.x},
                {name: 'y', value: point.y},
                {name: 'img', value: point.imgUrl}
            ]
        });
//        _self.addLabel({
//            cssClass: 'x',
//            text: 'Selected car',
//            top: point.y,
//            left: point.x
//        });
    };

    _self.addResultPoints = function (points) {
        $.each(points, function (key, value) {
            _self.addPoint({
                x: value.x,
                y: value.y,
                radius: 4,
                cssClass: 'resultPoint',
                dataParams: [
                    {name: 'id', value: value.idRecord},
                    {name: 'x', value: value.x},
                    {name: 'y', value: value.y},
                    {name: 'img', value: value.imgUrl}
                ]
            });
        });
    };

    _self.setShifts = function (Xs, Ys) {
        X_SHIFT = Math.min.apply(Math, Xs);
        Y_SHIFT = Math.min.apply(Math, Ys);
    };

    _self.addAbscisaPoints = function (points) {
        var min_x = Math.min.apply(Math, points);
        for (var i = 0; i < points.length; i++) {
            _self.addLabel({
                cssClass: 'x',
                text: points[i],
                top: 0 + Y_SHIFT,
                left: points[i],
                adjust_x: true
            });
            if (points[i] !== min_x) {
                _self.addLine({
                    startPoint: {
                        x: points[i],
                        y: 0 + Y_SHIFT
                    },
                    endPoint: {
                        x: points[i],
                        y: Y_MAX_VALUE
                    },
                    cssClass: "grid"
                });
            }
            _self.addPoint({
                x: points[i],
                y: 0 + Y_SHIFT,
                radius: 2,
                cssClass: 'abscisaPoint'
            });
        }
    };

    _self.addOrdinatePoints = function (points) {
        var min_y = Math.min.apply(Math, points);
        for (var i = 0; i < points.length; i++) {
            _self.addLabel({
                cssClass: 'y',
                text: points[i],
                top: points[i],
                left: 0 + X_SHIFT,
                adjust_y: true
            });
            if (points[i] !== min_y) {
                _self.addLine({
                    startPoint: {
                        x: 0 + X_SHIFT,
                        y: points[i]
                    },
                    endPoint: {
                        x: X_MAX_VALUE,
                        y: points[i]
                    },
                    cssClass: "grid"
                });
            }
            _self.addPoint({
                x: 0 + X_SHIFT,
                y: points[i],
                radius: 2,
                cssClass: 'ordinatePoint'
            });
        }
    };

    _self.addAbscisa = function () {
        _self.addLine({
            startPoint: {
                x: 0,
                y: 0
            },
            endPoint: {
                x: X_MAX_VALUE,
                y: 0
            },
            cssClass: "abscisa"
        });
    };
    _self.addOrdinate = function () {
        _self.addLine({
            startPoint: {
                x: 0,
                y: 0
            },
            endPoint: {
                x: 0,
                y: Y_MAX_VALUE
            },
            cssClass: "ordinate"
        });
    };

    _self.addPoint = function (data) {
        var center = _self.getCoordinatesForRealValues(data.x, data.y);
        var params = {
            center: center,
            radius: data.radius,
            cssClass: data.cssClass
        };
        if (data.dataParams) {
            params.dataParams = data.dataParams;
        }
        var point = _self.getCircle(params);
        container.find("svg").append(point);
    };

    _self.addLine = function (data) {
        var startPoint = _self.getCoordinatesForRealValues(data.startPoint.x, data.startPoint.y);
        var endPoint = _self.getCoordinatesForRealValues(data.endPoint.x, data.endPoint.y);
        var line = _self.getLine({
            startPoint: startPoint,
            endPoint: endPoint,
            cssClass: data.cssClass
        });
        container.find("svg").append(line);
    };

    _self.addLabel = function (data) {
        var coordinates = _self.getCoordinatesForRealValues(data.left, data.top);
        var left = coordinates.x;
        var top = coordinates.y;
        if (data.adjust_y) {
            left -= _self.CONF.LABEL_WIDTH;
            top -= _self.CONF.LABEL_HEIGHT / 2;
        }
        if (data.adjust_x) {
            left -= _self.CONF.LABEL_WIDTH / 2;
        }
        var label = $("<div class='label'>").addClass(data.cssClass).css({
            left: left,
            top: top
        }).text(data.text);
        container.append(label);
    };

    _self.getCircle = function (data) {
        var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', data.center.x);
        circle.setAttribute('cy', data.center.y);
        circle.setAttribute('r', data.radius);
        circle.setAttribute('class', data.cssClass);
        if (data.dataParams) {
            $.each(data.dataParams, function (key, value) {
                circle.setAttribute('data-' + value.name, value.value);
            });
        }
        return circle;
    };

    _self.getLine = function (data) {
        var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', data.startPoint.x);
        line.setAttribute('y1', data.startPoint.y);
        line.setAttribute('x2', data.endPoint.x);
        line.setAttribute('y2', data.endPoint.y);
        line.setAttribute('class', data.cssClass);
        return line;
    };

    _self.createSVGMap = function (container) {
        container.append("<svg class='map'></svg>");
    };

    _self.getCoordinates = function (x, y) {
        /** Posto je referentna tacka za svg mapu gornji levi ugao (0, 0), 
         a vizuelno to treba da bude donji levi (0, svg_map_height),
         plus treba uracunati padding (npr. 10px) da bi se crtale i tacke koje delom izlaze iz okvira koordinatnog sistema, 
         treba preslikati vrednosti tako da (0, 0) -> (padding, svg_map_height - padding)
         "pomereni" koordinatni sistem i svg mapa treba da se poklapaju u centru, 
         a ne u nekom od cetiri ugla.
         */

        var MAP_WIDTH = container.find("svg").width();
        var MAP_HEIGHT = container.find("svg").height();

        /**    
         * izracunati koeficijent prelikavanja preko formule:
         */
        var CHART_WIDTH = MAP_WIDTH - 2 * _self.CONF.MAP_PADDING;
        var CHART_HEIGHT = MAP_HEIGHT - 2 * _self.CONF.MAP_PADDING;
        var WIDTH_COEFFICIENT = MAP_WIDTH / CHART_WIDTH;
        var HEIGHT_COEFFICIENT = MAP_HEIGHT / CHART_HEIGHT;

        /**
         * proporcionalno smanjiti koorodinatni sistem, zatim, posto rezultujuci ima referentnu tacku u (0, 0), 
         * pomeriti sve za PADDING
         */
        var ret = {};
        ret.x = x / WIDTH_COEFFICIENT + _self.CONF.MAP_PADDING;
        ret.y = (MAP_HEIGHT - y) / HEIGHT_COEFFICIENT + _self.CONF.MAP_PADDING;
        return ret;
    };

    _self.getCoordinatesForRealValues = function (valueX, valueY) {
        //uracunati pomeraj
        valueX = valueX - X_SHIFT;
        valueY = valueY - Y_SHIFT;

        var MAP_WIDTH = container.find("svg").width();
        var MAP_HEIGHT = container.find("svg").height();

        var x = (MAP_WIDTH * valueX) / (X_MAX_VALUE - X_SHIFT);
        var y = (MAP_HEIGHT * valueY) / (Y_MAX_VALUE - Y_SHIFT);

        return _self.getCoordinates(x, y);
    };

    _self.showTooltip = function (data) {
        tooltipCounter += 1;
        var counter = tooltipCounter;
        setTimeout(function () {
            if (counter === tooltipCounter) {
                tooltip.hide().html(data.html).css({
                    top: data.position.top,
                    left: data.position.left
                }).fadeIn(200);
            }
        }, 200);
    };

    _self.hideTooltip = function () {
        tooltipCounter += 1;
        tooltip.hide();
    };

    _self.addEventListeners = function () {
        $(document).on('mouseenter', '.resultPoint, .mainPoint', function () {
            var left = parseInt($(this).attr('cx')) + 20;
            var top = parseInt($(this).attr('cy')) + 20;
            _self.showTooltip({
                html: "<p><strong>" + y_label + " [" + y_unit + "]" + ": </strong>" + $(this).data('y') + "</p>" +
                        "<p><strong>" + x_label + " [" + x_unit + "]" + ": </strong>" + $(this).data('x') + "</p>" +
                        "<img src='" + $(this).data('img') + "' onerror='OYO.lpr.setNoPhoto(this);' alt='image'/>",
                position: {
                    top: top,
                    left: left
                }
            });
        });

        $(document).on('mouseleave', '.resultPoint, .mainPoint', function () {
            _self.hideTooltip();
        });

        $(document).on('click', '.resultPoint', function () {
            var url = window.location.href.replace(OYO.appParams.idRecord, $(this).data('id'));
            OYO.utils.gotoPage({
                url: url
            });
        });
    };
};