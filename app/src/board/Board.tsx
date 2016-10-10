import * as React from 'react';
import Game from '../Game';

export interface IBoardState {}

export interface IBoardProps {
    panels:Array<string>
}

export class Board extends React.Component<IBoardProps, IBoardState> {

    btns;

    constructor () {
        super();
        this.pressPanel = this.pressPanel.bind(this);
        this.onGameCheck = this.onGameCheck.bind(this);
        this.start = this.start.bind(this);
        this.btns = {};
    }
    
    pressPanel(panelId) {

        var btn = this.btns[panelId];
        console.log(btn);
        if (btn && btn.className.indexOf("pressed") == -1 ) {
            var origClass = btn.className;
            btn.className = origClass + " pressed";
            setTimeout(function() {
                    btn.className = origClass;
            }, 300);
        }
    }

    

    onGameCheck() {
        console.log("CHEEEEK");
    }

    start() {
        var game = new Game(this.props.panels);

      //  game.subscribe(Game.events.USER_CHECK_ROUND_OK, this.onGameCheck);
        game.getStream();
        game.getStream();
        game.getStream();
        var newStream = game.getStream();
        console.log(newStream);

    }

    render() {    
        var panels = this.props.panels;
        var _this = this;
        return (            
            <div>
                {panels.map(function(p) {
                    return <div key={p} ref={(i) => _this.btns[p] = i} className="board" onClick={_this.pressPanel.bind(_this, p)}>{p}</div>;
                })}
                <button onClick={this.start}>Start!</button>
            </div>
        );
    }

}