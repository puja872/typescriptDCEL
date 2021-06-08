import {Polygon} from "./DCEL"

/**
 * Type to define a 2d point. 
 */
export type Point = {
  x: number;
  y: number;
};


/** 
 * Determine the path orientation/direction of three ordered points. 
 * 
 * Given three ordered points, this will calculate a value to determine if the direction of travel through them.
 * Returns 0 for Clockwise, 1 for Counter-Clockwise, and 2 for Co-linear.
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


/**
 * Given 3 colinear points, checks if point R is on segment P-Q
 * 
 * Checks that the x and y coordinate of the point in question (R) lies within the min and max of the segement (P-Q) end
 * points' x and y. This function assumes the given points are colinear. Can check this via the pathOrientation function.
 * 
 * @param P start point of segment 
 * @param Q end point of segement 
 * @param R point check
 * @returns boolean, true for on segment, false for not on segment
 */
function onColinearSegment(P: Point, Q:Point, R: Point): boolean{
  const inMaxX = (R.x <= Math.max(P.x, Q.x));
  const inMinX = (R.x >= Math.min(P.x, Q.x));
  const inMaxY = (R.y <= Math.max(P.y, Q.y));
  const inMinY = (R.y >= Math.min(P.y, Q.y));
  if (inMaxX && inMinX && inMaxY && inMinY){
    return true;
  }
  return false;
}


/**
 * Calculates the point's winding number with respect to the given polygon
 * 
 * This function looks at all the edges that cross a vertical axis though the point. It calculates the path orientation 
 * from the segment start point --> point --> segment end point. The path orientation in conjunction with the edge 
 * direction determines if you add or subtract from the winding number. The function returns the winding number. If a 
 * point is on a polygon edge, it is considered to be outside of it and returns wind = 0. 
 * 
 * wind = 0: point is outside polygon, wind != 0 point is inside polygon
 * 
 * This method makes it simple to handle nuances of complex polygons and points that line up with edges. 
 * 
 * O(n) where n is number of edges in polygon
 * 
 * @param polygon polygon as a Polygon of the DCEL structure
 * @param point point as Point type object
 * @returns number representing the winding number
 */
function windingNumber(polygon: Polygon, point:Point): number{
  let wind = 0;
  for(let edge of polygon.edges){ 
    const P: Point = {x: edge.startVertex.x, y: edge.startVertex.y}
    const Q: Point = {x: edge.endVertex.x, y: edge.endVertex.y}

    const delta = pathOrientation(P, point, Q);

    //if crosses ray clockwise (delta = 0) and positive direction edge
    if((P.x <= point.x) && (point.x< Q.x && delta === 0)){
      wind += 1;
    }
    //if crosses ray counter-clockwise (delta = 1) and negative direction edge
    if((Q.x <= point.x) && (point.x < P.x) && delta === 1){
      wind -= 1;
    } 
    //if colinear and point is on edge, point is returned as outside polygon. else, continue counting winding number
    if(delta === 2){
      const onSegment = onColinearSegment(P, Q, point);
      if(onSegment){
        wind = 0;
        break;
      }
    }
  }
  return wind;
}


/** 
 * Returns boolean representing if point is inside polygon
 * 
 * @param polygon - polygon
 * @param point - point
 * @returns boolean representing inside or outside of polygon, false for outside polygon; true for inside polygon
 * 
 */
export function pointInPolygon(polygon: Polygon, point: Point): boolean{
  const value = windingNumber(polygon, point);
  return value !== 0
}

