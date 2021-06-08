import {jsonGraph} from "./Utils"

//general functions
/** brief, one line description
 * 
 * Describe what this is doing, also because it has a complex return type,
 * describe the return type here, too
 * 
 * linear in the number of edges of a polygon, O(n) where n is number of edges in polygon
 */

/**
 * Returns the angle between the directed edge and horizontal axis running through the edge start point
 * The angle output runs from -pi rad (-180 deg) to pi rad (180 deg) where 0 rad (0 deg) is the positive x axis
 * 
 * @param edge 
 * @returns number representing angle in radians off horizontal axis 
 */
function angleOffAxis(edge: DirectedEdge): number{
  const [vecX, vecY] = edge.getVector();
  const angle = Math.atan2(vecY, vecX);
  return angle;
}

/**
 * Vertex class represents the 2d points in the DCEL graph
 * 
 * edgeStar: consists of the edges in the graph that start at the given vertex, directed outward
 */
class Vertex {
  name: string = "";
  x: number;
  y: number;
  edgeStar: DirectedEdge[] = []; 

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /**
   * Orders edges in edge star by the edge's angle off axis property
   * 
   * The edges will be ordered starting counter-clockwise from the -x axis through the vertex as a result of the output
   * of the angleOffAxis function. Ordering the edges simplifies the process for finding neighboring edges while 
   * traversing polygon cycles to create the DCEL
   * 
   */
  orderEdgeStar() {
    //order edges from -x axis CCW
    this.edgeStar.sort((a,b) => a.angleOffAxis - b.angleOffAxis);
  }

  /**
   * Returns the next directed edge in the edge star
   * 
   * First we find the given edge's twin because the given edge does not originate at the vertex we are trying to 
   * traverse and therefore will not be in the edge star. We find the edge twin through the directed edge properties. 
   * Then search for the edge twin in the edge star. Selecting the next edge from the twin in the edge star ensures you 
   * took the smallest right turn at the vertex while traversing from the input edge. 
   * 
   * See DirectedEdge class for edge twin description. See Vertex Class properties for edge star description. 
   * 
   * @param currentEdge a Directed edge where the endVertex is where we are turning from while traversing the polygon cycle
   * @returns nextEdge as a DirectedEdge
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
 * Directed edge class represents an edge in the DCEL graph. 
 * 
 * The Directed edge is directed in that the startVertex and endVertex are not interchangable. The Directed edge in the 
 * reverse direction is defined as it's twin. Therefore, an undirected edge is defined by a directed edge and it's twin 
 * For that reason, directed edges are also known as half-edges. Each directed edge can only be associated with one 
 * polygon.
 * 
 * twin: the directed edge's pair with opposite start and end verticies. This property is always set when adding edge 
 * twins in a DCEL graph. It is set after each directed edge is constructed. 
 * angleOffAxis: the angle between the directed edge and the positive horizontal axis through the start point. 
 * polygon: the polygon that the edge is associated with. Each edge can only be associated with one polygon in a DCEL
 */
export class DirectedEdge {
  name: string = "";
  startVertex: Vertex;
  endVertex: Vertex;
  twin!: DirectedEdge; 
  angleOffAxis: number;
  polygon!: Polygon;

  constructor(v1: Vertex, v2: Vertex){
    this.startVertex = v1;
    this.endVertex = v2;
    this.angleOffAxis = angleOffAxis(this); 
  }

  /**
   * Returns a 2d vector as [x,y] from the DirectedEdge startVertex to the endVertex
   * 
   * @param this DirectedEdge
   * @returns 2d vector as [x,y]
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
 * Polygon class represents the polygons of a DCEL graph
 * 
 * Polygons are defined by a list of their directed edges. The directed edges are ordered by the way they are traversed 
 * around the polygon. The start/end edge is not integral to the definition- they can be shifted as long as the overall
 * order remains the same.
 */
export class Polygon{
  name: string = "";
  edges: DirectedEdge[] = [];

  /**
   * Checks if path of closed polygon is clockwise or counter-clockwise
   * @returns true for CW path, false for CCW path
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
 * DCEL class represents the DCEL structure
 * 
 * DCEL: doubly connected edge list data structure. (also known as a half-edge data structure) The class represents the 
 * list of verticies, directed edges, and polygons the data structure is made of. 
 */
export class DCEL{
  vertices: Vertex[] = [];
  edges: DirectedEdge[] = [];
  polygons: Polygon[] = [];

