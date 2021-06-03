
import {JSONforGraph} from "./graphJSON"
//import inputData from "./inputData.json";


//general functions
function angleOffAxis(edge: DirectedEdge): number{
  const [vecX, vecY] = edge.getVector();
  const t = Math.atan2(vecY, vecX);
  return t;
}

// function stringBuilder(s1: string, s2: string): string{
//   const s: string = s1.concat(s2);
//   return s;
// } 

class Vertex {
  name: string = "";
  x: number;
  y: number;
  edgeStar: DirectedEdge[] = []; 

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  orderEdgeStar() {
    //order edges from -x axis CCW
    this.edgeStar.sort((a,b) => a.angleOffAxis - b.angleOffAxis)
  }

  getNextEdgeFromStar(currentEdge: DirectedEdge):DirectedEdge{
    const twinEdge = currentEdge.twin;
    const currentIndex = this.edgeStar.indexOf(twinEdge);
    let nextIndex = currentIndex + 1;
    //if you're at the end of the edgeStar[], go back to beginning
    if (nextIndex >= this.edgeStar.length){
      nextIndex = 0;
    }
    const nextEdge = this.edgeStar[nextIndex];
    return nextEdge;
  }
}// closes Vertex class


class DirectedEdge {
  name: string = "";
  startVertex: Vertex;
  endVertex: Vertex;
  twin!: DirectedEdge; //this property is always set when adding twins in graph 
  angleOffAxis: number;
  polygons: Polygon[] = [];

  constructor(v1: Vertex, v2: Vertex){
    this.startVertex = v1;
    this.endVertex = v2;
    this.angleOffAxis = angleOffAxis(this); 
  }

  getVector(this: DirectedEdge):[number, number]{
    const Ax: number = this.startVertex.x;
    const Ay: number = this.startVertex.y;
    const Bx: number = this.endVertex.x;
    const By: number = this.endVertex.y;
    return [(Bx-Ax), (By-Ay)];
  }
} //closes DirectedEdge class


class Polygon{
  name: string = "";
  edges: DirectedEdge[] = [];
  neighbors: Polygon[] = [];

  pathIsClockwise(this: Polygon): boolean{
    let total = 0
    for(let e of this.edges){
      const v1 = e.startVertex;
      const v2 = e.endVertex;
      const edgeVal = (v2.x - v1.x)*(v2.y + v1.y);
      total += edgeVal
    }
    if(total > 0){
      return true;
    }
    else{
      return false;
    }
  }
}// closes Polygon class


class Graph{
  vertices: Vertex[] = [];
  edges: DirectedEdge[] = [];
  polygons: Polygon[] = [];


  addEdgeTwins(v1: Vertex, v2: Vertex){
    //create directed edge and twin for each given edge 
    const edge1 = new DirectedEdge(v1, v2);
    const edge2 = new DirectedEdge(v2, v1);

    //set edge properties: name and twin
    edge1.name = "e" + this.edges.length.toString();
    edge2.name = "e" + (this.edges.length +1).toString();
    edge1.twin = edge2;
    edge2.twin = edge1;

    //add edges to graph
    this.edges.push(edge1);
    this.edges.push(edge2);

    //add edges to their respective vertex stars
    v1.edgeStar.push(edge1);
    v2.edgeStar.push(edge2);
  }


  fromVerticiesEdges(inputVertices: number[][], inputEdges: number[][]){
    //add vertices to graph
    for(let [x, y] of inputVertices){
      const vertex = new Vertex(x,y);
      vertex.name = "v" + this.vertices.length.toString();
      this.vertices.push(vertex);
    }

    //add edges to graph
    for(let [v1Index, v2Index] of inputEdges){
      const v1 = this.vertices[v1Index];
      const v2 = this.vertices[v2Index];
      this.addEdgeTwins(v1, v2);
    }

    //order vertex edge stars
    for(let v  of this.vertices){
      v.orderEdgeStar();
    }

    //add polygon cycles to graph
    let visitedEdges = new Set();

    for(let edge of this.edges){
      //if you've already been to this edge, move on
      if(visitedEdges.has(edge)){
        continue;
      }
      //or else start traversing the cycle
      let currentEdge = edge;
      visitedEdges.add(currentEdge);
      let origin = edge.startVertex;
      let polygon = new Polygon();
      polygon.edges.push(edge);

      while(origin !== currentEdge.endVertex){
        let endVertex = currentEdge.endVertex;
        let nextEdge = endVertex.getNextEdgeFromStar(currentEdge);
        
        if(visitedEdges.has(nextEdge)){
          break;
        }
        visitedEdges.add(nextEdge);
        polygon.edges.push(nextEdge);
        currentEdge = nextEdge;
      }

      //add polygon to graph if it is an inside polygon
      if(polygon.pathIsClockwise()){
        polygon.name = "p" + this.polygons.length.toString();
        this.polygons.push(polygon);
      }
    }
  } 


