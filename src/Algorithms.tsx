import {jsonGraph} from "./Utils";
import {DCEL, Polygon} from "./DCEL"
import {pointInPolygon, Point} from "./PointInPolygon"


/**
 * Returns DCEL data structure in json format
 * 
 * Generates a DCEL data structure from vertices and edges in the provided format. After some research, I found that 
 * the DCEL data structure makes it simple to traverse edges to find the inside polygon cycles. 
 * 
 * Additionally, the vertex, directed edge, and polygon class properties simplify the process of traversing the 
 * graph for future algorithms. It is self referential in that vertices know what edges originate from them and edges 
 * know their start/end vertices. Edges know their twin- the directed edge with a reverse direction. Edges know what 
 * polygon they are a part of and polygons know their edges. Each of these elements holding on to this information makes 
 * it really easy to travel across the graph. 
 * 
 * The bulk of the work for this algorithm is done with the fromVerticesEdges function. It formats the given vertex and
 * edge data in the DCEL structure and then does a DFS of the edges to find the polygon cycles. The time complexity is 
 * O(n) where n is the number of edges. 
 * 
 * As a last step, this algorithm outputs the DCEL in a json format where edges refer to vertices by their index in the 
 * vertex array, and polygons refer to edges by their index in the edge array. This format replaces the self referential 
 * nature of the DCEL class, but also makes it easy to recreate the DCEL data structure as a DCEL class object. 
 * 
 * @param inputData 
 * @returns jsonGraph
 */
export function algorithm1(inputData:{vertices: number[][];edges: number[][];}): jsonGraph{
    console.log("algorithm 1");
    
    //creates DCEL data structure with the DCEL class
    let myDCEL = new DCEL();
    let input = inputData;
    myDCEL.fromVerticesEdges(input.vertices, input.edges)
    // console.log(myDCEL);
    
    //formats DCEL data structure in a json format
    const jsonGraph = myDCEL.toJSON();
    console.log(jsonGraph);
    
    return jsonGraph;
}

/**
 * Returns the index of the origin polygon from the DCEL and the names of the polygon's neighbors 
 * 
 * This algorithm initially recreates the DCEL data structure from the DCEL json data. It checks that the given polygon
 * index exists in the graph. If not, it will default to the first polygon in the graph array. Then the bulk of the work
 * is done by the findPolygonNeighbors function. The DCEL data structure has existing references that make it easy to 
 * traverse the graph to find neighboring polygons. For more detail on the path the function takes, see details in the 
 * findPolygonNeighbors function.
 * 
 * O(n) where n represents the number of edges in the polygon.  
 * 
 * @param inFromA1 the jsonGraph of the DCEL generated in algorithm1
 * @param originPolygonIndex index of origin polygon from the json graph
 * @returns index of origin polygon and string of polygon neighbor names
 */
export function algorithm2(inFromA1: jsonGraph, originPolygonIndex: number){
    console.log("algorithm 2");
    
    let myDCEL = new DCEL();
    myDCEL.fromVerticesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    //console.log(myDCEL);

    //check index of polygon lands within polygon list length
    let index = originPolygonIndex;
    if(index >= myDCEL.polygons.length){
        index = 0
    }

    //finds the polygon neighbors
    const originPolygon = myDCEL.polygons[index];
    const polygonNeighbors = myDCEL.findPolygonNeighbors(originPolygon);
    
    //returns neighbor info as string to display
    //html polygon id is the same as the DCEL polygon name
    const polygonNeighborNames = polygonNeighbors.map(a => a.name);
    console.log("Polygon " + index + " neighbors are " + polygonNeighborNames.join(", "));
    return [index, polygonNeighborNames];
}

