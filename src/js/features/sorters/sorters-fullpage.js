export default class Sorters {
    
    constructor({ selector = "#fpd-sorters-trigger" } = {}) {
        this.$selector = $(selector);
        this.html = `
            <div class="fullpage-dialog" id="fpd-sorters">
                <div class="fpd-header">
                    <div class="title">${OYO.labels.sortBy}</div>
                    <div class="ml-auto d-flex">
                        <div class="fpd-main-reset">
                            <i class="icon-reload"></i>
                        </div>
                        <div class="fpd-main-close ml-32">
                            <i class="icon-close"></i>
                        </div>
                    </div>
                </div>
                <div class="fpd-content"></div>
            </div>
        `;
    }
    
    getLi(paramName, sortType) {
        const id = sortType == 'asc' ? 0 : 1;
        const sortTypeCapitalized = sortType == 'asc' ? 'Asc' : 'Desc';
        const direction = sortType == 'asc' ? 'up' : 'down'
        return `
            <li class='_id-${paramName}-${id}' data-where='${ OYO.sorterData[`${paramName}${sortTypeCapitalized}`] }'>
                ${ OYO.labels[paramName] }
                <i class="icon-arrow-thin-${direction} ml-auto"></i>
            </li>`;
    }
    lis() {
        let html = [];
        if (OYO.sorterData.priceAsc) {   
            html.push(this.getLi('price', 'asc'));
        }
        if (OYO.sorterData.priceDesc) {
            html.push(this.getLi('price', 'desc'));
        }
        if (OYO.sorterData.yearAsc) {
            html.push(this.getLi('year', 'asc'));
        }
        if (OYO.sorterData.yearDesc) {
            html.push(this.getLi('year', 'desc'));
        }
        if (OYO.sorterData.mileageAsc) {
            html.push(this.getLi('mileage', 'asc'));
        }
        if (OYO.sorterData.mileageDesc) {
            html.push(this.getLi('mileage', 'desc'));
        }
        if (OYO.sorterData.dealAsc) {
            html.push(this.getLi('deal', 'asc'));
        }
        if (OYO.sorterData.dealDesc) {
            html.push(this.getLi('deal', 'desc'));
        }
        if (OYO.sorterData.distance) {
            html.push(this.getLi('distance', 'asc'));
        }
        return `<ul>${ html.join('') }</ul>`;
    }
    init() {
        this.addWrapper();
        this.$selector.click(e => {
            this.open();
        });
        $("#fpd-sorters .fpd-main-close").click(e => {
            this.close();
        });
        $("#fpd-sorters .fpd-content").html(this.lis());
        this.assignEventHandlers();
    }
    assignEventHandlers() {
        $("#fpd-sorters .fpd-content ul li").click(e => {
            const url = $(e.currentTarget).data('where');
            OYO.utils.showFullPagePreloader();
            OYO.utils.gotoPage({ url: url });
        });
        $("#fpd-sorters .fpd-main-reset").click(() => {
            OYO.utils.showFullPagePreloader();
            OYO.utils.gotoPage({ url: OYO.sorterData.noSort });
        });
    }
    addWrapper() {
        $("body").append(this.html);
    }
    open() {
        $("#fpd-sorters").addClass('active');
    }
    close() {
        $("#fpd-sorters").removeClass('active');
    }
}