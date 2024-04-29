// const { aStar } = require('./a-star')

// const TEST_GRID = [
//  [2,1,1,3],
//  [0,1,1,0],
//  [0,1,1,0],
//  [0,0,0,0]
// ];

// let startPos, endPos;

// TEST_GRID.map((rows, y) => {
//   rows.map((cell, x) => {
//     if (cell === 2) {
//       startPos = { x, y }
//     } else if (cell === 3) {
//       endPos = { x, y }
//     }
//   })
// })

// aStar(startPos, endPos, TEST_GRID);

function flattenNodes(node) {
  if (node?.pos) {
    return [{x: node.pos.x, y: node.pos.y}, ...flattenNodes(node.parent)]
  } else {
    return []
  }
}

const res = flattenNodes({ pos: { x: 0, y: 0 }, parent: { pos: { x: 1, y: 1 }, parent: { pos: { x: 2, y: 2 }}}})

console.log(res);
