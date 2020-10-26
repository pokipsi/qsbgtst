/* 
 ovo je samo za mobilnu, posto za desktop ide sve preko jsp-a, a za mobilnu treba podrska za swipe
 */
import { StringBuilder } from '../utils/string-builder.js';
import { Dropdown } from './dropdown.js';

export let sorter = {
    getHTML: function () {
        var sb = new StringBuilder();
        sb.append("<ul class='sorter-list'>");
        if (OYO.sorterData.priceAsc) {   
            sb.append("<li><a class='_js-link _id-price-0' data-where='" + OYO.sorterData.priceAsc + "'>" + OYO.labels.price + "<span>▲</span></a></li>");
        }
        if (OYO.sorterData.priceDesc) {
            sb.append("<li><a class='_js-link _id-price-1' data-where='" + OYO.sorterData.priceDesc + "'>" + OYO.labels.price + "<span>▼</span></a></li>");
        }
        if (OYO.sorterData.yearAsc) {
            sb.append("<li><a class='_js-link _id-year-0' data-where='" + OYO.sorterData.yearAsc + "'>" + OYO.labels.year + "<span>▲</span></a></li>");
        }
        if (OYO.sorterData.yearDesc) {
            sb.append("<li><a class='_js-link _id-year-1' data-where='" + OYO.sorterData.yearDesc + "'>" + OYO.labels.year + "<span>▼</span></a></li>");
        }
        if (OYO.sorterData.mileageAsc) {
            sb.append("<li><a class='_js-link _id-mileage-0' data-where='" + OYO.sorterData.mileageAsc + "'>" + OYO.labels.mileage + "<span>▲</span></a></li>");
        }
        if (OYO.sorterData.mileageDesc) {
            sb.append("<li><a class='_js-link _id-mileage-1' data-where='" + OYO.sorterData.mileageDesc + "'>" + OYO.labels.mileage + "<span>▼</span></a></li>");
        }
        if (OYO.sorterData.dealAsc) {
            sb.append("<li><a class='_js-link _id-deal-0' data-where='" + OYO.sorterData.dealAsc + "'>" + OYO.labels.deal + "<span>▲</span></a></li>");
        }
        if (OYO.sorterData.dealDesc) {
            sb.append("<li><a class='_js-link _id-deal-1' data-where='" + OYO.sorterData.dealDesc + "'>" + OYO.labels.deal + "<span>▼</span></a></li>");
        }
        if (OYO.sorterData.distance) {
            sb.append("<li><a class='_js-link _id-distance-0' data-where='" + OYO.sorterData.distance + "'>" + OYO.labels.distance + "<span>▲</span></a></li>");
        }
        sb.append("<li><a class='_js-link' data-where='" + OYO.sorterData.noSort + "'>" + OYO.labels.reset + "</a></li>");
        return sb.toString();
    },
    init: function () {
        var self = this;
        var html = self.getHTML();
        $("body").append("<div id='sorter-popup-holder' class='dropdown-list'><div class='heading'><h3>" +
                OYO.labels.sortBy +
                "</h3><span class='close'>&times;</span></div></div>");
        $("#sorter-popup-holder").append(html);
        if(OYO.appParams.sortPrice !== ""){
            $('._id-price-'+OYO.appParams.sortPrice).addClass('selected');
        }
        if(OYO.appParams.sortYear !== ""){
            $('._id-year-'+OYO.appParams.sortYear).addClass('selected');
        }
        if(OYO.appParams.sortMileage !== ""){
            $('._id-mileage-'+OYO.appParams.sortMileage).addClass('selected');
        }
        if(OYO.appParams.sortDeal !== ""){
            $('._id-deal-'+OYO.appParams.sortDeal).addClass('selected');
        }
        if(OYO.appParams.sortDistance !== ""){
            $('._id-distance-'+OYO.appParams.sortDistance).addClass('selected');
        }
        new Dropdown('._js-show-sorters', '#sorter-popup-holder');
    }
};

