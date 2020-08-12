import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router} from "react-router-dom";
import 'normalize.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ProgramProvider } from "./contexts/Program";

ReactDOM.render(
  // <React.StrictMode>
  <ProgramProvider>
		<Router>
    <App />
			</Router>
  </ProgramProvider>,
  // </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
