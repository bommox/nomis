import {Board}  from './board/Board';
import Game from './Game';
import * as ReactDOM from 'react-dom';
import * as React from 'react';

console.log("Hola");

ReactDOM.render(
  <Board panels={['red','blue','lagoon']} />,
  document.getElementById('example')
);