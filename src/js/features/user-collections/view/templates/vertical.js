const ooyyoLabels = OYO.labels;
export default car => {
    var cidCurrency = car.idCurrency;
    var cPrice = car.price;
    const allCurrencies = [...window.cache.currencies.all, ...window.cache.currencies.popular];
    const prices = OYO.utils.getCarPrices(allCurrencies, cidCurrency, cPrice);
    return `
<a class="car-card-2 _js-compare-item-${car.record}" href="${car.url.url}" target="_blank" data-newtab="false" data-currency="${car.idCurrency}" data-price="${car.price}">
    <div class="d-flex flex-column w-p100">
        <div class="alpha">
            <div class="loading">
                <div class="lds-roller grey">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
            <div class="image-holder">
                <img src="${car.imgUrl.url}" onerror="OYO.lpr.setNoPhoto(this)" />
            </div>
            <div class="bottom-info">
                <div class="image-count">
                    <i class="icon-camera"></i><span>${car.imgCnt > 20 ? '20+' : car.imgCnt}</span>
                </div>
                <div class="uc-holder">
                    <span class="_js-uc-compare-trigger mr-12" data-record="${car.record}">
                        <i class="icon-copy" title="${OYO.labels.compare}"></i>
                    </span>
                    <span class="_js-uc-favorite-trigger" data-record="${car.record}">
                        <i class="icon-star-full" title="${OYO.labels.favorites}"></i>
                    </span>
                </div>
            </div>
        </div>
        <div class="beta">
            <div data-row="_make" class="_make">${car.make}</div>
            <div data-row="_model" class="_model">${car.model}</div>
            <div data-row="_trim" class="_trim">${car.trim}</div>
            <div data-row="_price" class="_price">${prices.primary} ${ prices.secondary ? '('+prices.secondary+')' : ''}</div>
            <div data-row="_deal" class="_deal">
                <div class="deal-wrapper">
                    <div class="deal type-${car.deal ? car.deal.idDeal : '0'}">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div class="label">
                        ${car.deal ? car.deal.translation : 'N/A'}
                    </div>
                </div>
            </div>
            <div data-row="_save" class="_save">
                ${car.savePercent ? `
                <span class="percent">
                    ${car.savePercent}
                </span>
                ` : ''}
            </div>
            <div data-row="_year" class="_year">${car.year}</div>
            <div data-row="_mileage" class="_mileage">${car.mileage != '-1' ? `${car.displayMileage}` : ''}</div>
            <div data-row="_bodytype" class="_bodytype">${car.bodytype ? `${car.bodytype}` : ''}</div>
            <div data-row="_fueltype" class="_fueltype">${car.fueltype ? `${car.fueltype}` : ''}</div>
            <div data-row="_transmission" class="_transmission">${car.transmission ? `${car.transmission}` : ''}</div>
            <div data-row="_power" class="_power">${car.power != '-1' ? `${car.displayPower}` : ''}</div>
            <div data-row="_color" class="_color">${car.color ? `${car.color}` : ''}</div>
        </div>
    </div>
</a>
`;
}

