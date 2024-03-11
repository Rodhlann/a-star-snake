const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
const GRID_LINE_WIDTH = 1
const GRID_CELL_WIDTH = 20

// Grid Legend:
// 0 - empty space
// 1 - collision
// 2 - start position
// 3 - end position
const grid = [...Array(CANVAS_WIDTH / GRID_CELL_WIDTH)].map(() => [...Array(CANVAS_WIDTH / GRID_CELL_WIDTH)].fill(0))

ctx.canvas.width = CANVAS_WIDTH;
ctx.canvas.height = CANVAS_HEIGHT;

ctx.beginPath()
ctx.strokeStyle = 'black';
ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

// Grid Setup
ctx.beginPath()
ctx.fillStyle = 'grey';
[...Array(CANVAS_WIDTH / GRID_CELL_WIDTH)].forEach((_, idx) => {
  if (!idx) return;
  ctx.fillRect(0, idx * GRID_CELL_WIDTH, CANVAS_WIDTH, GRID_LINE_WIDTH);
  ctx.fillRect(idx * GRID_CELL_WIDTH, 0, GRID_LINE_WIDTH, CANVAS_WIDTH);
})

// Cell Selection
canvas.addEventListener('click', (e) => {
  const mousePos = {
    x: e.clientX - canvas.offsetTop,
    y: e.clientY - canvas.offsetLeft
  };
  console.log(JSON.stringify(mousePos));
});
