const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;

function pixelToCellPos(x, y) {
  return {
    x: Math.floor((x / CANVAS_WIDTH) * GRID_WIDTH_COUNT),
    y: Math.floor((y / CANVAS_HEIGHT) * GRID_HEIGHT_COUNT),
  };
}

function cellToCellPixelPos(x, y) {
  return {
    x: CANVAS_WIDTH * (x / GRID_WIDTH_COUNT),
    y: CANVAS_HEIGHT * (y / GRID_HEIGHT_COUNT),
  };
}

function flattenNodes(node) {
  if (!node) return [];
  return [{ x: node.x, y: node.y }, ...flattenNodes(node.parent)];
}

function fillCell(cellPixelPos, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    cellPixelPos.x,
    cellPixelPos.y,
    GRID_CELL_WIDTH,
    GRID_CELL_WIDTH
  );
}

function drawCells() {
  STATE.grid.forEach((row, y) => {
    row.forEach((state, x) => {
      const cellPixelPos = cellToCellPixelPos(x, y);
      ctx.beginPath();
      switch (state) {
        case CELL_STATES.END: {
          fillCell(cellPixelPos, END_COLOR);
          break;
        }
        case CELL_STATES.START: {
          fillCell(cellPixelPos, START_COLOR);
          break;
        }
        case CELL_STATES.PATH: {
          fillCell(cellPixelPos, PATH_COLOR);
          break;
        }
        case CELL_STATES.COLLISION: {
          fillCell(cellPixelPos, COLLISION_COLOR);
          break;
        }
        default: {
          ctx.clearRect(
            cellPixelPos.x,
            cellPixelPos.y,
            GRID_CELL_WIDTH,
            GRID_CELL_WIDTH
          );
        }
      }
    });
  });
}

function drawGrid() {
  // Grid Setup
  ctx.beginPath();
  ctx.fillStyle = GRID_BORDER_COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(0, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);
  ctx.fillRect(0, CANVAS_HEIGHT - 1, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(CANVAS_WIDTH - 1, 0, GRID_LINE_WIDTH, CANVAS_HEIGHT);

  ctx.beginPath();
  ctx.fillStyle = GRID_LINE_COLOR;
  [...Array(GRID_WIDTH_COUNT)].forEach((_, idx) => {
    if (!idx) return;
    ctx.fillRect(0, idx * GRID_CELL_WIDTH, CANVAS_WIDTH, GRID_LINE_WIDTH);
    ctx.fillRect(idx * GRID_CELL_WIDTH, 0, GRID_LINE_WIDTH, CANVAS_WIDTH);
  });
}

function draw() {
  drawCells();
  drawGrid();
}

function equalPoints(point1, point2) {
  return point1.x == point2.x && point1.y == point2.y;
}

function gameOver(width, height) {
  let { x, y } = STATE.snakePos;
  return (
    x < 0 ||
    x > width ||
    y < 0 ||
    y > height ||
    STATE.tail.some(({ tx, ty }) => x == tx && y == ty)
  );
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function getRandomPos(width, height) {
  return {
    x: getRandomInt(0, width),
    y: getRandomInt(0, height),
  };
}

const width = 20;
const height = 20;
function loop() {
  setTimeout(() => {
    if (gameOver()) {
      alert("Game Over!");
      return;
    }

    STATE.grid = gridInit();
    let { x: sx, y: sy } = STATE.snakePos;
    let { x: ax, y: ay } = STATE.applePos;

    STATE.grid[sy][sx] = CELL_STATES.START;
    STATE.grid[ay][ax] = CELL_STATES.END;
    STATE.tail.forEach(({ x: tx, y: ty }) => {
      STATE.grid[ty][tx] = CELL_STATES.COLLISION;
    });

    const bestNode = aStar(
      STATE.snakePos,
      STATE.applePos,
      width,
      height,
      STATE.tail
    );
    const nodes = flattenNodes(bestNode);

    const oldApplePos = STATE.applePos;
    if (equalPoints(STATE.snakePos, STATE.applePos)) {
      STATE.applePos = getRandomPos(width, height);
      while (STATE.tail.some(({x, y}) => STATE.applePos.x == x && STATE.applePos.y == y)) {
        STATE.applePos = getRandomPos(width, height);
      }
      STATE.points += 1
      STATE.newPoint = true;
    }

    if (STATE.points) {
      if (STATE.tail.length && !STATE.newPoint) {
          STATE.tail.pop();
      }
      STATE.tail.unshift({
        x: STATE.snakePos.x,
        y: STATE.snakePos.y,
      });
    }

    if (STATE.newPoint) {
      STATE.snakePos = oldApplePos;
      STATE.newPoint = false
    } else {
      STATE.snakePos = nodes[nodes.length - 2];
    }

    draw();
    loop();
  }, 150);
}

function start() {
  const init = stateInit();
  STATE.grid = init.grid;
  STATE.snakePos = getRandomPos(width, height);
  STATE.applePos = getRandomPos(width, height);
  STATE.tail = init.tail;
  STATE.points = init.points;
  STATE.gameOver = init.gameOver;

  drawGrid();
  loop();
}

const init = stateInit();
STATE.grid = init.grid;
STATE.snakePos = getRandomPos(width, height);
STATE.applePos = getRandomPos(width, height);
STATE.tail = init.tail;
STATE.points = init.points;
STATE.gameOver = init.gameOver;

drawGrid();
