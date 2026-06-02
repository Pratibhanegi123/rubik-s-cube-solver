// utils/cubeNotation.js
/**
 * Color to Face mapping (Singmaster notation)
 * Standard orientation: White on top, Green in front
 */
const COLOR_TO_FACE = {
  'white': 'U', 'W': 'U', 'w': 'U',
  'yellow': 'D', 'Y': 'D', 'y': 'D',
  'green': 'F', 'G': 'F', 'g': 'F',
  'blue': 'B', 'B': 'B', 'b': 'B',
  'red': 'R', 'R': 'R', 'r': 'R',
  'orange': 'L', 'O': 'L', 'o': 'L'
};

const FACE_TO_COLOR = {
  'U': 'white',
  'D': 'yellow',
  'F': 'green',
  'B': 'blue',
  'R': 'red',
  'L': 'orange'
};

/**
 * Convert faces object to 54-character cube string
 * Order: U (9) + R (9) + F (9) + D (9) + L (9) + B (9)
 */
function facesToString(faces) {
  const order = ['U', 'R', 'F', 'D', 'L', 'B'];
  let result = '';
  
  for (const face of order) {
    for (const row of faces[face]) {
      for (const cell of row) {
        // Convert color to face notation if needed
        const normalized = colorToFace(cell);
        result += normalized;
      }
    }
  }
  
  return result;
}

/**
 * Convert 54-character cube string to faces object
 */
function stringToFaces(cubeString) {
  const faces = {
    U: [], R: [], F: [], D: [], L: [], B: []
  };
  
  const order = ['U', 'R', 'F', 'D', 'L', 'B'];
  let index = 0;
  
  for (const face of order) {
    for (let row = 0; row < 3; row++) {
      faces[face][row] = [];
      for (let col = 0; col < 3; col++) {
        faces[face][row][col] = cubeString[index++];
      }
    }
  }
  
  return faces;
}

/**
 * Convert color name to face notation
 */
function colorToFace(color) {
  if (['U', 'R', 'F', 'D', 'L', 'B'].includes(color)) {
    return color;
  }
  return COLOR_TO_FACE[color] || COLOR_TO_FACE[color.toLowerCase()] || color;
}

/**
 * Convert face notation to color name
 */
function faceToColor(face) {
  return FACE_TO_COLOR[face] || face;
}

/**
 * Parse solution string into array of moves
 */
function parseSolution(solution) {
  if (!solution || typeof solution !== 'string') {
    return [];
  }
  return solution.trim().split(/\s+/).filter(m => m);
}

/**
 * Convert move to animation-friendly format
 * Returns { face: 'U', direction: 1, double: false }
 */
function parseMove(move) {
  const face = move[0];
  const modifier = move.slice(1);
  
  return {
    face,
    direction: modifier === "'" || modifier === "'" ? -1 : 1,
    double: modifier === '2',
    notation: move
  };
}

module.exports = {
  COLOR_TO_FACE,
  FACE_TO_COLOR,
  facesToString,
  stringToFaces,
  colorToFace,
  faceToColor,
  parseSolution,
  parseMove
};
