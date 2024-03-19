class Node {
  x
  y
  f // sum of _g and _h
  g // movement cost to move from the starting point to a point on the grid
  h // estimated movement cost of moving from a point on the grid to the end point (heuristic)

  constructor(point, start, end) {

  }
}

function aStar() {
  const open = []
  const closed = []

  open.push(new Node({}, {}, {})) // should be starting node

  while (open.length) {
    open.sort((a, b) => a.f < b.f) // sort descending by node.f 
    const q = open.pop()

  }
}