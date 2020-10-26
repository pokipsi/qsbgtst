import noUiSlider from 'nouislider';

export class QSRangeSlider {
    constructor({ $selector, fxOnRangeSet }) {
        this.$selector = $selector,
        this.rangeData = [],
        this.selected = null,
        this.setupForNonLinear = null,
        this.fxOnRangeSet = fxOnRangeSet,
        this.setup = {
            start: [0, 100],
            connect: true,
            animate: true,
            animationDuration: 300,
            range: {
                min: 0,
                max: 100
            }
        };
        this.ignoreOnRangeSet = false;
    }
    onRangeSet(range, minDefault, maxDefault) {
        this.selected = {
            min: {
                id: range.minId,
                display: range.minDisplay
            },
            max: {
                id: range.maxId,
                display: range.maxDisplay
            }
        }
        this.fxOnRangeSet(range, minDefault, maxDefault);
    }
    getDataForRangeSliders(minValue, maxValue, items) {
        return !!this.setupForNonLinear ? 
            this.getDataForRangeSlidersNonLinear(minValue, maxValue, items) : 
            this.getDataForRangeSlidersLinear(minValue, maxValue, items);
    }
    getDataForRangeSlidersLinear(minValue, maxValue, items) {

        let ret,
            minDisplay,
            minId,
            minTO,
            maxDisplay,
            maxId,
            maxTO,
            minIndex,
            maxIndex,
            x = 100 / items.length;

        minIndex = Math.min(Math.floor(minValue / x + 0.1), items.length - 1);
        minTO = items[minIndex];
        minDisplay = minTO.display;
        minId = minTO.id;

        maxIndex = Math.min(Math.floor(maxValue / x + 0.1), items.length - 1);
        maxTO = items[maxIndex];
        maxDisplay = maxTO.display;
        maxId = maxTO.id;

        ret = {
            minDisplay: minDisplay,
            maxDisplay: maxDisplay,
            minId: minId,
            maxId: maxId
        };

        return ret;
    }
    getDataForRangeSlidersNonLinear(minValue, maxValue, items) {

        /*
         a = 80%
         c = [0,1,2,3,4,5,6,7,8,9]
         cmin = c[0]
         cmax = c[c.length-1]
         i = c.length * 80% = 8
         m = [0,1,2,3,4,5,6,7]
         n = [8,9]
         kmin = cmin = c[0]
         k
         */

        let { divider, dividerPosition } = { ...this.setupForNonLinear };

        let ret,
            minDisplay,
            minId,
            minTO,
            maxDisplay,
            maxId,
            maxTO,
            minIndex,
            maxIndex,
            x;

//        let divider = 80; //%
//        let arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let l = items.length;
        let indexOfDivider = Math.round(l * divider / 100);
        let items1 = items.slice();
        let items2 = items1.splice(indexOfDivider);
//        console.log(indexOfDivider);
//        let dividerPosition = 25; //%

        /*
         sad imamo dve kolekcije items1, i items2
         
         treba da utvrdimo gde pripadaju klizaci koje smo dobili preko varijabli minValue i maxValue
         
         */

        if (minValue < dividerPosition) {
            let minValue1 = minValue * 100/dividerPosition;
            x = 100 / items1.length;
            minIndex = Math.min(Math.floor(minValue1 / x + 0.1), items1.length - 1);
            minTO = items1[minIndex];
            minDisplay = minTO.display;
            minId = minTO.id;
        } else {
            let minValue2 = ((minValue-dividerPosition) * 100)/(100-dividerPosition);
            x = 100 / items2.length;
            minIndex = Math.min(Math.floor(minValue2 / x + 0.1), items2.length - 1);
            minTO = items2[minIndex];
            minDisplay = minTO.display;
            minId = minTO.id;
        }

        if (maxValue < dividerPosition) {
            let maxValue1 = maxValue * 100/dividerPosition;
            x = 100 / items1.length;
            maxIndex = Math.min(Math.floor(maxValue1 / x + 0.1), items1.length - 1);
            maxTO = items1[maxIndex];
            maxDisplay = maxTO.display;
            maxId = maxTO.id;
        } else {
            let maxValue2 = ((maxValue-dividerPosition) * 100)/(100-dividerPosition);
            x = 100 / items2.length;
            maxIndex = Math.min(Math.floor(maxValue2 / x + 0.1), items2.length - 1);
            maxTO = items2[maxIndex];
            maxDisplay = maxTO.display;
            maxId = maxTO.id;
        }

        ret = {
            minDisplay: minDisplay,
            maxDisplay: maxDisplay,
            minId: minId,
            maxId: maxId
        };

        // console.log("YEAR DEBUG", ret);

        return ret;
    }
    getSliderPositionByValue(min, max, items) {
        return !!this.setupForNonLinear ?
            this.getSliderPositionByValueNonLinear(min, max, items) :
            this.getSliderPositionByValueLinear(min, max, items);
    }
    getSliderPositionByValueLinear(min, max, items) {
        let ret,
            size = items.length,
            minValueIndex = 0,
            maxValueIndex = size - 1,
            i = 0;
        items.forEach(item => {
            if (min == item.id) {
                minValueIndex = i;
            }
            if (max == item.id) {
                maxValueIndex = i;
            }
            i += 1;
        });

        ret = {
            min: Math.round((minValueIndex / (size - 1)) * 100),
            max: Math.round((maxValueIndex / (size - 1)) * 100)
        };

        return ret;
    }
    getSliderPositionByValueNonLinear(min, max, items) {

        let { divider, dividerPosition } = { ...this.setupForNonLinear };

        let ret,
            size = items.length,
            minValueIndex = 0,
            maxValueIndex = size - 1,
            i = 0;
        
        items.forEach(item => {
            if (min == item.id) {
                minValueIndex = i;
            }
            if (max == item.id) {
                maxValueIndex = i;
            }
            i += 1;
        });
        
        let l = items.length;
        let indexOfDivider = Math.round(l * divider / 100);
        
        let items1 = items.slice();
        let items2 = items1.splice(indexOfDivider);
        
        let thumbPosSplittedMin, thumbPosSplittedMax;
        let thumbPosMin, thumbPosMax;
        
        if(minValueIndex < indexOfDivider) {
            thumbPosSplittedMin = (minValueIndex * 100) / items1.length;
            thumbPosMin = (thumbPosSplittedMin*dividerPosition)/100;
    
        }else {
            thumbPosSplittedMin = ((minValueIndex-indexOfDivider) * 100) / (items2.length-1);
            thumbPosMin = ((100-dividerPosition)*thumbPosSplittedMin)/100+dividerPosition;
        }
        
        if(maxValueIndex < indexOfDivider) {
            thumbPosSplittedMax = (maxValueIndex * 100) / items1.length;
            thumbPosMax = (thumbPosSplittedMax*dividerPosition)/100;
        }else {
            thumbPosSplittedMax = ((maxValueIndex-indexOfDivider) * 100) / (items2.length-1);
            thumbPosMax = ((100-dividerPosition)*thumbPosSplittedMax)/100+dividerPosition;
        }

        ret = {
            min: thumbPosMin,
            max: thumbPosMax
        };

        return ret;
    }
    setRangeByValue() {
        let minValue = this.selected ? this.selected.min.id : this.rangeData[0].id;
        let maxValue = this.selected ? this.selected.max.id : this.rangeData[this.rangeData.length - 1].id;
        let {min, max} = { ...this.getSliderPositionByValue(minValue, maxValue, this.rangeData) };
        this.$selector.noUiSlider.set([min, max]);
    }
    init(type) {
        noUiSlider.create(this.$selector, this.setup);
        this.$selector.noUiSlider.on('update', values => {
            var range = this.getDataForRangeSliders(parseFloat(values[0]), parseFloat(values[1]), this.rangeData);
            $(`#range-min-${type}`).html(range.minDisplay);
            $(`#range-max-${type}`).html(range.maxDisplay);
            $(`.rsp-${type}`).html(`${range.minDisplay} - ${range.maxDisplay}`).parent().show();
        });
        this.$selector.noUiSlider.on('set', values => {
            const range = this.getDataForRangeSliders(parseFloat(values[0]), parseFloat(values[1]), this.rangeData);
            $(`.rsp-${type}`).parent().hide();
            let minDefault = String(this.rangeData[0].id);
            let maxDefault = String(this.rangeData[this.rangeData.length - 1].id);
            if(! this.ignoreOnRangeSet) {
                this.onRangeSet(range, minDefault, maxDefault);
            }
        });
        
    }
    reset() {
        this.ignoreOnRangeSet = true;
        this.$selector.noUiSlider.set([0, 100]);
        setTimeout(() => {
            this.ignoreOnRangeSet = false;
        }, 500);
    }
}

