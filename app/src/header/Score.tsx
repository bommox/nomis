/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import Game from '../Game';
import * as Log from '../common/Log';
import * as $ from 'jquery';


export interface IScoreState {
    
}

export interface IScoreProps {
    lastRecord:number,
    score:number,
    onNewRecord?:(number)=>void    
}

/*
		
 <Score/>
	· Props
		- lastRecord:number
		- score:number
		* onNewRecord

*/

export class Score extends React.Component<IScoreProps, IScoreState> {

    log:Log.ILog;

    constructor() {
        super();
        this.log = Log.getLog('Score');
    }

    render() {
        return (
            <div className="score">
                <div className="score-new-record">{(this.props.score > this.props.lastRecord) ? 'New Record!' : '..'}</div>
                <div className="score-value">{this.props.score}</div>
                <div className="score-last-record">{this.props.lastRecord}</div>  
            </div>           
        );
    }
}