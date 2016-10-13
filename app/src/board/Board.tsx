/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import Game from '../Game';
import * as Log from '../common/Log';
import * as $ from 'jquery';


export const PANEL_COLOR = {
    GREEN : 'green',
    RED : 'red',
    YELLOW : 'yellow',
    BLUE : 'blue'
}

////////////////////// Howler Library
let loadSound = function(name) {
    if (window && window['Howl']) {
        Log.logRoot.d("Loading sound " + name);
        let Howl = window['Howl'];
        return new Howl({
            src: ['src/sound/' + name + '.mp3']
        });
    } else {
        Log.logRoot.e("Install howler library");
    }
};
////////////////////// Button behaviour
let pressButton = function(node) : boolean {
    if (node && node.className.indexOf("pressed") == -1 ) {
        var origClass = node.className;
        node.className = origClass + " pressed";
        setTimeout(() => node.className = origClass, 150);
        return true;
    } else {
        Log.logRoot.w('Button already pressed');
        return false;
    }
};

let GAME_SOUNDS = {};
GAME_SOUNDS[PANEL_COLOR.GREEN] = loadSound("C");
GAME_SOUNDS[PANEL_COLOR.RED] = loadSound("D");
GAME_SOUNDS[PANEL_COLOR.YELLOW] = loadSound("E");
GAME_SOUNDS[PANEL_COLOR.BLUE] = loadSound("F");

export interface IBoardState {
    started?:boolean,
    playingSequence?:boolean
}

export interface IBoardProps {
    speed:number,
    onGameStart?:()=>void,
    onGameOver?:()=>void,
    onTurnOk?:()=>void
}

export class Board extends React.Component<IBoardProps, IBoardState> {

    btns;
    log:Log.ILog;
    game:Game;

    constructor() {
        super();
        this.log = Log.getLog('Board');
        this.handleUserClick= this.handleUserClick.bind(this);
        this.playPanel= this.playPanel.bind(this);
        this.gameStart = this.gameStart.bind(this);
        this.gameGetSequence = this.gameGetSequence.bind(this);
        this.btns = {};
        this.state = {
            started : false,
            playingSequence : false
        }
    }

    playPanel(btnId:string) {
        if (pressButton(this.btns[btnId])) {
            this.log.d("handleUserClick:Button " + btnId + " pressed");
            GAME_SOUNDS[btnId].play();
        }
    }
    
    handleUserClick(btnId:string) {
        if (btnId == 'center') {
            pressButton(this.btns[btnId]);
            this.log.d("handleUserClick:Button center pressed!");
            if (!this.state.started) {
                this.gameStart();
            } else {
                this.log.w('Game already started');
            }
        } else {
            if (!this.state.playingSequence) {  
                this.playPanel(btnId);
                if (this.state.started) {
                    this.game.checkUserInput(btnId);
                }
            }
        }
    }

    gameStart() {
        this.log.i("Starting game");
        this.game = new Game([PANEL_COLOR.BLUE,PANEL_COLOR.YELLOW,PANEL_COLOR.RED,PANEL_COLOR.GREEN]);
        this.setState({started : true});
        if (this.props.onGameStart) {
            this.props.onGameStart.apply(null);
        } 
        this.game.subscribe(Game.events.GAME_OVER, () => {
            this.setState({started : false});
            $.each(PANEL_COLOR, (_,v) => this.playPanel(v));
            if (this.props.onGameOver) {
                this.props.onGameOver.apply(null);
            } 
        });
        this.game.subscribe(Game.events.USER_CHECK_ROUND_OK, () => {
            this.log.i("ROUND Ok.");
            this.gameGetSequence();
            if (this.props.onTurnOk) {
                this.props.onTurnOk.apply(null);
            }
        });
        this.gameGetSequence();
        //game.subscribe(Game.events.USER_CHECK_ROUND_OK, this.onGameCheck);        

    }

    gameGetSequence() {
        let sequence = this.game.getStream();
        this.log.i("Game sequence. Speed:" + this.props.speed + " -> " + sequence);
        this.setState({playingSequence : true});
        setTimeout((() => {
            sequence.forEach((v,i) => {    
                var isLast = i == sequence.length - 1;          
                setTimeout((() => {
                    this.playPanel(v);
                    if (isLast) {
                        setTimeout((() => this.setState({playingSequence : false})).bind(this), 500);
                    }
                }).bind(this),this.props.speed*i);
            });
        }).bind(this), 800);
    }


    render() { 
        var _this = this;
        var getPanel = (color:string, position:string) => (
            <span   key={color} 
                    className={"board-btn board-btn-" + position} 
                    data-color={color}
                    ref={(c) => _this.btns[color] = c} 
                    onClick={_this.handleUserClick.bind(_this, color)}>
            </span>
        );
        return (
            <div className={"board-panel flex-col " + ((this.state.started) ? ' started ' : ' ') + ((this.state.playingSequence) ? ' playing ' : ' ')}>
                <div className="flex-1 flex-row">
                    {getPanel(PANEL_COLOR.GREEN, 'tl')}
                    {getPanel(PANEL_COLOR.RED, 'tr')}
                </div>
                <div className="flex-col--a-center board-center-btn" 
                    ref={c => _this.btns['center'] = c} 
                    onClick={_this.handleUserClick.bind(_this, 'center')}>
                    {this.state.started ? ':)' : 'Start!'}
                </div>
                <div className="flex-1 flex-row">
                    {getPanel(PANEL_COLOR.YELLOW, 'bl')}
                    {getPanel(PANEL_COLOR.BLUE, 'br')}
                </div>
            </div>
        );
    }

}