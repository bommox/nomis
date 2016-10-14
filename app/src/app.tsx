/// <reference path="../../typings/index.d.ts" />

import {Board}  from './board/Board';
import {LevelSelector}  from './header/LevelSelector';
import Game from './Game';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Log from './common/Log';

let log = Log.getLog('AppMain');

log.d('Starting App...');

interface LevelData {
  id:string,
  label:string,
  speed:(number)=>number
}

interface UserLevelData {
    [index: string]: {
        record: number
    }
}

const getSpeedFunction = function(to:number, tf:number, nf: number):(number)=>number {
  let a = (to - tf)/(nf*nf);
  let b = -2*(to - tf)/nf;
  let c=to;
  return function(n:number) {
    return (n > nf) ? tf : a*n*n+b*n+c;
  }
}

const LEVELS:LevelData[] = [
  {id:'easy', label: 'easy', speed:getSpeedFunction(600,300,30)},
  {id:'medium', label: 'medium', speed:getSpeedFunction(450,200,30)},
  {id:'hard', label: 'hard', speed:getSpeedFunction(300,200,30)}
];


export interface IAppState {
  records?: UserLevelData,
  selectedLevel?:number,
  score?:number,
  gameStarted?:boolean
}

export interface IAppProps {
  levels:LevelData[]
}

export class App extends React.Component<IAppProps, IAppState> {

    log:Log.ILog;

    constructor() {
        super();
        this.log = Log.getLog('App');
        this.handleOnLevelChange = this.handleOnLevelChange.bind(this);
        this.handleOnGameStart = this.handleOnGameStart.bind(this);
        this.handleOnGameOver = this.handleOnGameOver.bind(this);
        this.handleOnTurnOk = this.handleOnTurnOk.bind(this);
        this.state = {
          //TODO - Recuperar de localStorage
          selectedLevel : 0,
          records : {
            'easy' : {record:15},
            'medium' : {record:10},
            'hard' : {record:0}
          },
          score: 0,
          gameStarted: false
        }
    }


    handleOnLevelChange(newValue:number) {
      this.log.i("handleOnLevelChange -> " + newValue);
      this.setState({
        selectedLevel : newValue
      });
    }

    handleOnGameStart()  {
      this.log.d("handleOnGameStart");
      this.setState({
        score: 0,
        gameStarted : true
      });
    }

    handleOnGameOver() {
      this.log.d("handleOnGameOver");
      let currentLevelId = this.props.levels[this.state.selectedLevel].id;
      let levelRecord = this.state.records[currentLevelId].record;
      this.setState({
        score: levelRecord,
        gameStarted : false
      });
    }

    handleOnTurnOk() {
      this.log.d("handleOnTurnOk");
      this.setState({
        score : this.state.score + 1
      })
    }

    render() {
        let levelLabels = this.props.levels.map((level) => level.label);
        let levelIds = this.props.levels.map((level) => level.id);
        let currentLevel = this.props.levels[this.state.selectedLevel];
        let currentLevelId = currentLevel.id;
        let boardSpeed = currentLevel.speed(this.state.score);
        let currentLevelRecord = this.state.records[currentLevelId].record;
        let hasRecord = (this.state.gameStarted && this.state.score > currentLevelRecord);
        return (
           <div className="flex-1 flex-col">
              <div className="header">
                  <div className="header-container">
                      <div className="title">Simon Says</div>
                      <div className="separator-big"></div>
                      <div className="level-selector-wrapper">
                          <LevelSelector 
                              disabled={this.state.gameStarted}
                              levelLabels={this.props.levels.map((level) => level.label)} 
                              initialLevelIdx={this.state.selectedLevel}
                              onLevelChange={this.handleOnLevelChange}
                          />
                          <div className="separator-small"></div>
                      </div>      
                  </div>
                  <div className={"score " + (hasRecord ? "highlight" : "")}>
                      <div className="score-label">
                        {
                          (hasRecord)                 ? 'new record!'
                          :(!this.state.gameStarted)  ? 'Record is'
                                                      : ''
                        }
                      </div>
                      <div className="score-value">{(this.state.gameStarted) ? this.state.score : currentLevelRecord}</div>  
                  </div>
              </div>
              <div className="flex-2"></div>
              <Board speed={boardSpeed} onGameStart={this.handleOnGameStart} onGameOver={this.handleOnGameOver} onTurnOk={this.handleOnTurnOk} />
              <div className="flex-1"></div>
          </div>
        );
    }
}



window['board'] = ReactDOM.render(
  <App levels={LEVELS} />,
  document.getElementById('AppContainer')
);