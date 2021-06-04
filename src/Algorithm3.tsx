import {jsonGraph} from "./Utils";
import {DCEL, Polygon} from "./DCEL"


type Point = {
  x: number;
  y: number;
};


//checks the direction of the path from p1 -> p2 -> p3 
//clockwise --> 0
//counter-clockwise --> 1
//colinear --> 2

/** brief, one line description
 * 
 * Describe what this is doing, also because it has a complex return type,
 * describe the return type here, too
 * 
 * @param p1 - first point 
 * @param p2 - second point
 * @param p3 - third point
 * @returns number representing direction, 0 for CW; 1 for CCW, 2 for colienar
 */
function pathIsClockwise(p1:Point, p2:Point, p3:Point): number{
  let val = (p1.x-p2.x)*(p3.y-p2.y) - (p1.y-p2.y)*(p3.x-p2.x);

  //is clockwise
  if(val > 0){
    return 0;
    }
  //is counter-clockwise or on an edge
  else if(val < 0) {
    return 1;
    }
  //is co-linear
  else {return 2;}
  }


//get the winding number
//the winding number is looking at edges that cross a Y direction ray from the point
//if point is on edge of polygon, it is consided to be outside of it 
//wind = 0 --> point is outside polygon
//wind != 0 --> point is inside polygon
function windingNumber(polygon: Polygon, point:Point){
  let wind = 0;
  for(let edge of polygon.edges){ 
    const P: Point = {x: edge.startVertex.x, y: edge.startVertex.y}
    const Q: Point = {x: edge.endVertex.x, y: edge.endVertex.y}
    // const Px = edge.startVertex.x;
    // const Py = edge.startVertex.y;
    // const Qx = edge.endVertex.x;
    // const Qy = edge.endVertex.y;

    const delta = pathIsClockwise(P, point, Q);
    if(delta === 2){
      wind = 0;
      break;
    }

    //if crosses ray clockwise
    if((P.x <= point.x) && (point.x< Q.x && delta === 0)){
      wind += 1;
    }
    //if crosses ray counter-clockwise
    if((Q.x <= point.x) && (point.x < P.x) && delta === 1){
      wind -= 1;
    } 
  }
  return wind;
}

/** describe point in polygon and its asymptotic behavior here, but that's just for winding number
 * @param polygon - first point 
 * @param pointX - second point
 * @param pointY - third point
 * @returns number representing inside or outside of polygon, 0 for outside polygon; 1 inside polygon
 * 
 * linear in the number of edges of a polygon, O(n) where n is number of edges in polygon
 */
export function pointInPolygon(polygon: Polygon, pointX: number, pointY: number){
  const point: Point = {x: pointX, y: pointY};
  const value = windingNumber(polygon, point);
  return value != 0
}


export function algorithm3(inFromA1: jsonGraph, xCoord:number, yCoord:number){
  console.log("algorithm 3");
  
  //format graph data as DCEL
  let myDCEL = new DCEL();
  myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
  
  //define point
  //const point: [number, number] = [1.5, 3.5];
  //const point: [number, number] = [8, 8];
  const point: Point = {x:xCoord,y:yCoord};
  //const point: [number, number] = [x, y];

  //check polygons for point
  let containerPolygon: Polygon | undefined = undefined;
  for(let polygon of myDCEL.polygons){
    const windingNum = windingNumber(polygon, point);
    console.log(windingNum);
    if(windingNum !== 0){
      containerPolygon = polygon;
      break;
    }
  }

  if(containerPolygon !== undefined){
    //return text to display
    console.log("Point [" + point.x + ","+ point.y + "] is in polygon " + containerPolygon.name);
    return("Point [" + point.x + ","+ point.y + "] is in polygon " + containerPolygon.name);
  }
  else{
    //return text to display
    console.log("Point [" + point.x + ","+ point.y + "] is not in any polygon")
    return("Point [" + point.x + ","+ point.y + "] is not in any polygon")
  }
  
  
  // console.log(myDCEL);
  // const polygon = myDCEL.polygons[8];
  // console.log("starting winding 1"); // should be 0 and inside
  // const windingNumber1 = windingNumber(polygon, [1.5,3.5]);
  // console.log("point1: " + windingNumber1);


}
