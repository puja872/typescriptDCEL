import * as React from 'react';
import {jsonGraph} from "./Utils"

interface IProps {
    data: jsonGraph;
  }
  
export class GraphSVG extends React.Component<IProps> {
    jsontoPolyline(graphData: jsonGraph){
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
      return polylinesPoints;
    }
    
    scaleViewBox(graphData: jsonGraph){
    //need to get just used vertices
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
    
        for(let polygon of graphData.polygons){
            for(let edgeIndex of polygon){
                const edge = graphData.edges[edgeIndex];
                const vertexIndex = edge[0];
                const v = graphData.vertices[vertexIndex];
                
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
        }      
      return([minX, minY, (maxX-minX), (maxY-minY)]);
    }
  
    createPolygons(graphData: jsonGraph) {
      const pointSets: string[] = this.jsontoPolyline(graphData);
      
      let polygons = [];
      for(let i=0; i<pointSets.length; i++){
        const uniqueKey = "polygon" + i.toString();
        const randomColor = "#" + ((1<<24)*Math.random() | 0).toString(16);
        const id = "P" + i.toString();
        polygons.push(
            <polygon 
                className = "Polygons"
                id = {id}
                key = {uniqueKey}
                fill={randomColor}
                points={pointSets[i]}
            />)
      }
      return polygons
    }
  
    render() {
      const viewBoxInputs =this.scaleViewBox(this.props.data);

      return (
        <div className = "Graph-drawing">
          <svg className= "SVG" viewBox={`${viewBoxInputs[0]} ${viewBoxInputs[1]} ${viewBoxInputs[2]} ${viewBoxInputs[3]}`}>
            {this.createPolygons(this.props.data)}
          </svg>
        </div>
      );
    }
  }