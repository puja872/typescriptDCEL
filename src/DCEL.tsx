import {jsonGraph} from "./Utils"
import {stringBuilder} from "./Utils"

//general functions
/**
 * 
 * @param edge 
 * @returns 
 */
function angleOffAxis(edge: DirectedEdge): number{
  const [vecX, vecY] = edge.getVector();
  const t = Math.atan2(vecY, vecX);
  return t;
}

/**
 * 
 */
class Vertex {
  name: string = "";
  x: number;
  y: number;

  // describe edgestar
  edgeStar: DirectedEdge[] = []; 

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * 
   */
  orderEdgeStar() {
    //order edges from -x axis CCW
    this.edgeStar.sort((a,b) => a.angleOffAxis - b.angleOffAxis);
  }

  /**
   * 
   * @param currentEdge 
   * @returns 
   */
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


/**
 * describe directed edge / half edge and all of its members
 */
export class DirectedEdge {
  name: string = "";
  startVertex: Vertex;
  endVertex: Vertex;
  // describe twin
  twin!: DirectedEdge; //this property is always set when adding twins in DCEL 
  // Describe angle off axis
  angleOffAxis: number;
  // describe polygon
  polygon!: Polygon;

  constructor(v1: Vertex, v2: Vertex){
    this.startVertex = v1;
    this.endVertex = v2;
    this.angleOffAxis = angleOffAxis(this); 
  }

  /**
   * 
   * @param this 
   * @returns 
   */ 
  getVector(this: DirectedEdge):[number, number]{
    const Ax: number = this.startVertex.x;
    const Ay: number = this.startVertex.y;
    const Bx: number = this.endVertex.x;
    const By: number = this.endVertex.y;
    return [(Bx-Ax), (By-Ay)];
  }
} //closes DirectedEdge class

/**
 * 
 */
export class Polygon{
  name: string = "";
  // describe the order of the edges (i.e does order matter?)
  edges: DirectedEdge[] = [];
  //neighbors: Polygon[] = [];

  /**
   * 
   * @returns 
   */
  pathIsClockwise(): boolean{
    let total = 0;
    for(let e of this.edges){
      const v1 = e.startVertex;
      const v2 = e.endVertex;
      const edgeVal = (v2.x - v1.x)*(v2.y + v1.y);
      total += edgeVal;
    }
    //>0 is clockwise
    if(total > 0){
      return true;
    }
    //<0 is counterclockwise
    else{
      return false;
    }
  }
}// closes Polygon class


/**
 * 
 */
export class DCEL{
  vertices: Vertex[] = [];
  edges: DirectedEdge[] = [];
  polygons: Polygon[] = [];

  /**
   * 
   * @param v1 
   * @param v2 
   */
  addEdgeTwins(v1: Vertex, v2: Vertex){
    //create directed edge and twin for each given edge 
    const edge1 = new DirectedEdge(v1, v2);
    const edge2 = new DirectedEdge(v2, v1);

    //set edge properties: name and twin
    edge1.name = "e" + this.edges.length.toString();
    edge2.name = "e" + (this.edges.length +1).toString();
    edge1.twin = edge2;
    edge2.twin = edge1;

    //add edges to DCEL
    this.edges.push(edge1);
    this.edges.push(edge2);

    //add edges to their respective vertex stars
    v1.edgeStar.push(edge1);
    v2.edgeStar.push(edge2);
  }

  /**
   * 
   * also  describe asymptotic behavior
   * 
   * @param inputVertices 
   * @param inputEdges 
   */
  fromVerticiesEdges(inputVertices: number[][], inputEdges: number[][]){
    //add vertices to DCEL
    for(let [x, y] of inputVertices){
      const vertex = new Vertex(x,y);
      vertex.name = "v" + this.vertices.length.toString();
      this.vertices.push(vertex);
    }

    //add edges to DCEL
    for(let [v1Index, v2Index] of inputEdges){
      const v1 = this.vertices[v1Index];
      const v2 = this.vertices[v2Index];
      this.addEdgeTwins(v1, v2);
    }

    //order vertex edge stars
    for(let v  of this.vertices){
      v.orderEdgeStar();
    }

    //add polygon cycles to DCEL
    let visitedEdges = new Set();

    for(let edge of this.edges){
      //if you've already been to this edge, move on
      if(visitedEdges.has(edge)){
        continue;
      }
      //else, start traversing the cycle to find polygon
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

      //add polygon to DCEL if it is an inside polygon
      if(polygon.pathIsClockwise()){
        polygon.name = "p" + this.polygons.length.toString();
        this.polygons.push(polygon);

        for(let edge of polygon.edges){
          edge.polygon = polygon;
        }
      }
    }
  } 

