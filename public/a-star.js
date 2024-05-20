class Node {
  parent // successor parent (optional)
  x // x pos
  y // y pos
  f // sum of _g and _h
  g // movement cost to move from the starting point to a point on the grid
  h // estimated movement cost of moving from a point on the grid to the end point (heuristic)
}

const DIRECTIONS = {
  N:  { x:  0, y: -1 },
  // NE: { x:  1, y: -1 },
  E:  { x:  1, y:  0 },
  // SE: { x:  1, y:  1 },
  S:  { x:  0, y:  1 }, 
  // SW: { x: -1, y:  1 },
  W:  { x: -1, y:  0 },
  // NW: { x: -1, y: -1 },
}

const isInvalidCell = (x, y, width, height, walls) => {
  return x >= width // Outside grid boundary
  || x < 0
  || y >= height
  || y < 0
  || walls.some((wall) => wall.x == x && wall.y == y) // Collision
}

function aStar(start, end, width, height, walls) {
  const open = [];
  const closed = [];

  const startNode = new Node();
  startNode.x = start.x;
  startNode.y = start.y;
  startNode.g = 0;
  startNode.h = Math.abs(start.x - end.x) + Math.abs(start.y - end.y);
  startNode.f = 0;

  open.push(startNode)

  while (true) {
    if (!open.length) {
      console.error("No nodes in open list, end not found!");
      break;
    }

    open.sort((a, b) => b.f - a.f); // sort descending by node.f 
    const best = open.pop();

    if (best.x == end.x && best.y == end.y) {
      return best;
    }

    closed.push(best);

    for (let dir of Object.values(DIRECTIONS)) {
      const x = best.x + dir.x;
      const y = best.y + dir.y;

      if (isInvalidCell(x, y, width, height, walls)) {
        continue;
      }

      const successor = new Node();
      successor.x = x;
      successor.y = y;
      successor.g = best.g + 1;
      const dx = Math.abs(x - end.x);
      const dy = Math.abs(y - end.y);
      // const h = (dx + dy) + (Math.sqrt(2) - 2) * Math.min(dx, dy);
      successor.h = dx + dy; // Manhattan Heuristic
      successor.f = successor.g + successor.h;
      successor.parent = best;

      if (!open.some((node) => node.x == successor.x && node.y == successor.y)
        && !closed.some((node) => node.x == successor.x && node.y == successor.y)) {
        open.push(successor);
      }
    }
  }
}
