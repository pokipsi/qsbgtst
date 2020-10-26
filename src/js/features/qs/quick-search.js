import OSelect from '../o-select';
import DefaultSelector from './default-selector';

export default class QS {
    constructor({
        page = "index",
        orientation = "vertical"
    } = {}) {
        this.paramMap = this.getInitialParamMap();
        this.layoutManager = new LayoutManager({ 
            page, 
            fxOnParamSelected: this.onParamSelected.bind(this),
            fxOnZip: this.onZip.bind(this),
            fxOnReset: this.onReset.bind(this),
            paramMap: this.paramMap,
            orientation,
            qs: this
        });
        this.countries = [];
        this.cached = {};
        this.idTimeout = 0;
    }
    endpoint(paramMap) {
        if(paramMap.idMake) {
            return `../data/${paramMap.idMake}.json`;
        }
        return '../data/default.json';
        // return '/ooyyo-services/resources/quicksearch/qselements?json=' + encodeURIComponent(JSON.stringify(paramMap));
    }
    get(paramMap) {
        const endpoint = this.endpoint(paramMap);
        return fetch(endpoint).then(response => response.json()).then(data => {
            this.cached = data;
            const ret = { ...data };
            return new Promise((resolve, reject) => {
                resolve(ret);
            });
        });
    }
    getData() {
        return this.get(this.paramMap);
    }
    getRequiredParamMap() {
        let ret = {
            idDomain: OYO.appParams.idDomain,
            idCountry: OYO.appParams.idCountry,
            idLanguage: OYO.appParams.idLanguage,
            idCurrency: OYO.appParams.idCurrency,
            isNew: OYO.appParams.isNew,
            qsType: 'advanced'
        };
        return ret;
    }
    getInitialParamMap() {
        let ret = this.getRequiredParamMap();
        if (OYO.appParams.idMake !== '') {
            ret.idMake = OYO.appParams.idMake;
            if (OYO.appParams.idModel !== '') {
                ret.idModel = OYO.appParams.idModel;
                if (OYO.appParams.idTrim !== '') {
                    ret.idTrim = OYO.appParams.idTrim;
                }
            }
        }
        const otherParams = [
            'priceFrom', 'priceTo', 'yearFrom', 'yearTo', 'mileageFrom', 'mileageTo', 'idBodytype', 'idFueltype', 
            'zipCode', 'radius', 'idState', 'idCity', 'idTransmission', 'idColor', 'power'
        ];
        otherParams.forEach(paramName => {
            if (OYO.appParams[paramName] !== '') ret[paramName] = OYO.appParams[paramName];
        });
        return ret;
    }
    onParamSelected(name, value, removeIfExists) {
        if(removeIfExists && this.paramMap[name] == value) {
            delete this.paramMap[name];
        } else {
            
            if(name == 'idMake') {
                delete this.paramMap['idModel'];
                delete this.paramMap['idTrim'];
            }
            if(name == 'idModel') {
                delete this.paramMap['idTrim'];
            }

            if(value == '-1' || value == '200000') {
                delete this.paramMap[name];   
            }else{
                this.paramMap[name] = value;
            }
        }
        this.getData().then(data => {
            this.layoutManager.render(data);
        });
    }
    onZip({ zipCode, radius }) {
        let sendRequest = false;
        if(zipCode) {
            if(zipCode != this.paramMap["zipCode"]) {
                this.paramMap["zipCode"] = zipCode;
                if(!this.paramMap['radius']) {
                    this.paramMap["radius"] = "30";
                }
                sendRequest = true;        
            }
        } else {
            if(radius) {
                this.paramMap["radius"] = radius;
                if(this.paramMap['zipCode']) {
                    sendRequest = true;
                }
            }
            else {
                delete this.paramMap['zipCode'];
                delete this.paramMap['radius'];
                sendRequest = true;
            }
        }
        if(sendRequest) {
            this.getData().then(data => {
                this.layoutManager.render(data);
            });
            return true;
        } else return false;
    }
    onReset() {
        this.paramMap = this.getRequiredParamMap();
        this.layoutManager.paramMap = this.paramMap;
        this.getData().then(data => {
            this.layoutManager.render(data);
        });
    }
    deleteParams() {
        delete this.paramMap.idMake;
        delete this.paramMap.idModel;
        delete this.paramMap.idTrim;
        delete this.paramMap.priceFrom;
        delete this.paramMap.priceTo;
        delete this.paramMap.yearFrom;
        delete this.paramMap.yearTo;
        delete this.paramMap.mileageFrom;
        delete this.paramMap.mileageTo;
        delete this.paramMap.idBodytype;
        delete this.paramMap.idFueltype;
        delete this.paramMap.zipCode;
        delete this.paramMap.radius;
        delete this.paramMap.idState;
        delete this.paramMap.idCity;
        delete this.paramMap.idTransmission;
        delete this.paramMap.idColor;
        delete this.paramMap.power;
    }
    init({ fixedSearchButton } = {}) {
        this.getData().then(data => {
            this.layoutManager.render(data);
        });
        $(document).on("qs-search", (e, paramMap, fxOnResponse = () => {}) => {
            this.get(paramMap).then(data => {
                fxOnResponse(data);
            })
        });
        $(document).on("qs-search-param-map", (e, fxOnParamMap = () => {}) => {
            fxOnParamMap(this.paramMap);
        });
        $(document).on("qs-search-initial-param-map", (e, fxOnParamMap = () => {}) => {
            fxOnParamMap(this.getInitialParamMap());
        });
    }
}

