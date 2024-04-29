const gridInit = () => [...Array(GRID_WIDTH_COUNT)]
  .map(() => [...Array(GRID_WIDTH_COUNT)].fill(CELL_STATES.EMPTY))
  
const DEFAULT_STATE = () => ({
 grid: gridInit(),
 cellState: CELL_STATES.COLLISION,
 startPos: null,
 endPos: null,
 aStarPath: [],
 walls: [],
 duration: 0
})

let STATE = {};

const stateInit = () => {
  const { grid, cellState, startPos, endPos, aStarPath, walls, duration } = DEFAULT_STATE();
  return {
    grid,
    cellState,
    startPos,
    endPos,
    aStarPath,
    walls,
    duration
  }
};
