

export interface ILog {
    l:(string)=>void,
    d:(string)=>void,
    i:(string)=>void,
    w:(string)=>void,
    e:(string)=>void
}

let globalLogLevel = 'warning';

export let setLogLevel = function(level:string):void {
    globalLogLevel = level;
}

let doLog = function(level:string):boolean {
    let result = true;
    if (globalLogLevel == 'info' && level == 'debug') {
        result = false;
    } else if (globalLogLevel == 'warning' && (level == 'debug' || level == 'info')) {
        result = false;
    } else if (globalLogLevel == 'error' && (level == 'debug' || level == 'info'  || level == 'warning' )) {
        result = false;
    }
    return result;
}

class Log {
    tag:string;
    constructor(tag:string) {
        this.tag = tag;
    }
    private log(level:string, message:string):void {
        let console = window['console'];
        if (!console || !doLog(level)) {
            return;
        }
        let msg = this.tag + " ## " + message;
        switch (level) {
            case 'error':
                console.error(msg);
                break;
            case 'warning':
                console.warn(msg);
                break;
            case 'info':
                console.info(msg);
                break;
            case 'debug':
                console.debug(msg);
                break;
            default :
                console.log(msg);
                break;
        }
    }
    
    l(msg:string) {
        this.log('log', msg);
    }
    
    e(msg:string) {
        this.log('error', msg);
    }
    
    w(msg:string) {
        this.log('warning', msg);
    }
    
    d(msg:string) {
        this.log('debug', msg);
    }
    
    i(msg:string) {
        this.log('info', msg);
    }
}

const ROOT_LOG = 'root';

export let logRoot:ILog = new Log(ROOT_LOG);

let logCache = {};
logCache[ROOT_LOG] = logRoot;

export let getLog = function(tag:string = ROOT_LOG):ILog {
    if (logCache[tag])
        return logCache[tag]
    else {
        let log =  new Log(tag);
        logCache[tag] = log;
        return log;
    }        
}
