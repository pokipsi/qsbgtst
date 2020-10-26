const ooyyoLabels = OYO.labels;
export default car => {
    var cidCurrency = car.idCurrency;
    var cPrice = car.price;
    const allCurrencies = [...window.cache.currencies.all, ...window.cache.currencies.popular];
    const prices = OYO.utils.getCarPrices(allCurrencies, cidCurrency, cPrice);
    return `
<a class="car-card-1" href="${car.url.url}" target="_blank" data-newtab="false" data-currency="${car.idCurrency}" data-price="${car.price}">
    <div class="gama">
        <div class="mob-heading">
            ${car.year} ${car.make} ${car.model} ${car.trim}
        </div>
        <div class="mob-location">
            ${ car.city != null && car.city != '' ? car.city + ',' : '' }
            ${ car.state != null && car.state != '' ? car.state + ',' : '' }
            ${car.country}
        </div>
    </div>
    <div class="d-flex w-p100">
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
            ${car.score > 1000000 ? `<div class="promote">${OYO.labels.foundOn} autoscout24.es</div>` : ''}
        </div>
        <div class="beta">   
            <h2>
                <span>${car.year} </span> 
                <span>${car.make}</span>
                <span>${car.model}</span>
                ${car.trim}
            </h2>
            <div class="info">
                <div class="basic-info">
                    <div class="location">
                    ${ car.city != null && car.city != '' ? car.city + ',' : '' }
                    ${ car.state != null && car.state != '' ? car.state + ',' : '' }
                    ${ car.country }
                    </div>
                    <div class="mobile-data">
                        <div class='price lg'>
                            <span><strong>${ prices ? prices.primary : ''}</strong></span>
                        </div>
                        <div class='price'>
                            <span>${ prices ? prices.secondary : ''}</span>
                        </div>
                    </div>

                    ${car.mileage != '-1' ? `
                    <div class="mileage"> ${ooyyoLabels.mileage}: 
                        <strong>${car.displayMileage}</strong>
                    </div>` : ''}


                    <div class="description">
                    ${car.bodytype ? `<span>${car.bodytype},&nbsp;</span>` : ''}
                    ${car.fueltype ? `<span>${car.fueltype},&nbsp;</span>` : ''}
                    ${car.color ? `<span>${car.color},</span>` : ''}
                    ${car.displayOptions && car.displayOptions.length > 0 ? `${car.displayOptions },&nbsp;` : ''}
                        ${car.displayOptions}
                    </div>

                    <div class="price-stat">
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
                        ${car.savePercent ? `
                        <span class="percent">
                            <span>${ooyyoLabels.youSave}</span>
                            ${car.savePercent}
                        </span>
                        ` : ''}
                    </div>
                </div>
                <div class="price-info">
                    <div>
                        <span class="other-price">${ prices ? prices.secondary : ''}</span>
                        <span class="price">${ prices ? prices.primary : ''}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</a>
`;
}