  fromVerticiesEdgesPolygons(inputVertices: number[][], inputEdges: number[][], inputPolygons: number[][]){
        //add vertices to graph
        for(let [x, y] of inputVertices){
          const vertex = new Vertex(x,y);
          vertex.name = "v" + this.vertices.length.toString();
          this.vertices.push(vertex);
        }

        //add edges to graph
        //every 2nd edge is a twin, so you can skip initiating adding the edge for every other edge
        for(let i= 0; i< inputEdges.length; i+=2){
          let [v1Index, v2Index] = inputEdges[i];

          const v1 = this.vertices[v1Index];
          const v2 = this.vertices[v2Index];
          this.addEdgeTwins(v1, v2)
        }
    
        //order vertex edge stars
        for(let v  of this.vertices){
          v.orderEdgeStar();
        }

        //add polygons to graph
        for(let p of inputPolygons){
          let polygon = new Polygon();
          for(let eIndex of p){
            let edge = this.edges[eIndex];
            polygon.edges.push(edge);
          }
          polygon.name = "p" + this.polygons.length.toString();
          this.polygons.push(polygon);
        }
  }

  toJSON():JSONforGraph{
    let vertexForJson = []
    for(let vertex of this.vertices){
      let x = vertex.x;
      let y = vertex.y;
      //add vertex as [x, y]
      vertexForJson.push([x,y])
    }

    let edgeForJson = []
    for(let edge of this.edges){
      let startVIndex = this.vertices.indexOf(edge.startVertex);
      let endVIndex = this.vertices.indexOf(edge.endVertex);
      //add edge as [startVIndex, endVIndex]
      edgeForJson.push([startVIndex, endVIndex]);
    }

    let polygonForJson = []
    for(let polygon of this.polygons){
      let polygonEdges = [];
      for(let edge of polygon.edges){
        let edgeIndex = this.edges.indexOf(edge);
        polygonEdges.push(edgeIndex);
      }
      //add polygon as [edgeIndex1,2,3...]
      polygonForJson.push(polygonEdges)
    }

    const json: JSONforGraph = {vertices: vertexForJson, edges: edgeForJson, polygons: polygonForJson}
    return(json)

  }

  checkOutsideInputs(){

  }

} //closes Graph class



export function algorithm1(inputData:{vertices: number[][];edges: number[][];}): JSONforGraph{
  console.log("Starting algorithm 1");

  let myGraph = new Graph();
  let input = inputData;
  myGraph.fromVerticiesEdges(input.vertices, input.edges)
  const gJson = myGraph.toJSON();
  console.log("graph")
  console.log(myGraph);
  console.log("gjson");
  console.log(gJson);
  
  return gJson;
}

export function algorithm2(inFrom1: JSONforGraph){

  let myGraph = new Graph();
  console.log("Starting algorithm 2")
  myGraph.fromVerticiesEdgesPolygons(inFrom1.vertices, inFrom1.edges, inFrom1.polygons);
  console.log("got graph for 2")
  console.log(myGraph);
  
}


// const inV: number[][] = [[0,0], [2,0], [2,2], [0,2]];
// const inE: number[][] = [[0,1], [1,2], [0,2], [0,3], [2,3]];

// const inV: number[][] = [[1,2], [3,2], [3,3],[5,3], [5,1], [4,1], [2,1]];
// const inE: number[][] = [[0, 1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1], [5,1]];

// [
//   {"testcase1": 
//       {
//           "vertices": [[0,0], [2,0], [2,2], [0,2]],
//           "edges":[[0,1], [1,2], [0,2], [0,3], [2,3]]
//       }
//   },
//   {"testcase2":
//       {
      //     "description": "This is not a square",
//           "vertices": [[1,2], [3,2], [3,3],[5,3], [5,1], [4,1], [2,1]],
//           "edges": [[0, 1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1], [5,1]]
//       }
//   }
// ]