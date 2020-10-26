import { OoyyoChart } from './ooyyo-chart.js';

export let mileagePriceGraphCaller = {
    getParams: function() {
        var graphParams = {
            idCountry: OYO.appParams.idCountry,
            idCurrency: OYO.appParams.idCurrency,
            idMake: OYO.carParams.idMake,
            idModel: OYO.carParams.idModel,
            year: OYO.carParams.year
        };
        if (OYO.carParams.mileage !== '' && OYO.carParams.mileage !== '-1') {
            graphParams.idRecord = OYO.appParams.idRecord;
            graphParams.mileage = OYO.carParams.mileage;
        }
        return graphParams;
    },

    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params));
    },

    api() {
        return '/ooyyo-services/resources/detailpage/mileagepricegraph';
    },

    showGraph: function(conf) {
        var graphParams = this.getParams();
        if (OYO.appParams.isNew !== "1") {

            fetch(this.endpoint(graphParams)).then(data => data.json()).then(data => {
                if (data) {
                    //console.log(data);
                    var diagramTitle = OYO.labels.diagramTitle
                                            .replace('{MAKE}', OYO.carParams.make)
                                            .replace('{MODEL}', OYO.carParams.model)
                                            .replace('{YEAR}', OYO.carParams.year);
                    var options = {
                        container: $('._js-chart-init'),
                        Xs: data.axisPoints.x,
                        Ys: data.axisPoints.y,
                        y_label: '', //LABELS.price,
                        x_label: '', //LABELS.mileage,
                        y_unit: OYO.appParams.currencySymbol,
                        x_unit: OYO.appParams.lengthUnitSymbol,
                        diagram_title: diagramTitle
                    };
                    var chart = new OoyyoChart();
                    chart.init(options);
                    chart.addResultPoints(data.points);
                    chart.addLine(data.line);
                    if (data.current) {
                        if(OYO.carParams.deal && parseInt(OYO.carParams.deal) > 0){
                            chart.addMainResult({x: data.current.x, y: data.current.y});    
                        }
                    }
                    if(conf && conf.addEventListeners){
                        chart.addEventListeners();
                    }
                }
            });
        }
    }
};

