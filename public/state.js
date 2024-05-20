const gridInit = () => [...Array(GRID_WIDTH_COUNT)]
  .map(() => [...Array(GRID_WIDTH_COUNT)].fill(CELL_STATES.EMPTY))
  
const DEFAULT_STATE = () => ({
 grid: gridInit(),
 snakePos: null,
 applePos: null,
 tail: [],
 points: 0,
 gameOver: false
})

let STATE = {};

const stateInit = () => {
  const { grid, snakePos, applePos, tail, points, gameOver } = DEFAULT_STATE();
  return {
    grid,
    snakePos,
    applePos,
    tail,
    points,
    gameOver
  }
};
