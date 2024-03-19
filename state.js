const gridInit = () => [...Array(GRID_WIDTH_COUNT)]
  .map(() => [...Array(GRID_WIDTH_COUNT)].fill(CELL_STATES.EMPTY))
  
const DEFAULT_STATE = () => ({
 grid: gridInit(),
 cellState: CELL_STATES.COLLISION,
 startPos: null,
 endPos: null,
})

let STATE = {};

const stateInit = () => {
  const { grid, cellState, startPos, endPos } = DEFAULT_STATE();
  return {
    grid,
    cellState,
    startPos,
    endPos,
  }
};
