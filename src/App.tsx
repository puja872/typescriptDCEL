import React,{useState} from 'react';
import './App.css';
import {GraphSVG} from "./graphSVG"
import inputData from "./InputData.json";
import {algorithm1, algorithm2, algorithm4}  from "./Algorithms"
import {algorithm3}  from "./Algorithm3"
import { stringBuilder } from './Utils';



let output1 = algorithm1(inputData);
const test2 = algorithm2(output1);
const output3 = algorithm3(output1, 1.5,3.5);
const test4 = algorithm4(output1);
console.log(test2);
//console.log(test3);
//console.log(test4);
console.log("done");

let text1 = "algorithm 1: details";
let text2 = "algorithm 2: details";
let text3 = stringBuilder("algorithm 3: ", output3);
let text4 = "algorithm 4: details";

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];


function App() {
//   let state = {
//     keyword: 'test', 
//     value: 'banana'
//  }

  const [foobar, setFoobar] = React.useState("N/A");
  //const [baz, setBaz] = React.useState({});

  // function handleOnChange(e) {
  //   setFoobar(e.target.value)
  //   let my_data = algorithm1(...)
  //   setBaz(my_data)
  // }

  //let [currentValue,setValue]=useState('');
  
  // function setValue(e: string){
  //   state.value = e;

  //   console.log(e);
  // }


  const data = output1;
  return (
    <div className="App">
      {/* <GraphSVG data={baz} /> */}
      <GraphSVG data={data} />
      <div className="Input-Output"> 
        <div className="Input-data">
        <select id = "dropdown" onChange={(e) =>setFoobar(e.target.value)} value={foobar}>
            <option value="N/A">N/A</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        
        <div className="Output-data">
          <div className="Algorithm1-text">{text1}</div>
          <div className="Algorithm2-text">{text2}</div>
          <div className="Algorithm3-text">{text3}</div>
          <div className="Algorithm4-text">{text4}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
