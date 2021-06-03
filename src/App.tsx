import * as React from 'react';
import './App.css';
import * as test from "./Algorithm1";
import {JSONforGraph} from "./graphJSON"
import inputData from "./inputData.json";


//const data: string = "20,20 40,25 60,40 80,120 120,140 200,180";

interface IProps {
  data: JSONforGraph;
}

class DrawGraph extends React.Component<IProps> {
  jsontoPolyline(graphData: JSONforGraph){
    let polylinesPoints: string[] = [];
    for(let polygon of graphData.polygons){
      let polygonString: string[] =[];
      for(let edgeIndex of polygon){
        const startVertexIndex = graphData.edges[edgeIndex][0];
        const x = graphData.vertices[startVertexIndex][0];
        const y = graphData.vertices[startVertexIndex][1];
        polygonString.push((x + "," + y)); 
      }
      polylinesPoints.push(polygonString.join(" "));
    }
    console.log(polylinesPoints);
    return polylinesPoints;
  }
  
  scaleViewBox(vertices: number[][]){
    //need to get just used vertices
    console.log(vertices);
    let minX = vertices[0][0];
    let maxX = vertices[0][0];
    let minY = vertices[0][1];
    let maxY = vertices[0][1];
    for(let v of vertices){
      if(v[0]< minX){
        minX = v[0];
      }
      if(v[0]> maxX){
        maxX = v[0];
      }
      if(v[1]< minY){
        minY = v[1];
      }
      if(v[1]>maxY){
        maxY = v[1];
      }
    }

    return([minX, minY, (maxX-minX)*(1), (maxY-minY)*(1)])
  }

  createPolygons(graphData: JSONforGraph) {
    const pointSets: string[] = this.jsontoPolyline(graphData);
    console.log(pointSets);
    
    let polygons = [];
    for(let i=0; i<pointSets.length; i++){
      const uniqueKey = "polygon" + i.toString();
      const randomColor = "#" + ((1<<24)*Math.random() | 0).toString(16);
      
      polygons.push(
      <polygon 
      className = "Polygons"
      key = {uniqueKey}
      fill={randomColor}
      points={pointSets[i]}
    />)
    }
    return polygons
  }

  render() {
    const viewBoxInputs =this.scaleViewBox(this.props.data.vertices);
    console.log(viewBoxInputs);
    return (
      <div className = "Graph-drawing">
        <svg className= "SVG" viewBox={`${viewBoxInputs[0]} ${viewBoxInputs[1]} ${viewBoxInputs[2]} ${viewBoxInputs[3]}`}>
          {this.createPolygons(this.props.data)}
        </svg>
      </div>
    );
  }
}

let output1 = test.algorithm1(inputData);
const test4 = test.algorithm2(output1)
console.log("done")

let text1 = "algorithm 1: details"
let text2 = "algorithm 2: details"
let text3 = "algorithm 3: details"
let text4 = "algorithm 4: details"

function App() {
  const data = output1;
  return (
    <div className="App">
      <DrawGraph data={data} />
      <div className="Output-data">
        <div className="Algorithm1-text">{text1}</div>
        <div className="Algorithm2-text">{text2}</div>
        <div className="Algorithm3-text">{text3}</div>
        <div className="Algorithm4-text">{text4}</div>
      </div>
    </div>
  );
}

export default App;
