
//general functions
function angleOffAxis(edge: DirectedEdge): number{
  const [vecX, vecY] = edge.getVector();
  const t = Math.atan2(vecY, vecX);
  return t;
}

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

  getNextStarEdge(currentEdge: DirectedEdge):DirectedEdge{
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
}

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
}

class Polygon{
  name: string = "";
  edges: DirectedEdge[] = [];
  neighbors: Polygon[] = [];

  constructor(initialEdge: DirectedEdge){
    this.edges.push(initialEdge)
  }

  isClockwise(this: Polygon){
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


}

class Graph{
  vertices: Vertex[] = [];
  edges: DirectedEdge[] = [];
  polygons: Polygon[] = [];

  constructor(vertices: number[][], edges: number[][]){
    this.generateGraph(vertices, edges);
  }

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

  getMinVertex(this: Graph):Vertex | undefined{
    if (this.vertices.length === 0){
      return undefined;
    }

    let minSum: number | undefined = undefined;
    let minPt: Vertex | undefined = undefined;

    for(let v of this.vertices){
      const newSum = v.x + v.y;
      if(minSum === undefined){
        minSum = newSum;
        minPt = v;
      }
      else if(newSum < minSum){
        minSum = newSum;
        minPt = v;
      } 
    }
    return minPt;
  }

  generateGraph(inputVertices: number[][], inputEdges: number[][]){
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
      this.addEdgeTwins(v1, v2)
    }

    //order vertex edge stars
    for(let v  of this.vertices){
      v.orderEdgeStar();
    }

    //add cycles as Polygon to graph
    let visitedEdges = new Set();
    
    //get polygon cycles
    for(let edge of this.edges){
      //if you've already been to this edge, move on
      if(visitedEdges.has(edge)){
        continue;
      }
      //or else start traversing the cycle
      let currentEdge = edge;
      visitedEdges.add(currentEdge);
      let origin = edge.startVertex;
      let polygon = new Polygon(edge);
      //polygon.edges.push(edge);

      while(origin !== currentEdge.endVertex){
        let endVertex = currentEdge.endVertex;
        let nextEdge = endVertex.getNextStarEdge(currentEdge);
        
        if(visitedEdges.has(nextEdge)){
          break;
        }
        visitedEdges.add(nextEdge);
        polygon.edges.push(nextEdge);
        currentEdge = nextEdge;
      }

      //add polygon to graph if it is an inside polygon
      if(polygon.isClockwise()){
        polygon.name = "p" + this.polygons.length.toString();
        this.polygons.push(polygon);
      }
    }
  } //closes generate graph function
} //closes graph class


//const inV: number[][] = [[0,0], [2,0], [2,2], [0,2]];
//const inE: number[][] = [[0,1], [1,2], [0,2], [0,3], [2,3]];

const inV: number[][] = [[1,2], [3,2], [3,3],[5,3], [5,1], [4,1], [2,1]];
const inE: number[][] = [[0, 1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1], [5,1]];

// "polygon" : {vertices:
//               edges,
//             }

function stringBuilder(s1: string, s2: string): string{
  const s: string = s1.concat(s2);
  return s;
} 

export function testFunction(): string{
  let s: string = "Starting this test";
  //console.log(s);

  const myGraph = new Graph(inV , inE);
  console.log("got this many polygon: " + myGraph.polygons.length)
  console.log(myGraph);

  //const jsonGraph = JSON.stringify(myGraph.polygons);

  //console.log(s);
  return s;
}