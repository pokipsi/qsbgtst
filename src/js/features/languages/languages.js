export default class Languages {
    constructor({ page }) {
        this.page = page;
        this.cache = null;
    }
    get(fxOnResponse) {
        if (this.cache && fxOnResponse) {
            fxOnResponse(this.cache);
        } else {
            const params = OYO.utils.getParams();
            const endpoint = this.endpoint(params);
            fetch(endpoint).then(data => data.json()).then(data => {
                let formatted = this.format(data);
                let sorted = this.sort(formatted);
                this.cache = sorted;
                if (fxOnResponse) {
                    fxOnResponse(sorted);
                }
            });
        }
    }
    format(data) {
        return Object.keys(data.all).map(key => {
            return {
                id: key,
                title: data.all[key].title,
                url: data.all[key].url
            }
        });
    }
    sort(data) {
        return data.sort((a, b) => { 
            const aTitle = a.title.toUpperCase();
            const bTitle = b.title.toUpperCase();
            if (aTitle > bTitle) {
                return 1;
            }
            if (bTitle > aTitle) {
                return -1;
            }
            return 0;
        });
    }
    api() {
        const page = ['index', 'result', 'detail'].includes(this.page) ? this.page : 'index';
        return `/ooyyo-services/resources/${page}page/languageweburls`;
    }
    endpoint(params) {
        return this.api() + '?json=' + encodeURIComponent(JSON.stringify(params));
    }
    countryByLang(id) {
        const data = {
            2: 14, //ned
            3: 7, //ita
            5: 15, //fra
            6: 10, //ger
            7: 129, //srp
            8: 17, //esp
            9: 100, //rus
            10: 107, //por
            11: 190, // cro
            12: 6, //sve
            13: 97, //pol
            16: 99, //cze
            17: 108, //tur
            18: 121, //slovacki
            19: 123, //hun
            20: 102, //nor
            21: 116, //fin
            22: 106, //den
            23: 149, //slo
            24: 128, //rom
            25: 104, //ukr
            26: 95, //gre
            27: 126, //liet
            28: 118, //lat
            29: 115, //bul
            47: 1, //en
            49: 110, //bel
            50: 122, //bih
            61: 1000 //cat
        };
        return data[id];
    }
}