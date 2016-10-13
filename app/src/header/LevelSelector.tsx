/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import Game from '../Game';
import * as Log from '../common/Log';
import * as $ from 'jquery';


export interface ILevelSelectorState {
    levelIdx?:number
}

export interface ILevelSelectorProps {
    levelLabels:string[],
    disabled:boolean,
    initialLevelIdx?:number,
    onLevelChange?:(number)=>void
}

/*
 <LevelSelector/>
	· State
		- levelId (props.initialIndex)
	· Props
		- levelLabels:[string]
		- initialIndex:?Number
		* onLevelChange
*/

export class LevelSelector extends React.Component<ILevelSelectorProps, ILevelSelectorState> {

    log:Log.ILog;

    constructor() {
        super();
        this.log = Log.getLog('LevelSelector');
        this.changeLevel = this.changeLevel.bind(this);
        this.handlePrevBtnClick = this.handlePrevBtnClick.bind(this);
        this.handleNextBtnClick = this.handleNextBtnClick.bind(this);
        this.state = {
            levelIdx : 0
        }
    }

    changeLevel(newLevel:number) {
        if (this.props.disabled) {
            this.log.w("Cannot change level. Component is disabled.");
        } else {
            this.log.i("Changind level to " + newLevel);
            this.setState({ levelIdx : newLevel  });
            if (this.props.onLevelChange)
                this.props.onLevelChange(newLevel);
        }
    }

    handlePrevBtnClick() {
        let newLevelIdx = (this.state.levelIdx === 0) ? this.props.levelLabels.length - 1 : this.state.levelIdx - 1;
        this.changeLevel(newLevelIdx);
    }

    handleNextBtnClick() {
        let newLevelIdx = (this.state.levelIdx == this.props.levelLabels.length - 1) ? 0 : this.state.levelIdx + 1;
        this.changeLevel(newLevelIdx);
    }

    render() {
        return (
            <div className={("flex-row level-selector") + ((this.props.disabled) ? ' disabled ' : '')}>
                <span className="no-btn level-selector-btn" onClick={this.handlePrevBtnClick}>&lt;</span>
                <div className="flex-1 level-text-wrapper">
                    {this.props.levelLabels.map((v,i) => 
                        <span key={i} className={"level-text " + ((this.state.levelIdx === i) ? ' active ' : ' ') }>{v}</span>
                    )}
                </div>
                <span className="no-btn  level-selector-btn" onClick={this.handleNextBtnClick}>&gt;</span>
            </div>
        );
    }
}