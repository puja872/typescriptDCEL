export interface jsonGraph {
    vertices: number[][];
    edges: number[][];
    polygons: number[][];
}

export function stringBuilder(s1: string, s2: string): string{
  const s: string = s1.concat(s2);
  return s;
} 


// [
//   {"testcase1": 
//       {
//           "vertices": [[0,0], [2,0], [2,2], [0,2]],
//           "edges":[[0,1], [1,2], [0,2], [0,3], [2,3]]
//       }
//   },
//   {"testcase2":
//       {
      //     "description": "This is not a square",
//           "vertices": [[1,2], [3,2], [3,3],[5,3], [5,1], [4,1], [2,1]],
//           "edges": [[0, 1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,1], [5,1]]
//       }
//   },
//   {"testcase3": 
//       {
//           "vertices": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5],[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[2,0],[2,1],[2,2],[2,3],[2,4],[2,5],[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]],
//           "edges": [[0,1],[1,2],[2,3],[3,4],[4,5],[6,7],[7,8],[8,9],[9,10],[10,11],[12,13],[13,14],[14,15],[15,16],[16,17],[18,19],[19,20],[20,21],[21,22],[22,23],[24,25],[25,26],[26,27],[27,28],[28,29],[30,31],[31,32],[32,33],[33,34],[34,35],[0,6],[6,12],[12,18],[18,24],[24,30],[1,7], [7,13],[13,19],[19,25],[25,31],[2,8],[8,14],[14,20],[20,26],[26,32],[3,9],[9,15],[15,21],[21,27],[27,33],[4,10],[10,16],[16,22],[22,28],[28,34],[5,11],[11,17],[17,23],[23,29],[29,35]]                    
//       }      
//    }
// ]