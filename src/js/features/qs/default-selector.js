export default class DefaultSelector {
    constructor($selector, fxOnParamSelected, defaultLabel, paramName, keyName, displayName = "displayName") {
        this.$selector = $selector;
        this.defaultLabel = defaultLabel;
        this.paramName = paramName;
        this.keyName = keyName;
        this.displayName = displayName;
        this.add();
        this.addHandler(fxOnParamSelected);
    }
    add() {
        this.$selector.html(this.getDefaultOption(this.defaultLabel, "-1"));
    }
    render(items, selectedValue) {
        let html = items ? items.map(item => {
            const count = item.displayCount ? `(${item.displayCount})` : '';
            return `<option value='${item[this.keyName]}' 
                ${item[this.keyName] == selectedValue ? 'selected' : ''}>
                    ${item[this.displayName]} ${count}
                </option>`;
            }) : "";
        
        this.$selector.html([
            this.getDefaultOption(this.defaultLabel, "-1"), 
            ...html
        ].join(''));
    }
    getDefaultOption(name, value) {
        return `<option value="${value}">${name}</option>`;
    }
    addHandler(fxHandler) {
        this.$selector.change(e => {
            fxHandler(this.paramName, e.target.value);
        }); 
    }
}