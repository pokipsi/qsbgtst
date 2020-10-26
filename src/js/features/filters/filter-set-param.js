export let setParam = ({ name, value, paramMap }) => {
    value = String(value);
    switch (name) {
        case 'make':
            paramMap.idMake = value;
            delete paramMap.idModel;
            delete paramMap.idTrim;
            break;
        case 'model':
            paramMap.idModel = value;
            delete paramMap.idTrim;
            break;
        case 'trim':
            paramMap.idTrim = value;
            break;
        case 'price':
            paramMap.priceFrom = value.split('_')[0];
            let priceTo = value.split('_')[1];
            if(priceTo < 200000) {
                paramMap.priceTo = priceTo;
            }else{
                delete paramMap.priceTo;
            }
            break;
        case 'year':
            paramMap.yearFrom = value.split('_')[0];
            paramMap.yearTo = value.split('_')[1];
            break;
        case 'bodytype':
            paramMap.idBodytype = value;
            break;
        case 'fueltype':
            paramMap.idFueltype = value;
            break;
        case 'transmission':
            paramMap.idTransmission = value;
            break;
        case 'power':
            paramMap.power = value;
            break;
        case 'color':
            paramMap.idColor = value;
            break;
        case 'country':
            paramMap.idCountry = value;
            break;
        case 'state':
            paramMap.idState = value;
            break;
        case 'city':
            paramMap.idCity = value;
            break;
    }
    return paramMap;
}