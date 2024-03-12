const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
const GRID_LINE_WIDTH = 1
const GRID_CELL_WIDTH = 25
const GRID_WIDTH_COUNT = CANVAS_WIDTH / GRID_CELL_WIDTH
const GRID_HEIGHT_COUNT = CANVAS_HEIGHT / GRID_CELL_WIDTH

const BACKGROUND_COLOR = ''
const GRID_LINE_COLOR = 'gray'
const GRID_BORDER_COLOR = 'black'
const COLLISION_COLOR = '#9b9b9b'
const START_COLOR = 'green'
const END_COLOR = 'red'

const CELL_STATES = {
  EMPTY: 0,
  COLLISION: 1,
  START: 2,
  END: 3
}
const grid = [...Array(GRID_WIDTH_COUNT)].map(() => [...Array(GRID_WIDTH_COUNT)].fill(CELL_STATES.EMPTY))

ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;

const STATE = {
  SELECTION: CELL_STATES.COLLISION,
  START_POS: null,
  END_POS: null
}

function drawGrid() {
  // Grid Setup
  ctx.beginPath()
  ctx.strokeStyle = GRID_BORDER_COLOR;
  ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath()
  ctx.fillStyle = GRID_LINE_COLOR;
  [...Array(GRID_WIDTH_COUNT)].forEach((_, idx) => {
    if (!idx) return;
    ctx.fillRect(0, idx * GRID_CELL_WIDTH, CANVAS_WIDTH, GRID_LINE_WIDTH);
    ctx.fillRect(idx * GRID_CELL_WIDTH, 0, GRID_LINE_WIDTH, CANVAS_WIDTH);
  })
}

function drawCells() {
  grid.forEach((row, y) => {
    row.forEach((state, x) => {
      const cellPixelPos = cellToCellPixelPos(x, y)
      
      ctx.beginPath();
      switch(state) {
        case CELL_STATES.END: {
          ctx.fillStyle = END_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        case CELL_STATES.START: {
          ctx.fillStyle = START_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        case CELL_STATES.COLLISION: {
          ctx.fillStyle = COLLISION_COLOR;
          ctx.fillRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
          break;
        }
        default: {
          ctx.clearRect(cellPixelPos.x, cellPixelPos.y, GRID_CELL_WIDTH, GRID_CELL_WIDTH);
        }
      }
    })
  })
}

function draw() {
  drawCells();
  drawGrid();
}

function pixelToCellPos(x, y) {
  return {
    x: Math.floor((x / CANVAS_WIDTH) * GRID_WIDTH_COUNT),
    y: Math.floor((y / CANVAS_HEIGHT) * GRID_HEIGHT_COUNT) 
  }
}

function cellToCellPixelPos(x, y) {
  return {
    x: (CANVAS_WIDTH * (x / GRID_WIDTH_COUNT)),
    y: (CANVAS_HEIGHT * (y / GRID_HEIGHT_COUNT))
  }
}

// Not sure if this is necessary
function cellToCenteredPixelPos(x, y) {
  return {
    x: (CANVAS_WIDTH * (x / GRID_WIDTH_COUNT)) + (GRID_CELL_WIDTH / 2),
    y: (CANVAS_HEIGHT * (y / GRID_HEIGHT_COUNT)) + (GRID_CELL_WIDTH / 2)
  }
}

function updateSelectedCellState(state) {
  STATE.SELECTION = state
}

function setCellState(x, y) {
  const gridState = grid[y][x]

  switch(STATE.SELECTION) {
    case CELL_STATES.END: {
      if (STATE.END_POS)
        grid[STATE.END_POS.y][STATE.END_POS.x] = CELL_STATES.EMPTY
      grid[y][x] = CELL_STATES.END
      STATE.END_POS = { x, y }
      break;
    }
    case CELL_STATES.START: {
      if (STATE.START_POS)
        grid[STATE.START_POS.y][STATE.START_POS.x] = CELL_STATES.EMPTY
      grid[y][x] = CELL_STATES.START
      STATE.START_POS = { x, y }
      break;
    }
    case CELL_STATES.COLLISION:
    default: {
      grid[y][x] = gridState === CELL_STATES.EMPTY ? CELL_STATES.COLLISION : CELL_STATES.EMPTY
    }
  }
}

// Cell Selection Toggle Logic
canvas.addEventListener('click', (e) => {
  const mousePos = {
    x: e.clientX - canvas.offsetLeft,
    y: e.clientY - canvas.offsetTop
  };

  // TODO: break out in to function for handling various cell states
  const cellPos = pixelToCellPos(mousePos.x, mousePos.y);
  setCellState(cellPos.x, cellPos.y);

  draw();
});

drawGrid();
