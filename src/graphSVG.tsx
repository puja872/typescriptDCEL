import * as React from 'react';
import {jsonGraph} from "./Utils"

/**
 * Graph SVG input
 */
interface IProps {
    data: jsonGraph;
  }
  
/**
 * Returns an SVG with drawn polygon element.
 * 
 * Formats polygon points from the jsonGraph format. Creates SVG element. Populates SVG with polygons. Scales SVG with
 * a viewbox.  
 */
export class GraphSVG extends React.Component<IProps> {
    /**
     * Returns formatted polygon points from the jsonGraph format
     * @param graphData 
     * @returns array of formatted strings for the polygon points
     */
    jsontoPolygon(graphData: jsonGraph): string[]{
      let polylinesPoints: string[] = [];
      
      for(let polygon of graphData.polygons){
        const polygonString: string[] =[];

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
    
    /**
     * Returns viewbox parameters to scale SVG to fit the polygon drawing
     * 
     * @param graphData 
     * @returns SVG viewbox parameters [minX, minY, width, height]
     */
    scaleViewBox(graphData: jsonGraph){
        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;
        let maxY = -Infinity;
        //loops through polygons, to edges, to vertices so we can scale the viewbox to only points in the polygons
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
  
    /**
     * Returns the all polygons drawn as html SVG elements
     * 
     * Gives each polygon a unique id that refers to its index in the DCEL structure. Fills it with a random color.
     * 
     * @param graphData 
     * @returns polygons as SVG elements 
     */
    createPolygons(graphData: jsonGraph) {
      const pointSets: string[] = this.jsontoPolygon(graphData);
      
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
                points={pointSets[i]}> 
                <title>{id}</title>
            </polygon>)
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