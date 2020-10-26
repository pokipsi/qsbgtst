export class Stat {

    api(type) {
        return `//analytics.ooyyo.com/ooyyo-services/resources/counter/count_${type}`;
    }
    endpoint(type, params) {
        return this.api(type) + '?json=' + encodeURIComponent(JSON.stringify(params));
    }

    static count(params = {}){

        const _ = OYO.appParams;

        let year = _.yearFrom;
        if (!year) {
            year = _.yearTo ? _.yearTo : "-1";
        }
        let price = _.priceFrom;
        if (!price) {
            price = _.priceTo ? _.priceTo : "-1";
        }
        let mileage = _.mileageFrom;
        if (!mileage) {
            mileage = _.mileageTo ? _.mileageTo : "-1";
        }
        let defaultParams = {
            searchCountry: _.idCountry,
            language: _.idLanguage,
            pageType: _.idPageType,
            shouldIndex: _.shouldIndex ? _.shouldIndex : "0",
            code: _.code ? _.code : "",
            referrer: document.referrer,
            pageNum: _.page ? _.page : "0",
            make: _.idMake ? _.idMake : "-1",
            model: _.idModel ? _.idModel : "-1",
            trim: _.idTrim ? _.idTrim : "-1",
            state: _.idState ? _.idState : "-1",
            city: _.idCity ? _.idCity : "-1",
            zipcode: _.zipCode ? _.zipCode : "-1",
            bodytype: _.idBodytype ? _.idBodytype : "-1",
            fueltype: _.idFueltype ? _.idFueltype : "-1",
            power: _.power ? _.power : "-1",
            year: year,
            mileage: mileage,
            price: price,
            transmission: _.idTransmission ? _.idTransmission : "-1",
            color: _.idColor ? _.idColor : "-1",
            screen: OYO.utils.res.getScreenType()
        };
        let inputParams = {...defaultParams, ...params};
        OYO.utils.logParams(inputParams);
    }
    static countImpressions( {idSite, idOutlet}){
        Stat.countByType(idSite, idOutlet, "impressions");
    }

    static countClicks( {idSite, idOutlet}){
        Stat.countByType(idSite, idOutlet, "clicks");
    }

    static countByType(idSite, idOutlet, type) {
        const params = {
            idMake: OYO.carParams.idMake ? OYO.carParams.idMake : "-1",
            idModel: OYO.carParams.idModel ? OYO.carParams.idModel : "-1",
            idCountry: OYO.appParams.idCountry,
            idSite: idSite.toString(),
            idOutlet: idOutlet.toString(),
            referrer: document.referrer ? document.referrer : "",
            destUrl: OYO.Other.destUrl,
            width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
        };
        fetch(this.endpoint(type, params)).then(data => data.json()).then(data => {
        });
    }

    static countQSElementsUsage(field) {
//        Stat.count({
//            code: "qs",
//            referrer: field
//        });
    }

    static countFilterClicks(name) {
//        Stat.count({
//            code: "filter",
//            referrer: name
//        });
    }
    ;
            static countFHCUpdate( { fhcType }) {
//        Stat.count({
//            code: fhcType,
//            referrer: "update"
//        });
    }
    ;
            static countFHCDisplay( { fhcType }) {
//        Stat.count({
//            code: fhcType,
//            referrer: "display"
//        });
    }
    ;
            static countPageOnReady() {
  //      console.log("sent page-open");
  //      Stat.count({
  //          code: "page-open"
  //      });
    }
    ;
            static countShareEvent(action) {
//        console.log("sent share " + action);
//        Stat.count({
//            code: "share",
//            referrer: action
//        });
    }
    ;
}