// frontend/src/services/cubeApi.js
const API_BASE = process.env.REACT_APP_API_URL || '[localhost](http://localhost:5000/api)';

/**
 * Validate cube state
 */
export async function validateCube(faces) {
  const response = await fetch(`${API_BASE}/cube/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ faces })
  });
  return response.json();
}

/**
 * Solve cube and get solution moves
 */
export async function solveCube(faces) {
  const response = await fetch(`${API_BASE}/solver/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ faces })
  });
  return response.json();
}

/**
 * Get solve history
 */
export async function getSolveHistory(page = 1, limit = 20) {
  const response = await fetch(
    `${API_BASE}/solver/history?page=${page}&limit=${limit}`
  );
  return response.json();
}

/**
 * Get specific solve by ID
 */
export async function getSolveById(id) {
  const response = await fetch(`${API_BASE}/solver/${id}`);
  return response.json();
}

/**
 * Convert Three.js cube state to API format
 * Adapt this based on your actual Three.js cube representation
 */
export function cubeStateToFaces(cubeState) {
  // Map your Three.js cube state to the faces format
  // This depends on how you're storing cube state in your frontend
  
  // Example structure expected by API:
  // {
  //   U: [['U','U','U'], ['U','U','U'], ['U','U','U']],
  //   R: [['R','R','R'], ['R','R','R'], ['R','R','R']],
  //   F: [['F','F','F'], ['F','F','F'], ['F','F','F']],
  //   D: [['D','D','D'], ['D','D','D'], ['D','D','D']],
  //   L: [['L','L','L'], ['L','L','L'], ['L','L','L']],
  //   B: [['B','B','B'], ['B','B','B'], ['B','B','B']]
  // }
  
  return cubeState;
}

/**
 * Convert API solution moves to Three.js animation format
 */
export function movesToAnimations(moves) {
  return moves.map(move => {
    const face = move[0];
    const modifier = move.slice(1);
    
    return {
      face,
      clockwise: modifier !== "'",
      double: modifier === '2',
      duration: 300 // milliseconds
    };
  });
}
