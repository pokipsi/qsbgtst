import Cookies from 'js-cookie';

export let storage = {
    types: {COOKIE: 0, LOCAL: 1, SESSION: 2},
    get: function(name, type){
        var t = type !== undefined ? type : this.types.LOCAL;
        if(t === this.types.COOKIE){
            return Cookies.get(name);    
        }else{
            return window.localStorage[name];
        }
    },
    getJSON: function(name, type){
        var t = type !== undefined ? type : this.types.LOCAL;
        if(t === this.types.COOKIE){
            return Cookies.getJSON(name);
        }else{
            var val = window.localStorage[name];
            var json;
            try {
                json = JSON.parse(val);
            }catch(e){
                json = null;
            }
            return json;
        }
    },
    set: function(name, value, type){
        var t = type !== undefined ? type : this.types.LOCAL;
        if(t === this.types.COOKIE){
            Cookies.set(name, value, { domain: '.ooyyo.com' });    
        }else{
            var v = (typeof value === 'string' || value instanceof String) ? value : JSON.stringify(value);
            window.localStorage.setItem(name, v);
        }
    },
    remove: function(name, type){
        var t = type !== undefined ? type : this.types.LOCAL;
        if(t === this.types.COOKIE){
            Cookies.remove(name, {domain: '.ooyyo.com'});
        }else{
            window.localStorage.removeItem(name);
        }
    }
};