class LayoutManager {
    constructor({ page, fxOnParamSelected, fxOnZip, fxOnReset, paramMap, orientation, qs }) {
        this.page = page;
        this.orientation = orientation;
        this.paramMap = paramMap;
        this.fxOnParamSelected = fxOnParamSelected;
        this.fxOnZip = fxOnZip;
        this.fxOnReset = fxOnReset;
        this.enabled = false;
        this.loading = true;

        this.makeSelector = this.getMakeSelector();

        this.modelSelector = new DefaultSelector($("._js-qs-model"), this.onParamSelected.bind(this), OYO.labels.model, "idModel", "idModel", "name");
        this.trimSelector = new DefaultSelector($("._js-qs-trim"), this.onParamSelected.bind(this), OYO.labels.trim, "idTrim", "idTrim", "name");
    }
    onParamSelected(name, value, removeIfExists) {
        this.lock();
        this.fxOnParamSelected(name, value, removeIfExists);
    }
    onZip({ zipCode, radius }) {
        const shouldLock = this.fxOnZip({ zipCode, radius });
        if(shouldLock) this.lock();
    }
    lock() {
        this.loading = true;
        this.renderLock();
    }
    unlock() {
        this.loading = false;
        this.renderLock();
    }
    renderLock() {
        if(this.loading){
            $("._js-qs-lock").show();
        }else{
            $("._js-qs-lock").hide();
        }
    }
    render(data) {
        
        if(data.status == 1) {
            this.renderMakeSelector(data.makes);

            this.updateModelTrimSelectorsState();
    
            this.modelSelector.render(data.models.black, this.paramMap.idModel);
            this.trimSelector.render(data.trims.black, this.paramMap.idTrim);
            
        }

        this.unlock();
    }
    getMakeSelector() {
        return new OSelect({ 
            selector: "._js-qs-make",
            data: [{ idMake: -1, name: OYO.labels.make }], 
            fxPopulate: m => {
                if(m.divider) return "<li class='divider'></li>";
                let count = m.idMake == -1 ? '' : m.displayCount;
                return `<li data-id='${m.idMake}'>
                            <i class="logo-make logo-make-${m.idMake} mr-12"></i> 
                            <div>${m.name}</div>
                            <span class="ml-auto pr-16">${count}</span>
                        </li>`;
            },
            onInputSet: ($img, id) => {
                $img.attr('class', `o-select-img logo-make logo-make-${id}`);
            }, 
            onSelected: id => {
                this.onParamSelected("idMake", String(id));
            },
            idActive: -1,
            hasImage: true,
            accessors: {
                id: "idMake",
                name: "name"
            } 
        });
    }
    renderMakeSelector(input) {
        const topIds = input.top.map(make => make.idMake);
        let allButTop = input.black.filter(make => !topIds.includes(make.idMake));
        let makes = [{ idMake: -1, name: OYO.labels.make }, ...input.top, { divider: true }, ...allButTop];
        const selectedMake = this.paramMap.idMake || -1;
        this.makeSelector.setData(makes);
        this.makeSelector.updateList(makes);
        this.makeSelector.setSelectedItem(selectedMake);
        this.makeSelector.setInput();
    }
    updateModelTrimSelectorsState() {
        if(this.paramMap.idModel && this.paramMap.idModel > -1) {
            $("._js-qs-trim").removeAttr('disabled');
            if(OYO.utils.res.isMobile() || this.orientation == "vertical") {
                $("._js-qs-trim-wrapper").show();
            }
        }else{
            $("._js-qs-trim").attr('disabled', true);
            if(OYO.utils.res.isMobile() || this.orientation == "vertical") {
                $("._js-qs-trim-wrapper").hide();
            }
        }

        if(this.paramMap.idMake && this.paramMap.idMake > -1) {
            $("._js-qs-model").removeAttr('disabled');
            if(OYO.utils.res.isMobile() || this.orientation == "vertical") {
                $("._js-qs-model-wrapper").show();
            }
        }else{
            $("._js-qs-model").attr('disabled', true);
            if(OYO.utils.res.isMobile() || this.orientation == "vertical") {
                $("._js-qs-model-wrapper").hide();
            }
        }
    }
}

