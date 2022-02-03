/* eslint-disable no-undef, no-unused-vars */

const gridWidth = 50;
const gridHeight = 50;

Width = 600;
Height = (Width * gridHeight) / gridWidth;

let i = 0;

const stroke_weight = 2;
const gap = 3;
const border = 2;

const lenx = Width / gridWidth;
const leny = Height / gridHeight;

const sqx = Width / (gridWidth * 2 + 1);
const sqy = Height / (gridHeight * 2 + 1);

const directionWeights = [0.7, 1.0, 0.7, 1.0];

var h = [];
var v = [];
const cells = [];
var stack = [];

var arrOutput = [];

var slow = false;

function setup() {
  createCanvas(Width + border * 2, Height + border * 2);

  for (let i = 0; i < gridWidth; i++) {
    h[i] = [];
    for (let j = 0; j < gridHeight + 1; j++) {
      h[i][j] = 1;
    }
  }

  for (let i = 0; i < gridWidth + 1; i++) {
    v[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      v[i][j] = 1;
    }
  }

  for (let i = 0; i < gridWidth; i++) {
    cells[i] = [];
    for (let j = 0; j < gridHeight; j++) {
      cells[i][j] = 1;
    }
  }

  stack.push([0, 0]);

  if (slow) {
    frameRate(4);
  }
}

function evalCell(coords) {
  x = coords[0];
  y = coords[1];
  // console.log(x,y)
  cells[x][y] = 0;

  const next = getNext(x, y);

  if (next == null) {
    stack.pop();
    return;
  }

  nx = next.coords[0];
  ny = next.coords[1];
  // console.log(x, y, next.direction);

  switch (next.direction) {
    case -1:
      stack.pop();
      break;

    case 0:
      h[x][y] = 0; // T
      stack.push(next.coords);
      break;

    case 1:
      h[x][y + 1] = 0; // B
      stack.push(next.coords);
      break;

    case 2:
      v[x][y] = 0; // L
      stack.push(next.coords);
      break;

    case 3:
      v[x + 1][y] = 0; // R
      stack.push(next.coords);
      break;
  }
}

function getNeighbors(x, y) {
  neighbors = [
    y - 1 >= 0 ? [x, y - 1] : -1,
    y + 1 < gridHeight ? [x, y + 1] : -1,
    x - 1 >= 0 ? [x - 1, y] : -1,
    x + 1 < gridWidth ? [x + 1, y] : -1
  ];

  // console.log(x,y)

  for (let j = 0; j < 4; j++) {
    if (Array.isArray(neighbors[j])) {
      // console.log(neighbors[j][0],neighbors[j][1])
      // console.log(cells[2])
      if (cells[neighbors[j][0]][neighbors[j][1]] == 0) {
        neighbors[j] = -1;
      }
    }
  }
  return neighbors;
}

function getNext(x, y) {
  const neighbors = getNeighbors(x, y);

  const weighted = neighbors.map((neighbor, index) =>
    Array.isArray(neighbor) ? Math.random() * directionWeights[index] : 0
  );

  const top = Math.max(...weighted);
  const nextIndex = weighted.indexOf(top);

  pass = 0;
  for (let j = 0; j < 4; j++) {
    if (weighted[j] > 0) {
      pass = 1;
    }
  }

  if (pass) {
    return {
      coords: neighbors[nextIndex],
      direction: nextIndex
    };
  }

  return null;
}

function convertArrays() {
  for (let i = 0; i < 2 * gridWidth + 1; i++) {
    arrOutput[i] = [];
    for (let j = 0; j < 2 * gridHeight + 1; j++) {
      arrOutput[i][j] = 0;
    }
  }

  h.forEach(function (arr, iX) {
    arr.forEach(function (beez, iY) {
      if (beez) {
        arrOutput[2 * iX][2 * iY] = 1;
        arrOutput[2 * iX + 1][2 * iY] = 1;
      }
    });
  });

  v.forEach(function (arr, iX) {
    arr.forEach(function (beez, iY) {
      if (beez) {
        arrOutput[2 * iX][2 * iY] = 1;
        arrOutput[2 * iX][2 * iY + 1] = 1;
      }
    });
  });

  // Add wall to end corner.
  arrOutput[2 * gridWidth][2 * gridHeight] = 1;
}

function draw() {
  background(220);

  strokeWeight(stroke_weight);
  stroke("green");

  if (stack.length) {
    evalCell(stack.slice(-1)[0]);
  } else {
    noLoop();
  }

  convertArrays();

  arrOutput.forEach(function (arr, iX) {
    arr.forEach(function (beez, iY) {
      if (beez) {
        rect(border + sqx * iX, border + sqy * iY, sqx, sqy);
      }
    });
  });

  stroke("red");

  if (stack.length) {
    rect(
      border + sqx * (2 * stack.slice(-1)[0][0] + 1),
      border + sqy * (2 * stack.slice(-1)[0][1] + 1),
      sqx,
      sqy
    );
  }

  //     h.forEach(function (arr, iX) {
  //       arr.forEach(function (beez, iY) {
  //         if (beez) {
  //           for (let j = 0; j < Math.floor(lenx / gap)+1; j++) {
  //             point(border + lenx * iX + j * gap,border + leny * iY);
  //           }
  //         }
  //       });
  //     });

  //     v.forEach(function (arr, iX) {
  //       arr.forEach(function (beez, iY) {
  //         if (beez) {
  //           for (let j = 0; j < Math.floor(leny / gap)+1; j++) {
  //             point(border + lenx * iX ,border + leny * iY+ j * gap);
  //           }
  //         }

  //       });
  //     });
}
