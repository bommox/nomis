/// <reference path="../../typings/index.d.ts" />

import {Board}  from './board/Board';
import Game from './Game';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

console.log("Hola amigo");

window['board'] = ReactDOM.render(
  <Board  />,
  document.getElementById('example')
);