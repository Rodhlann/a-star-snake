const { aStar } = require('./a-star')

const TEST_GRID = [
 [2,1,1,3],
 [0,1,1,0],
 [0,1,1,0],
 [0,0,0,0]
];

let startPos, endPos;

TEST_GRID.map((rows, y) => {
  rows.map((cell, x) => {
    if (cell === 2) {
      startPos = { x, y }
    } else if (cell === 3) {
      endPos = { x, y }
    }
  })
})

aStar(startPos, endPos, TEST_GRID);
