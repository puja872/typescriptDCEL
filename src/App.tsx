import React from 'react';
import './App.css';
import {GraphSVG} from "./graphSVG"
import {algorithm1, algorithm3,algorithm2, algorithm4}  from "./Algorithms"
import { stringBuilder } from './Utils';
import testData from "./TestData.json"



/**
 * Runs the algorithms and creates simple UI using React components to output html
 * @returns html for UI
 */
function App() {
  //dropdown state
  let [testCase, setTestCase] = React.useState("0");
  let testCaseIndex: number = +testCase;
  
  //get test case data
  const dataGraph = {vertices: testData[testCaseIndex].vertices, edges: testData[testCaseIndex].edges}
  //let title = testData[testCaseIndex].title;
  const description = testData[testCaseIndex].description;
  const neighborOrigin = testData[testCaseIndex].neighborOrigin;
  const pointInPolygon: [number,number] = [testData[testCaseIndex].pointInPolygon[0],testData[testCaseIndex].pointInPolygon[1]];

  //run algorithms
  const output1 = algorithm1(dataGraph);
  const output2 = algorithm2(output1, neighborOrigin);
  const output3 = algorithm3(output1, pointInPolygon);
  const output4 = algorithm4(output1, neighborOrigin);

  //create display text
  let descriptionText = stringBuilder("Description: ", description);
  const text1 = "algorithm 1: found " + output1.polygons.length.toString() + " polygons";
  const text2 = "algorithm 2: Polygon " + output2[0] + " neighbors- " + output2[1];
  const text3 = "algorithm 3: Point [" + pointInPolygon[0] + ","+ pointInPolygon[1] + "] is in " + output3;
  const text4 = "algorithm 4: " + output4;

  function dropdownOptions (){
    const options = [];
    for(let i =0; i<testData.length; i++){
      const name = testData[i].title;
      const uniqueKey = "option" + i.toString();
      options.push(
        <option value={i} key={uniqueKey}>{name}</option>
      )
    }
    return options;
  }
  
  //handles the dropdown list updates
  function handleOnChange(e: string){
    setTestCase(e);
    console.log("Updated graph")
  }


  return (
    <div className="App">
      <GraphSVG data={output1} />
      <div className="Input-Output"> 
        <div className="Input-data">
          <select id = "dropdown" onChange={(e) =>handleOnChange(e.target.value)} value={testCase}>
            {dropdownOptions()}
          </select>
        </div>
        <div className="Output-data">
          <div className="TestCaseOutputText">{descriptionText}</div>
          <div className="TestCaseOutputText">{text1}</div>
          <div className="TestCaseOutputText">{text2}</div>
          <div className="TestCaseOutputText">{text3}</div>
          <div className="TestCaseOutputText">{text4}</div>
        </div>
      </div>
    </div>
  );
}

export default App;
