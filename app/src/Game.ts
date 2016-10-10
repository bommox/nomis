class Game {

    _values:Array<string>;
    _stream:Array<string>;
    _userInput:Array<string>;
    _gameOver:boolean;
    _handlers:any;

    static events = {
        USER_CHECK_STEP_OK : "userCheckOk",
        USER_CHECK_ROUND_OK : "userRoundOk",
        GAME_OVER : "gameOver"
    };

    constructor(values:Array<string>) {
        this._values = values || 'red,yellow,blue,green'.split(",");
        this._stream = [];
        this._userInput = [];
        this._gameOver = false;
        this._handlers = {};
    }

    dispatch(event:string, data?:any) {
        console.log("Dispatch event: " + event + " - " + data);
        var handlers = this._handlers[event] || [];
        handlers.forEach(function(handler) {
            handler(data);
        });
    }

    subscribe(event, handler) {
        if (!this._handlers[event]) {
            this._handlers[event] = [];
        }
        this._handlers[event].push(handler);
    }

    getStream() {
        if (this._gameOver) {
            console.error("Game Over! start again...");
        }
        //Si solo se valida la ultima entrada con esto es suficiente. Sino seria necesario comparar todas
        this._stream.push(this._values[Math.floor(Math.random() * this._values.length)]);
        return this._stream;
    }

    checkUserInput(newInput) {
        if (this._gameOver) {
            console.error("Game Over! start again...");
        }
        this._userInput.push(newInput);
        var lastIdx = this._userInput.length - 1;
        var result = this._userInput[lastIdx] == this._stream[lastIdx];
        if (result == false) {
            this.dispatch(Game.events.GAME_OVER);
            this._gameOver = true;
        } else if (result == true && this._userInput.length == this._stream.length) {
            this.dispatch(Game.events.USER_CHECK_ROUND_OK);
        } else {
            this.dispatch(Game.events.USER_CHECK_STEP_OK);
        }
        return result;
    }

}

export default Game;