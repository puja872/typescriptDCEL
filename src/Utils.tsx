/**
 * Json format for a DCEL graph
 */
export interface jsonGraph {
    vertices: number[][];
    edges: number[][];
    polygons: number[][];
}

/**
 * Concatenates the two given strings
 * 
 * @param s1 string1
 * @param s2 string2
 * @returns string1 + string2
 */
export function stringBuilder(s1: string, s2: string): string{
  const s: string = s1.concat(s2);
  return s;
} 


