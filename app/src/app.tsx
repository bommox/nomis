/// <reference path="../../typings/index.d.ts" />

import {Board}  from './board/Board';
import {LevelSelector}  from './header/LevelSelector';
import Game from './Game';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import * as Log from './common/Log';
import * as Storage from './common/Storage';

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

const USER_DATA_RECORDS = 'UserDataRecords';

export class App extends React.Component<IAppProps, IAppState> {

    log:Log.ILog;
    nodes:any;

    constructor() {
        super();
        this.log = Log.getLog('App');
        this.handleOnLevelChange = this.handleOnLevelChange.bind(this);
        this.handleOnGameStart = this.handleOnGameStart.bind(this);
        this.handleOnGameOver = this.handleOnGameOver.bind(this);
        this.handleOnTurnOk = this.handleOnTurnOk.bind(this);
        this.saveData = this.saveData.bind(this);
        this.uiShakeTitle = this.uiShakeTitle.bind(this);

        this.nodes = {};

        let userRecords = Storage.get(USER_DATA_RECORDS, {
            'easy' : {record:0},
            'medium' : {record:0},
            'hard' : {record:0}
        });

        this.state = {
          //TODO - Recuperar de localStorage
          selectedLevel : 0,
          records : userRecords,
          score: 0,
          gameStarted: false
        }
    }

    uiShakeTitle() {
      let HeaderTitleBlast = $(".title")['blast']({delimiter:"character"});
      HeaderTitleBlast.velocity("callout.bounce",{
          delay:1500, stagger: 100, display:"inline-block"
      });
    }

    componentDidMount() {
      this.log.d('componentDidMount');
      $(this.nodes['header']).css('transform','translateY(-100%)');
      $(this.nodes['board']).css('transform','translateY(100%)');


      setTimeout((() => {
        $['Velocity'](this.nodes['header'], { translateY: [0, "-100%"] }, { easing:'spring', duration:1200});      
        $['Velocity'](this.nodes['board'],  { translateY: [0,'100%'] }, { easing:'spring', duration:1200});
        this.uiShakeTitle();
      }).bind(this),200);
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
      if (this.state.score > levelRecord) {
        this.log.d("New record");
        let userRecords = this.state.records;
        userRecords[currentLevelId] = {'record' : this.state.score}; 
        this.setState({
          records : userRecords,
          score: levelRecord,
          gameStarted: false
        }, this.saveData.bind(this));
      } else {
          this.setState({
            score: levelRecord,
            gameStarted : false
          });
      }
      this.uiShakeTitle();
    }

    handleOnTurnOk() {
      this.log.d("handleOnTurnOk");
      let newScore = this.state.score + 1;
      this.setState({
        score : newScore
      });
    }

    saveData() {
      this.log.i("Saving data...");
      Storage.put(USER_DATA_RECORDS, this.state.records);
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
              <div className="header" ref={(c) => this.nodes['header']  = c}>
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
              <div ref={(c) => this.nodes['board']  = c} >
                <Board speed={boardSpeed} onGameStart={this.handleOnGameStart} onGameOver={this.handleOnGameOver} onTurnOk={this.handleOnTurnOk} />
              </div>
              <div className="flex-1"></div>
          </div>
        );
    }
}



window['board'] = ReactDOM.render(
  <App levels={LEVELS} />,
  document.getElementById('AppContainer')
);