  /**
   *  does a thing. does it for some number of things
   *  this should take O(n) time.
   * describe asymptotic detail
   * 
   * @param inputVertices 
   * @param inputEdges 
   * @param inputPolygons 
   */
  fromVerticiesEdgesPolygons(inputVertices: number[][], inputEdges: number[][], inputPolygons: number[][]){
    //add vertices to DCEL
    for(let [x, y] of inputVertices){
      const vertex = new Vertex(x,y);
      vertex.name = "v" + this.vertices.length.toString();
      this.vertices.push(vertex);
    }

    //add edges to DCEL
    //every 2nd edge is a twin, so you can skip initiating adding the edge for every other edge
    for(let i= 0; i< inputEdges.length; i+=2){
      let [v1Index, v2Index] = inputEdges[i];

      const v1 = this.vertices[v1Index];
      const v2 = this.vertices[v2Index];
      this.addEdgeTwins(v1, v2);
    }

    //order vertex edge stars
    for(let v  of this.vertices){
      v.orderEdgeStar();
    }

    //add polygons to DCEL
    for(let p of inputPolygons){
      let polygon = new Polygon();
      for(let eIndex of p){
        let edge = this.edges[eIndex];
        polygon.edges.push(edge);
      }
      polygon.name = "p" + this.polygons.length.toString();
      this.polygons.push(polygon);

      for(let edge of polygon.edges){
        edge.polygon = polygon;
      }
    }
  }

  toJSON():jsonGraph{
    let vertexForJson = [];
    for(let vertex of this.vertices){
      let x = vertex.x;
      let y = vertex.y;
      //add vertex as [x, y]
      vertexForJson.push([x,y]);
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
      polygonForJson.push(polygonEdges);
    }

    const json: jsonGraph = {vertices: vertexForJson, edges: edgeForJson, polygons: polygonForJson};
    return(json);
  }

  /**
   * describe that it goes through the polygon->edge[i]->edge[i].twin->polygon
   * and that it's already built these references via the whatever function
   * asymptotic behavior 
   * @param polygon 
   * @returns 
   */
  findPolygonNeighbors(polygon: Polygon){
    let allNeighbors: Polygon[] = []
    for(let edge of polygon.edges){
      if(edge.twin.polygon !== undefined){
        const neighbor = edge.twin.polygon;
        allNeighbors.push(neighbor);
      }
    }
    return allNeighbors;
  }

  /**
   * asymptotic
   * @param originPolygon 
   * @returns 
   */
  findPolygonNeighborLayers(originPolygon: Polygon){
    //console.log("start finding");
    //console.log(originPolygon);
    
    let neighborLayer: String[][] = [[]];
    neighborLayer[0].push(originPolygon.name);
    let visitedPolygons: Set<Polygon> = new Set();
    let visitQueue: Polygon[] = [originPolygon];
    let layerCount = 1
    
    while(visitQueue.length > 0){
      //prepare layer
      let layerLength = visitQueue.length;
      neighborLayer.push([]);

      for(let i=0; i<layerLength; i++){
        let pname = ""
        for(let ptest of visitQueue){
          pname = stringBuilder(pname, ptest.name)
        }
        //console.log("polygons in queue: " + pname);

        //get polygon and remove from queue
        let currentPolygon = visitQueue[0];
        //console.log("at polygon: " + currentPolygon.name);
        visitQueue.splice(0,1);
        
        //mark as visited
        visitedPolygons.add(currentPolygon);

        //get neighbors 
        const neighbors: Polygon[] = this.findPolygonNeighbors(currentPolygon);

        //for each neighbor, if it has not been visited yet
        for (let neighborPolygon of neighbors){
          if(!visitedPolygons.has(neighborPolygon)){
            //add neighbor to its respective layer array
            neighborLayer[layerCount].push(neighborPolygon.name);
            
            //mark as visited
            visitedPolygons.add(neighborPolygon);
            
            //add to visitation queue
            visitQueue.push(neighborPolygon);
          }
        }      
      }
      layerCount += 1;
    }

    return neighborLayer;

    

  }

  checkOutsideInputs(){
    //check for invalid inputs
  }

} //closes DCEL class