export class QSRangeSliderPrice extends QSRangeSlider {
    constructor({ fxOnRangeSet }) {
        super({ $selector: $("#pricerange")[0], fxOnRangeSet });
        this.setupForNonLinear = {
            divider: 50,
            dividerPosition: 50
        }
    }
    initRangeData(data, from, to) {
        from = from || 0;
        this.selected = {};
        Object.values(data.pricesFrom).forEach(item => {
            this.rangeData.push({
                id: item.price,
                display: item.displayPrice
            });
            if(item.price == from) {
                this.selected.min = {
                    id: item.price,
                    display: item.displayPrice
                }
            }
            if(item.price == to) {
                this.selected.max = {
                    id: item.price,
                    display: item.displayPrice
                }
            }
        });
        let lastOne = {
            id: '200000',
            display: `${this.rangeData[this.rangeData.length - 1].display}+`
        }
        if(!this.selected.max) {
            this.selected.max = { ...lastOne };
        }
        this.rangeData.push(lastOne);
    }
    render(data, from, to) {
        if(!this.rangeData.length) {
            this.initRangeData(data, from, to);
            super.init('price');
            this.setRangeByValue();
        }
    }
}

export class QSRangeSliderYear extends QSRangeSlider {
    constructor({ fxOnRangeSet }) {
        super({ $selector: $("#yearrange")[0], fxOnRangeSet });
        this.setupForNonLinear = {
            divider: 80,
            dividerPosition: 25
        }
    }
    initRangeData(data, from, to) {
        this.selected = {};
        Object.values(data.yearsFrom).reverse().forEach(item => {
            this.rangeData.push({
                id: item.year,
                display: item.displayYear
            });
            if(item.year == from) {
                this.selected.min = {
                    id: item.year,
                    display: item.displayYear
                }
            }
            if(item.year == to) {
                this.selected.max = {
                    id: item.year,
                    display: item.displayYear
                }
            }
        });
        if(!this.selected.min) {
            this.selected.min = { 
                id: this.rangeData[0].id,
                display: this.rangeData[0].display
            };
        }
        if(!this.selected.max) {
            this.selected.max = { 
                id: this.rangeData[this.rangeData.length - 1].id,
                display: this.rangeData[this.rangeData.length - 1].display
            };
        }
    }
    render(data, from, to) {
        if(!this.rangeData.length) {
            this.initRangeData(data, from, to);
            super.init('year');
            this.setRangeByValue();
        }
    }
}

export class QSRangeSliderMileage extends QSRangeSlider {
    constructor({ fxOnRangeSet }) {
        super({ $selector: $("#mileagerange")[0], fxOnRangeSet });
    }
    initRangeData(data, from, to) {
        from = from || 0;
        this.selected = {};
        Object.values(data.mileagesFrom).forEach(item => {
            this.rangeData.push({
                id: item.mileage,
                display: item.displayMileage
            });
            if(item.mileage == from) {
                this.selected.min = {
                    id: item.mileage,
                    display: item.displayMileage
                }
            }
            if(item.mileage == to) {
                this.selected.max = {
                    id: item.mileage,
                    display: item.displayMileage
                }
            }
        });
        let lastOne = {
            id: '200000',
            display: `${this.rangeData[this.rangeData.length - 1].display}+`
        }
        if(!this.selected.max) {
            this.selected.max = { ...lastOne };
        }
        this.rangeData.push(lastOne);
    }
    render(data, from, to) {
        if(!this.rangeData.length) {
            this.initRangeData(data, from, to);
            super.init('mileage');
            this.setRangeByValue();
        }
    }
}


