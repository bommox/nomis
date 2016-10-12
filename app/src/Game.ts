import * as Log from './common/Log';

class Game {

    _values:Array<string>;
    _stream:Array<string>;
    _userInput:Array<string>;
    _gameOver:boolean;
    _handlers:Object;
    log:Log.ILog;

    static events = {
        USER_CHECK_STEP_OK : "userCheckOk",
        USER_CHECK_ROUND_OK : "userRoundOk",
        GAME_OVER : "gameOver"
    };

    constructor(values?:Array<string>) {
        this.log = Log.getLog("Game");
        this._values = values || 'red,yellow,blue,green'.split(",");
        this._stream = [];
        this._userInput = [];
        this._gameOver = false;
        this._handlers = {};
        this.log.d("Constructor");
    }

    dispatch(event:string, data?:any) {
        this.log.d("Dispatch event: " + event + " - " + data);
        var handlers = this._handlers[event] || [];
        handlers.forEach(function(handler) {
            handler(data);
        });
    }

    clearSubscribers():void {
        this._handlers = [];
    }

    subscribe(event, handler) {
        this.log.d("New handler subscribed to " + event);
        if (!this._handlers[event]) {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
    }

    getStream():string[] {
        if (this._gameOver) {
            this.log.e("Game Over! start again...");
            throw "Game Over! start again...";
        } else {
            //Si solo se valida la ultima entrada con esto es suficiente. Sino seria necesario comparar todas
            this._stream.push(this._values[Math.floor(Math.random() * this._values.length)]);
            this.log.d("Getting new stream " + this._stream);
            return this._stream;
        }
    }


    checkUserInput(newInput:string):boolean {
        if (this._gameOver) {
            this.log.e("Game Over! start again...");
            throw "Game Over! start again...";
        } else {
            this._userInput.push(newInput);
            var lastIdx = this._userInput.length - 1;
            var result = this._userInput[lastIdx] == this._stream[lastIdx];
            if (result == false) {
                this.log.d("checkUserInput [false] " + newInput);
                this.dispatch(Game.events.GAME_OVER);
                this._gameOver = true;
                this.clearSubscribers();
            } else if (result == true && this._userInput.length == this._stream.length) {
                this.log.d("checkUserInput [true]. Round OK. " + newInput);
                this._userInput = [];
                this.dispatch(Game.events.USER_CHECK_ROUND_OK);
            } else {
                this.log.d("checkUserInput [true]. Step. " + newInput);
                this.dispatch(Game.events.USER_CHECK_STEP_OK);
            }
            return result;
        }
    }

}

export default Game;