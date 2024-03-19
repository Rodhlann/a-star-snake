const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;

function drawGrid() {
  // Grid Setup
  ctx.beginPath()
  ctx.fillStyle = GRID_BORDER_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(0, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);
  ctx.fillRect(0, CANVAS_HEIGHT - 1, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(CANVAS_WIDTH - 1, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath()
  ctx.fillStyle = GRID_LINE_COLOR;
  [...Array(GRID_WIDTH_COUNT)].forEach((_, idx) => {
    if (!idx) return;
    ctx.fillRect(0, idx * GRID_CELL_WIDTH, CANVAS_WIDTH, GRID_LINE_WIDTH);
    ctx.fillRect(idx * GRID_CELL_WIDTH, 0, GRID_LINE_WIDTH, CANVAS_WIDTH);
  })
}

function drawCells() {
  STATE.grid.forEach((row, y) => {
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
        case CELL_STATES.PATH: {
          ctx.fillStyle = PATH_COLOR;
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

// function startTimer() {
//   TIMER = true;
//   const start = Date.now();
//   const timerUI = document.getElementById('a-star-timer');
//   setTimeout(() => {
//     timerUI.innerHTML = Date.now() - start;
//   }, 100);
//   const end = Date.now();
//   timerUI.innerHTML = end - start;
// }

// function endTimer() {
//   TIMER = false;
// }

function draw() {
  if (STATE.startPos && STATE.endPos) {
    // startTimer();
    const out = aStar(STATE.startPos, STATE.endPos, STATE.grid);
    // endTimer();
    STATE.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === CELL_STATES.PATH) STATE.grid[y][x] = CELL_STATES.EMPTY
      })
    })
    out.forEach((node) => {
      if (!STATE.grid[node[0].y][node[0].x]) {
        STATE.grid[node[0].y][node[0].x] = CELL_STATES.PATH;
      }
    })
  }

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

function resetCellState() {
  STATE = stateInit();
  draw();
}

function updateSelectedCellState(state) {
  STATE.cellState = state

  const [
    start, 
    collision, 
    end
  ] = document.getElementsByClassName('canvas_legend_button')
  switch(state) {
    case CELL_STATES.END: {
      start.classList.remove('selected')
      collision.classList.remove('selected')
      end.classList.add('selected')
      break;
    }
    case CELL_STATES.START: {
      start.classList.add('selected')
      collision.classList.remove('selected')
      end.classList.remove('selected')
      break;
    }
    case CELL_STATES.COLLISION:
      start.classList.remove('selected')
      collision.classList.add('selected')
      end.classList.remove('selected')
      break;
    default: {
      start.classList.remove('selected')
      collision.classList.remove('selected')
      end.classList.remove('selected')
    }
  }
}

function setCellState(x, y) {
  const gridState = STATE.grid[y][x]

  switch(STATE.cellState) {
    case CELL_STATES.END: {
      if (gridState === CELL_STATES.START) break;
      if (gridState === CELL_STATES.COLLISION) break;
      if (STATE.endPos?.x === x && STATE.endPos?.y === y) {
        STATE.endPos = null;
        STATE.grid[y][x] = CELL_STATES.EMPTY;
        break;
      }

      if (STATE.endPos)
        STATE.grid[STATE.endPos.y][STATE.endPos.x] = CELL_STATES.EMPTY
      STATE.grid[y][x] = CELL_STATES.END
      STATE.endPos = { x, y }
      break;
    }

    case CELL_STATES.START: {
      if (gridState === CELL_STATES.COLLISION) break;
      if (gridState === CELL_STATES.END) break;
      if (STATE.startPos?.x === x && STATE.startPos?.y === y) {
        STATE.startPos = null;
        STATE.grid[y][x] = CELL_STATES.EMPTY;
        break;
      }

      if (STATE.startPos)
        STATE.grid[STATE.startPos.y][STATE.startPos.x] = CELL_STATES.EMPTY
      STATE.grid[y][x] = CELL_STATES.START
      STATE.startPos = { x, y }
      break;
    }

    case CELL_STATES.COLLISION:
    default: {
      if (gridState === CELL_STATES.START) break;
      if (gridState === CELL_STATES.END) break;

      STATE.grid[y][x] = gridState === CELL_STATES.EMPTY ? CELL_STATES.COLLISION : CELL_STATES.EMPTY;
    }
  }
}

// Cell Selection Toggle Logic
canvas.addEventListener('click', (e) => {
  const mousePos = {
    x: e.pageX - canvas.offsetLeft,
    y: e.pageY - canvas.offsetTop
  };

  const cellPos = pixelToCellPos(mousePos.x, mousePos.y);
  setCellState(cellPos.x, cellPos.y);

  draw();
});

STATE = stateInit();

drawGrid();
