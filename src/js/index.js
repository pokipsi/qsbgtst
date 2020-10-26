import QS from './features/qs/quick-search';

$(document).ready(function () {

    const qs = new QS({
        page: 'index',
        orientation: 'horizontal'
    });
    qs.init({ fixedSearchButton: true });

    OYO.utils.showPageScrollbar();

});