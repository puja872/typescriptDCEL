import {jsonGraph} from "./Utils";
import {DCEL, Polygon} from "./DCEL"


export type Point = {
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
function pathOrientation(p1:Point, p2:Point, p3:Point): number{
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

  //given 3 colinear points, checks if point R is on segment P-Q
  function onColinearSegment(P: Point, Q:Point, R: Point){
    //currently assumes given points are colinear. can check via pathOrientation
    const inMaxX = (R.x <= Math.max(P.x, Q.x));
    const inMinX = (R.x >= Math.min(P.x, Q.x));
    const inMaxY = (R.y <= Math.max(P.y, Q.y));
    const inMinY = (R.y >= Math.min(P.y, Q.y));
    if (inMaxX && inMinX && inMaxY && inMinY){
      return true;
    }
    return false;
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

    const delta = pathOrientation(P, point, Q);
    //if crosses ray clockwise (delta = 0) and upward
    if((P.x <= point.x) && (point.x< Q.x && delta === 0)){
      wind += 1;
    }
    //if crosses ray counter-clockwise (delta = 1) and downward
    if((Q.x <= point.x) && (point.x < P.x) && delta === 1){
      wind -= 1;
    } 
    //if point is colinear with edge 
    if(delta === 2){
      //if point is colinear and on edge, the point is set as outside polygon. else, continue counting winding number
      const onSegment = onColinearSegment(P, Q, point);
      if(onSegment){
        wind = 0;
        break;
      }
    }
  }
  return wind;
}

/** describe point in polygon and its asymptotic behavior here, but that's just for winding number
 * @param polygon - polygon
 * @param point - point
 * @returns number representing inside or outside of polygon, 0 for outside polygon; 1 inside polygon
 * 
 * linear in the number of edges of a polygon, O(n) where n is number of edges in polygon
 */
export function pointInPolygon(polygon: Polygon, point: Point){
  const value = windingNumber(polygon, point);
  return value != 0
}


// export function algorithm3(inFromA1: jsonGraph, pointCoordinates:[number, number]){
//   console.log("algorithm 3");
  
//   //format graph data as DCEL
//   let myDCEL = new DCEL();
//   myDCEL.fromVerticiesEdgesPolygons(inFromA1.vertices, inFromA1.edges, inFromA1.polygons);
  
//   //define point for PIP inputs
//   const point: Point = {x:pointCoordinates[0],y:pointCoordinates[1]};

//   //check if polygons contain point. point on an edge of polygon is outside 
//   let containerPolygon: Polygon | undefined = undefined;
//   for(let polygon of myDCEL.polygons){
//     const pIP = pointInPolygon(polygon, point);
//     if(pIP){
//       containerPolygon = polygon;
//       break;
//     }
//   }
//   //return container polygon name or 
//   if(containerPolygon !== undefined){
//     //return text to display
//     console.log("Point [" + point.x + ","+ point.y + "] is in polygon " + containerPolygon.name);
//     return("Point [" + point.x + ","+ point.y + "] is in polygon " + containerPolygon.name);
//   }
//   else{
//     //return text to display
//     console.log("Point [" + point.x + ","+ point.y + "] is not in any polygon")
//     return("Point [" + point.x + ","+ point.y + "] is not in any polygon")
//   }
// }
