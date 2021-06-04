import {jsonGraph} from "./Utils";
import {DCEL} from "./DCEL"


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export function algorithm1(inputData:{vertices: number[][];edges: number[][];}): jsonGraph{
    console.log("algorithm 1");
  
    let myDCEL = new DCEL();
    let input = inputData;
    myDCEL.fromVerticiesEdges(input.vertices, input.edges)
    // console.log(myDCEL);
    
    const jsonGraph = myDCEL.toJSON();
    // console.log(jsonGraph);
    
    return jsonGraph;
  }

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  export function algorithm2(inFromA1: jsonGraph){
    console.log("algorithm 2");
    
    let myDCEL = new DCEL();
    myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    console.log(myDCEL);

    // html polygon id is the same as the DCEL polygon name
    const originPolygon = myDCEL.polygons[13];
    const polygonNeighbors = myDCEL.findPolygonNeighbors(originPolygon);
    console.log(polygonNeighbors);

    // returns neighbor info as string to display
  }


/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  export function algorithm4(inFromA1: jsonGraph){
    console.log("algorithm 4");
    
    // format output from algorithm1 back to DCEL
    let myDCEL = new DCEL();
    myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    // console.log(myDCEL);

    // get neighbor layers as an array of polygon ids
    // html polygon id is the same as the DCEL polygon name
    const originPolygon = myDCEL.polygons[8];
    const polygonNeighborLayers = myDCEL.findPolygonNeighborLayers(originPolygon);
    console.log(polygonNeighborLayers);

    // returns neighbor layer info as string to display

  }