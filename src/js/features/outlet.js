//@TODO delete these imports, used only as hardcoded data

// import resultData from '../outlet-hardcoded-data/result';
// import detailData from '../outlet-hardcoded-data/detail';

import { Slider } from './slider.js';

import { Stat } from './stat.js';

export class Outlet {
    
    constructor(pageName){
        this.pageName = pageName;
    }

    api() {
        return `//analytics.ooyyo.com/ooyyo-services/resources/cars/outlets`;
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params));
    }

    getOutletData(callback = () => {}) {
        var params = { ...OYO.utils.getParams(), pageName: this.pageName };
        fetch(this.endpoint(params))
            .then(data => data.json())
            .then(data => callback(data));
    }
    
    addSlider(position){
        $("#" + position + " .outlet-slider").each(function () {
            (new Slider($(this), 500));
        });
    }
    
    countImpressions(position, content){
        if( $(`#${position}`).find('[data-count-impression="true"]').length > 0 ) {
            const idSite = content[0].siteId;
            const idOutlet = content[0].outletId;
            Stat.countImpressions({idSite, idOutlet});
        }
    }

    handleData(data) {
        Object.keys(data).forEach(k => {
            let v = data[k];
            if(Array.isArray(v) && v.length) {
                try {
                    
                    let type = v[0].contentType;
                    let content = v[1];
                    const isDirectHTML = content[0] && content[0].data && content[0].dataType === "html";
                    const shouldParseJSON = content[0] && content[0].data && content[0].dataType === "json";

                    if(isDirectHTML) {
                        $("#" + k).html(content[0].data);
                    }
                    else {
                        if(shouldParseJSON) {
                            Object.keys(content).forEach(key => {
                                content[key].data = JSON.parse(content[key].data);
                            });
                        }
                        //use handlebars template and create html
                        let source = $("#template_" + type).html();
                        let template = Handlebars.compile(source);
                        let html = template(content);
                        //add to page
                        $("#" + k).html(html);
                        $(document).trigger('uc-new-items', [$("#" + k)]);

                        //add slider
                        this.addSlider(k);
                    }
                    //count impressions
                    this.countImpressions(k, v);
                    
                } catch (e) {
                    console.error('----OUTLET template error: ' + e);
                }
            }
        });
        $(document).trigger('outlet-data-loaded');
    }

    exec() {
        this.getOutletData(data => this.handleData(data));
        // switch(this.pageName) {
        //     case 'index':
        //         this.getOutletData(data => this.handleData(data));
        //         break;
        //     case 'result': 
        //         this.handleData(resultData);
        //         break;
        //     case 'detail': 
        //         this.handleData(detailData);
        //         break;
        // }
    }

};





