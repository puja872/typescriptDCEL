import React from 'react';
import logo from './logo.svg';
import './App.css';
//import justTrying from './Algorithm1'
import * as test from "./Algorithm1";





let text3 = test.testFunction();



function App() {
  //test.testFunction();
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="test">{text3}</div>
      </header>
    </div>
  );
}

export default App;
