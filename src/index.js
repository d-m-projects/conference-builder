import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ProgramContext from './contexts/programContext'
import Program from './contexts/Program'


ReactDOM.render(
	//   <React.StrictMode>
	<ProgramContext.Provider value={Program}>
		<App />
	</ProgramContext.Provider>,
	//   </React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
