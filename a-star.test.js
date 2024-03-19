const { aStar } = require('./a-star')

const TEST_GRID = [
 [2,0,0,0],
 [0,1,1,0],
 [0,1,1,0],
 [0,0,3,0]
];

aStar({ x: 0, y: 0 }, { x: 2, y: 3 }, TEST_GRID);
