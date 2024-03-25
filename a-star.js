class Node {
  pos
  f // sum of _g and _h
  g // movement cost to move from the starting point to a point on the grid
  h // estimated movement cost of moving from a point on the grid to the end point (heuristic)
  p // successor parent (optional)
}

const DIRECTIONS = {
  N:  { x:  0, y: -1 },
  NE: { x:  1, y: -1 },
  E:  { x:  1, y:  0 },
  SE: { x:  1, y:  1 },
  S:  { x:  0, y:  1 },
  SW: { x: -1, y:  1 },
  W:  { x: -1, y:  0 },
  NW: { x: -1, y: -1 },
}

function isValid(x, y, closed, grid) {
  return (
    !(x > grid[0].length-1) && // not outside grid boundary
    x > -1 && 
    !(y > grid.length-1) &&
    y > -1 &&
    grid[y][x] !== 1 && // Not collision
    !(closed.some((node) => node.pos.x === x && node.pos.y === y)) // Not already checked
  );
}

function aStar(start, end, grid) {
  const open = [];
  const closed = [];
  const out = [];

  const startNode = new Node();
  startNode.pos = start;
  startNode.g = 0;
  startNode.h = 0;
  startNode.f = 0;

  open.push(startNode)

  while (open.length) {
    open.sort((a, b) => a.f < b.f); // sort descending by node.f 
    const q = open.pop();

    out.push({ pos: q.pos, f: q.f });

    const successors = Object.values(DIRECTIONS)
      .map((dir) => {
        const successor = new Node();
        successor.pos = { x: q.pos.x + dir.x, y: q.pos.y + dir.y };
        if (isValid(successor.pos.x, successor.pos.y, closed, grid)) {
          successor.g = q.g + 1; // TODO: HOW TO CALC????
          const dx = Math.abs(successor.pos.x - end.x)
          const dy = Math.abs(successor.pos.y - end.y)
          successor.h = (dx + dy) + (Math.sqrt(2) - 2) * Math.min(dx, dy);
          successor.f = successor.g + successor.h;
          successor.p = q;
          return successor;
        }
      }).filter(Boolean);

    for (let i = 0; i < successors.length; i++) {
      const successor = successors[i];
      if (successor.pos.x === end.x && successor.pos.y === end.y) {

        // --- DEBUG CODE START ---
        // grid.map((rows, y) => {
        //   const row = rows.map((_, x) => {
        //     const filtered = out.find((node) => node[0].x === x && node[0].y === y)
        //     return filtered ? Math.ceil(filtered[1]) : 0
        //   })
        //   console.log(row)
        //   }
        // );
        // --- DEBUG CODE END ---
 
        return out; // stop search
      } 
      if (open.some((node) => node.x === successor.pos.x && node.y === successor.pos.y && node.f < successor.f)) continue; // skip successor
      if (closed.some((node) => node.x === successor.pos.x && node.y === successor.pos.y && node.f < successor.f)) continue; // skip successor
      open.push(successor);
    }

    closed.push(q);
  }
}

// TODO: comment for prod deployment; for testing only
// module.exports = {
//   aStar
// }