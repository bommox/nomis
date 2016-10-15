import * as $ from 'jquery';
import * as Log from './Log';

let log = Log.getLog('Storage');

let hasStorage = false;

let _storage = window && window.localStorage;

if (window && window.localStorage) {
    hasStorage = true;
    try {
        _storage.setItem('sample','value');
    } catch (e) {  
        hasStorage = false;
    }
}
if (!hasStorage) {
    log.e("LocalStorage not supported");
}

export let get = function(key:string, defaultValue:any = undefined):any {
    let result = undefined;
    if (hasStorage) {
        result = _storage.getItem(key);
        try {
            result = JSON.parse(result);
        } catch (e) {}
    }
    return (result !== undefined && result !== null) 
        ? result
        : defaultValue;
}

export let put = function(key:string, value:any):void {
    if (hasStorage) {
        let storedValue = value;
        try {
            storedValue = JSON.stringify(value);
        } catch(e) {}
        _storage.setItem(key,storedValue);
    }
}