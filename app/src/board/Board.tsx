import * as React from 'react';
import Game from '../Game';

export interface IBoardState {}

export interface IBoardProps {}

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
        var game = new Game();

      //  game.subscribe(Game.events.USER_CHECK_ROUND_OK, this.onGameCheck);
        game.getStream();
        game.getStream();
        game.getStream();
        var newStream = game.getStream();
        console.log(newStream);

    }

    render() { 
        var _this = this;
        return (
            <div className="board-panel flex-col">
                <div className="flex-1 flex-row">
                    <span key="green" className="board-btn board-btn-tl" data-color="green" onClick={_this.pressPanel.bind(_this, 'green')}></span>
                    <span key="red" className="board-btn board-btn-tr" data-color="red" onClick={_this.pressPanel.bind(_this, 'red')}></span>
                </div>
                <div id="visualizer" className="flex-col--a-center">START</div>
                <div className="flex-1 flex-row">
                    <span key="yellow" className="board-btn board-btn-bl" data-color="yellow" onClick={_this.pressPanel.bind(_this, 'yellow')}></span>
                    <span key="blue" className="board-btn board-btn-br" data-color="blue" onClick={_this.pressPanel.bind(_this, 'blue')}></span>
                </div>
            </div>
        );
    }

}