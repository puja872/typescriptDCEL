import * as React from 'react';
import './App.css';
import * as test from "./Algorithm1";



let output1 = test.algorithm1();
const test4 = test.algorithm2(output1)
let text = "just something"
console.log("done")


interface IProps {
  data: string[];
}

interface IState {
}

class DrawGraph extends React.Component<IProps, IState> {
  createPolygons(pointSets: string[]) {
    let polygons = [];
    for(let i=0; i<pointSets.length; i++){
      const uniqueKey = "polygon" + i.toString();
      const randomColor = "#" + ((1<<24)*Math.random() | 0).toString(16);
      
      polygons.push(
      <polyline 
      key = {uniqueKey}
      fill={randomColor}
      stroke="#000000"
      strokeWidth = "1"
      points={pointSets[i]}
    />)
    }

    return polygons
  }

  render() {
    return (
      <svg>
        {this.createPolygons(this.props.data)}
      </svg>
    );
  }
}

//need to format output data for drawing!
//clean up what the page looks like
//organize files
//write functions that will be used for algorithm 2

function App() {
  //test.testFunction();
  const data = ["20,40 40,25 60,40 80,120 120,140 200,180","20,40 40,50 60,10 80,90 120,100 200,200" ]
  //const data: string = "20,20 40,25 60,40 80,120 120,140 200,180";
  return (
    <div className="App">
      <header className="App-header">
        <div className="test">{text}</div>
      </header>
      <DrawGraph data={data} />
    </div>

  );
}

export default App;