  /**
   * Adds an edge and its twin to a DCEL
   * 
   * This function created and edge and its twin as directed edges. Once created it sets each directed edge's twin as 
   * each other. It names the directed edges based on the number of edges in the graph. It adds each directed edge to 
   * the DCEL. Lastly, it adds each directed edge to their respective start vertex edge stars.
   * 
   * O(1) constant time for each pair of vertices supplied
   * 
   * @param v1 Vertex 1
   * @param v2 Vertex 2
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
   * Creates a DCEL graph from given verticies and edges
   * 
   * First, the function creates a vertex from each x,y coordinate pair in inputVerticies and adds it to the graph. Next, 
   * it adds a directed edge and its twin for each edge in inputEdges to the graph using the addEdgeTwins function. Now 
   * that we have all of the verticies and edges, we order the edge stars for each vertex. The graph is now prepared to 
   * search for polygons. 
   * 
   * To find all of the polygons we will visit all of the directed edges in a DFS. We will traverse the potential polygon 
   * by choosing the smallest clockwise turn from each directed edge's end vertex. We do this by the vertex, 
   * getNextEdgeFromStar function. When we return to the start edge, we know we have found a polygon. If it traverses in 
   * a clockwise direction, we add the polygon to the graph and note the polygon for each DirectedEdge polygon property. 
   * Otherwise, it is the polygon that represents the outer polygon. We never visit any directed edge twice, therefore 
   * when we've visited all of the directed edges we have found all possible smallest polygons.   
   * 
   * parameter format:
   * inputVertices: [[x1,y1], [x2,y2], [x3,y3]...]
   * inputEdges: [[startVertexIndex, endVertexIndex], [startVertexIndex, endVertexIndex]...]
   * 
   * O(n) where n is the number of supplied edges
   * 
   * @param inputVertices given as a list of x,y coordinates
   * @param inputEdges  given as a list of index pairs into the inputVertices list
   */
  fromVerticesEdges(inputVertices: number[][], inputEdges: number[][]){
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
   *  Creates a DCEL graph from given verticies and edges
   * 
   * First, the function creates a vertex from each x,y coordinate pair in inputVerticies and adds it to the graph. Next, 
   * it adds a directed edge and its twin for each edge in inputEdges to the graph using the addEdgeTwins function. The 
   * input format includes both the directed edge and and its twin, so every second edge can be skipped while using 
   * addEdgeTwins. Now that we have all of the verticies and edges, we order the edge stars for each vertex. Lastly, we
   * add each polygon by creating an array of Directed edges from the list of edge indexes. 
   * 
   * parameter format:
   * inputVertices: [[x1,y1], [x2,y2], [x3,y3]...]
   * inputEdges: [[startVertexIndex, endVertexIndex], [startVertexIndex, endVertexIndex]...]
   * inputPolygons: [[edgeIndex1, edgeIndex2, edgeIndex3], [edgeIndex4, edgeIndex5, edgeIndex6]...]
   * 
   * O(n) time where n is the number of directed edges
   * 
   * @param inputVertices 
   * @param inputEdges 
   * @param inputPolygons 
   */
  fromVerticesEdgesPolygons(inputVertices: number[][], inputEdges: number[][], inputPolygons: number[][]){
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

  /**
   * Returns the DCEL graph in a JSON format
   * 
   * Output format is defined by inteface jsonGraph
   * Output format: {inputVertices: [[x1,y1], [x2,y2], [x3,y3]...]
   *                 inputEdges: [[startVertexIndex, endVertexIndex], [startVertexIndex, endVertexIndex]...]
   *                 inputPolygons: [[edgeIndex1, edgeIndex2, edgeIndex3], [edgeIndex4, edgeIndex5, edgeIndex6]...]
   *                }
   * 
   * @returns jsonGraph of DCEL data structure
   */
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
   * Returns the neighbors of a polygon as an array of polygons
   * 
   * This function starts at a polygon and looks through each edge to find neighboring polygons. The existing references 
   * with the DCEL data structure simplifies this process because edges know their twins and each of those twins will 
   * know if they are associated with a polygon. Therefore, we can start at a polygon, go to each edge (edge[i]), then 
   * to the twin of that edge (edge[i].twin), then to the associated polygon. If an associated polygon exists, we add it 
   * to our neighbors array.
   * 
   * O(n) where n represents the number of edges in the polygon. 
   * 
   * @param polygon 
   * @returns polygon[] representing the neighboring polygons
   */
  findPolygonNeighbors(polygon: Polygon): Polygon[]{
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
   * Returns neighbor layers as an array with an array of polygon names for each layer
   * 
   * This function performs a BFS to traverse the graph and find the neighbor layers from a given polygon. We start our 
   * queue with the origin polygon and continue as long as our queue has polygons to visit. We never visit a polygon 
   * twice. We keep track of which layer we are on with layerCount and the number of polygons of the queue we need to 
   * visit for that layer with layerLength. As we traverse the graph, everytime we visit an unvisited polygon, we use 
   * the findPolygonNeighbors to populate the queue with polygons we have not yet visited to be included in the 
   * following layer. We are also creating the array of polygon names for that layer to be added to the main array. When
   * our visitQueue is empty, we have been to all of the connected polygons. 
   * 
   * O(n): O(p + e) where p represents the number of polygons in the graph and e represents the connecting edges 
   * 
   * @param originPolygon the polygon to look for neighbor layers from
   * @returns array of polygon names for each layer
   */
  findPolygonNeighborLayers(originPolygon: Polygon): string[][]{
    let neighborLayer: string[][] = [[]];
    neighborLayer[0].push(originPolygon.name);
    let visitedPolygons: Set<Polygon> = new Set();
    let visitQueue: Polygon[] = [originPolygon];
    let layerCount = 1
    
    while(visitQueue.length > 0){
      //prepare layer
      let layerLength = visitQueue.length;
      neighborLayer.push([]);

      for(let i=0; i<layerLength; i++){
        //get polygon and remove from queue
        let currentPolygon = visitQueue[0];
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
    //remove last empty array
    neighborLayer.splice(neighborLayer.length-1,1);
    return neighborLayer;
  }
} //closes DCEL class



