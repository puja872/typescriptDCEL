import {jsonGraph} from "./Utils";
import {DCEL, Polygon} from "./DCEL"
import {pointInPolygon, Point} from "./PointInPolygon"



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
  export function algorithm2(inFromA1: jsonGraph, originPolygonIndex: number){
    console.log("algorithm 2");
    
    let myDCEL = new DCEL();
    myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    console.log(myDCEL);

    // check index of polygon lands within polygon list length
    let index = originPolygonIndex;
    if(index >= myDCEL.polygons.length){
        index = 0
    }

    // html polygon id is the same as the DCEL polygon name
    const originPolygon = myDCEL.polygons[index];
    const polygonNeighbors = myDCEL.findPolygonNeighbors(originPolygon);
    
    // returns neighbor info as string to display
    let polygonNeighborNames = polygonNeighbors.map(a => a.name);
    console.log("Polygon " + index + " neighbors are " + polygonNeighborNames.join(", "));
    return [index, polygonNeighborNames];
  }

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
export function algorithm3(inFromA1: jsonGraph, pointCoordinates:[number, number]){
    console.log("algorithm 3");
    
    //format graph data as DCEL
    let myDCEL = new DCEL();
    myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
    
    //define point for PIP inputs
    const point: Point = {x:pointCoordinates[0],y:pointCoordinates[1]};
  
    //check if polygons contain point. point on an edge of polygon is outside 
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

/////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
  export function algorithm4(inFromA1: jsonGraph, originPolygonIndex: number){
    console.log("algorithm 4");
    
    // format output from algorithm1 back to DCEL
    let myDCEL = new DCEL();
    myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
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