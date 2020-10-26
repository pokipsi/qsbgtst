export class StringBuilder {
    constructor() {
        this._string = [];
        this._delimiter = "";
        return this;
    }

    append(str) {
        this._string.push(str);
        return this;
    }

    setDelimiter(del) {
        this._delimiter = del;
    }

    clear() {
        this._string = [];
    }

    toString() {
        return this._string.join(this._delimiter);
    }

    isEmpty() {
        return this._string.length === 0;
    }

}