/**
 * Returns a string of the containing polygon name, if any exists in the given graph
 * 
 * This algorithm initially recreates the DCEL data structure from the DCEL json data. Then it loops through each polygon
 * to determine if the given point is inside of it. If it is inside, the name of that polygon will be returned. If no 
 * polygon is found that will be noted in the return string. 
 * 
 * Each time we check if the point is in a polygon, we are using the pointInPolygon function. After some research, I 
 * decided to use the optimized version of the winding number algorithm to determine if the point was inside or outside. 
 * The original winding number algorithm was the sum of the angle from the point to each edge. If it was a multiple of 
 * 2pi the point was inside. The geometric intution behind this was simple, but reqired the use of many trigonometric 
 * functions. The ray casting method, on the other hand, was faster, but required more nuances to handle complex polygons.
 * Therefore, the known edited version of the winding number algorithm seemed to be the best option forward . A 
 * description of this algorithm can be found with the windingNumber function in PointInPolygon.tsx
 * 
 * The time complexity of this algorithm is O(p) where p is the number of polygons in the given graph, but for each 
 * polygon, O(e) where n represents the number of edges for that polygon. Therefore, the worst case where the point is 
 * not in any polygon is O(n), where n is the number of edges in the graph because we would look at every edge for every
 * polygon.  
 * 
 * @param inFromA1 the jsonGraph of the DCEL generated in algorithm1
 * @param pointCoordinates the x,y coordinate of the point in question
 * @returns string formatted with the name of the containing polygon, if any
 */
export function algorithm3(inFromA1: jsonGraph, pointCoordinates:[number, number]){
    console.log("algorithm 3");
    
    //format graph data as DCEL
    const myDCEL = new DCEL();
    myDCEL.fromVerticesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    
    //define point for pointInPolygon inputs
    const point: Point = {x:pointCoordinates[0],y:pointCoordinates[1]};
  
    //for each polygon of the graph, check if polygon contains point. 
    //point on an edge of polygon is outside 
    let containerPolygon: Polygon | undefined = undefined;
    for(let polygon of myDCEL.polygons){
      const pIP = pointInPolygon(polygon, point);
      if(pIP){
        containerPolygon = polygon;
        break;
      }
    }

    //return container polygon name 
    if(containerPolygon !== undefined){
      //return text to display
      console.log("Point [" + point.x + ","+ point.y + "] is in " + containerPolygon.name);
      return(containerPolygon.name);
    }
    else{
      //return text to display
      console.log("Point [" + point.x + ","+ point.y + "] is in no polygon")
      return("no polygons")
    }
}

/**
 * Returns neighbor layers as a string representing an array with an array of polygon names for each layer
 * 
 * This algorithm initially recreates the DCEL data structure from the DCEL json data. It checks that the given polygon
 * index exists in the graph. If not, it will default to the first polygon in the graph array. Then the bulk of the work
 * is done by the findPolygonNeighborLayers function. This function uses a BFS to traverse the graph and find neighbor
 * layers. It calls on the findPolygonNeighbors function from algorithm 2 to help fill the queue to visit. For more 
 * detail, see the findPolygonNeighborLayers function.
 * 
 * O(n): O(p + e) where p represents the number of polygons in the graph and e represents the connecting edges
 * 
 * @param inFromA1 the jsonGraph of the DCEL generated in algorithm1
 * @param originPolygonIndex index of origin polygon from the json graph
 * @returns returns an array with an array for each layer of polygons by name 
 */
export function algorithm4(inFromA1: jsonGraph, originPolygonIndex: number){
    console.log("algorithm 4");
    
    // format output from algorithm1 back to DCEL
    const myDCEL = new DCEL();
    myDCEL.fromVerticesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    // console.log(myDCEL);

    // check index of polygon lands within polygon list length
    let index = originPolygonIndex;
    if(index >= myDCEL.polygons.length){
        index = 0
    }
    
    // get neighbor layers as an array of polygon ids
    // html polygon id is the same as the DCEL polygon name
    const originPolygon = myDCEL.polygons[index];
    const polygonNeighborLayers = myDCEL.findPolygonNeighborLayers(originPolygon);

    // returns neighbor layer info as string to display
    console.log(polygonNeighborLayers);
    return JSON.stringify(polygonNeighborLayers);
}