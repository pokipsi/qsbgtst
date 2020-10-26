export default class CollectionViewSelector {
    constructor($selector, fxOnParamSelected, defaultLabel, paramName, keyName, displayName = "displayName") {
        this.$selector = $selector;
        this.defaultLabel = defaultLabel;
        this.paramName = paramName;
        this.keyName = keyName;
        this.displayName = displayName;
        this.addHandler(fxOnParamSelected);
    }
    render(items, selectedValue) {
        let html = items ? items.map(item => {
            const count = item.displayCount ? `(${item.displayCount})` : '';
            return `
                <div class='cv-item-wrapper'>
                    <div class='cv-item ${item[this.keyName] == selectedValue ? 'selected' : ''}' data-id='${item[this.keyName]}'>
                        <div class="cv-img bt-img-${item[this.keyName]}"></div>
                        <div class="cv-primary">${item[this.displayName]}</div>
                        <div class="cv-secondary">${count}</div>
                    </div>
                </div>`;
            }) : "";
        
        this.$selector.html([ 
            ...html
        ].join(''));
    }
    addHandler(fxHandler) {
        this.$selector.click(e => {
            const $target = $(e.target);
            const $item = $target.hasClass('cv-item') ? $target : $target.parent();
            const id = $item.data('id');
            fxHandler(this.paramName, String(id), true);
        }); 
    }
}