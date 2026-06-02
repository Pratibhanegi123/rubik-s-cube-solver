// services/cubeValidator.js
class CubeValidator {
  constructor(faces) {
    this.faces = faces;
    this.errors = [];
    this.warnings = [];
    
    // Color to face mapping (standard: White=U, Yellow=D, Green=F, Blue=B, Red=R, Orange=L)
    this.colorToFace = {
      'white': 'U', 'W': 'U', 'w': 'U',
      'yellow': 'D', 'Y': 'D', 'y': 'D',
      'green': 'F', 'G': 'F', 'g': 'F',
      'blue': 'B', 'B': 'B', 'b': 'B',
      'red': 'R', 'R': 'R', 'r': 'R',
      'orange': 'L', 'O': 'L', 'o': 'L'
    };
  }

  validate() {
    this.errors = [];
    this.warnings = [];

    // Check structure
    if (!this.validateStructure()) {
      return { isValid: false, errors: this.errors, warnings: this.warnings };
    }

    // Check center pieces
    this.validateCenters();

    // Check color counts
    this.validateColorCounts();

    // Check edge pieces
    this.validateEdges();

    // Check corner pieces
    this.validateCorners();

    // Check solvability
    this.checkSolvability();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateStructure() {
    const requiredFaces = ['U', 'R', 'F', 'D', 'L', 'B'];
    
    for (const face of requiredFaces) {
      if (!this.faces[face]) {
        this.errors.push(`Missing face: ${face}`);
        continue;
      }
      
      if (!Array.isArray(this.faces[face]) || this.faces[face].length !== 3) {
        this.errors.push(`Face ${face} must be a 3x3 array`);
        continue;
      }
      
      for (let i = 0; i < 3; i++) {
        if (!Array.isArray(this.faces[face][i]) || this.faces[face][i].length !== 3) {
          this.errors.push(`Face ${face} row ${i} must have 3 elements`);
        }
      }
    }

    return this.errors.length === 0;
  }

  validateCenters() {
    const centers = {
      U: this.faces.U[1][1],
      R: this.faces.R[1][1],
      F: this.faces.F[1][1],
      D: this.faces.D[1][1],
      L: this.faces.L[1][1],
      B: this.faces.B[1][1]
    };

    const centerValues = Object.values(centers);
    const uniqueCenters = new Set(centerValues);

    if (uniqueCenters.size !== 6) {
      this.errors.push('All center pieces must be different colors');
    }

    // Check if centers match standard orientation (optional warning)
    const expectedCenters = { U: 'U', R: 'R', F: 'F', D: 'D', L: 'L', B: 'B' };
    for (const [face, expected] of Object.entries(expectedCenters)) {
      if (centers[face] !== expected) {
        // This is fine if using color notation
      }
    }
  }

  validateColorCounts() {
    const counts = { U: 0, R: 0, F: 0, D: 0, L: 0, B: 0 };

    for (const face of Object.values(this.faces)) {
      for (const row of face) {
        for (const cell of row) {
          const normalized = this.normalizeColor(cell);
          if (counts[normalized] !== undefined) {
            counts[normalized]++;
          } else {
            this.errors.push(`Invalid color/face value: ${cell}`);
          }
        }
      }
    }

    for (const [face, count] of Object.entries(counts)) {
      if (count !== 9) {
        this.errors.push(`Face ${face} has ${count} facelets, expected 9`);
      }
    }
  }

  normalizeColor(value) {
    // Handle both color names and face notation
    if (['U', 'R', 'F', 'D', 'L', 'B'].includes(value)) {
      return value;
    }
    return this.colorToFace[value] || this.colorToFace[value.toLowerCase()] || value;
  }

  validateEdges() {
    // Define all edge positions
    const edges = [
      // UR edge
      { pos1: ['U', 1, 2], pos2: ['R', 0, 1] },
      // UF edge
      { pos1: ['U', 2, 1], pos2: ['F', 0, 1] },
      // UL edge
      { pos1: ['U', 1, 0], pos2: ['L', 0, 1] },
      // UB edge
      { pos1: ['U', 0, 1], pos2: ['B', 0, 1] },
      // DR edge
      { pos1: ['D', 1, 2], pos2: ['R', 2, 1] },
      // DF edge
      { pos1: ['D', 0, 1], pos2: ['F', 2, 1] },
      // DL edge
      { pos1: ['D', 1, 0], pos2: ['L', 2, 1] },
      // DB edge
      { pos1: ['D', 2, 1], pos2: ['B', 2, 1] },
      // FR edge
      { pos1: ['F', 1, 2], pos2: ['R', 1, 0] },
      // FL edge
      { pos1: ['F', 1, 0], pos2: ['L', 1, 2] },
      // BR edge
      { pos1: ['B', 1, 0], pos2: ['R', 1, 2] },
      // BL edge
      { pos1: ['B', 1, 2], pos2: ['L', 1, 0] }
    ];

    const edgeSet = new Set();
    
    for (const edge of edges) {
      const c1 = this.normalizeColor(this.faces[edge.pos1[0]][edge.pos1[1]][edge.pos1[2]]);
      const c2 = this.normalizeColor(this.faces[edge.pos2[0]][edge.pos2[1]][edge.pos2[2]]);
      
      // Edge cannot have same color on both sides
      if (c1 === c2) {
        this.errors.push(`Invalid edge: same color on both sides (${c1})`);
      }
      
      // Check for opposite colors (impossible edges)
      const opposites = { 'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'B', 'B': 'F' };
      if (opposites[c1] === c2) {
        this.errors.push(`Invalid edge: opposite colors ${c1}-${c2} cannot form an edge`);
      }
      
      // Check for duplicate edges
      const edgeKey = [c1, c2].sort().join('-');
      if (edgeSet.has(edgeKey)) {
        this.errors.push(`Duplicate edge: ${edgeKey}`);
      }
      edgeSet.add(edgeKey);
    }
  }

  validateCorners() {
    // Define all corner positions
    const corners = [
      // URF corner
      { positions: [['U', 2, 2], ['R', 0, 0], ['F', 0, 2]] },
      // UFL corner
      { positions: [['U', 2, 0], ['F', 0, 0], ['L', 0, 2]] },
      // ULB corner
      { positions: [['U', 0, 0], ['L', 0, 0], ['B', 0, 2]] },
      // UBR corner
      { positions: [['U', 0, 2], ['B', 0, 0], ['R', 0, 2]] },
      // DFR corner
      { positions: [['D', 0, 2], ['F', 2, 2], ['R', 2, 0]] },
      // DLF corner
      { positions: [['D', 0, 0], ['L', 2, 2], ['F', 2, 0]] },
      // DBL corner
      { positions: [['D', 2, 0], ['B', 2, 2], ['L', 2, 0]] },
      // DRB corner
      { positions: [['D', 2, 2], ['R', 2, 2], ['B', 2, 0]] }
    ];

    const cornerSet = new Set();

    for (const corner of corners) {
      const colors = corner.positions.map(pos => 
        this.normalizeColor(this.faces[pos[0]][pos[1]][pos[2]])
      );
      
      // Check for duplicate colors in corner
      if (new Set(colors).size !== 3) {
        this.errors.push(`Invalid corner: duplicate color in corner ${colors.join('-')}`);
      }
      
      // Check for opposite colors
      const opposites = { 'U': 'D', 'D': 'U', 'R': 'L', 'L': 'R', 'F': 'B', 'B': 'F' };
      for (let i = 0; i < colors.length; i++) {
        for (let j = i + 1; j < colors.length; j++) {
          if (opposites[colors[i]] === colors[j]) {
            this.errors.push(`Invalid corner: opposite colors cannot be on same corner`);
          }
        }
      }
      
      // Check for duplicate corners
      const cornerKey = [...colors].sort().join('-');
      if (cornerSet.has(cornerKey)) {
        this.errors.push(`Duplicate corner: ${cornerKey}`);
      }
      cornerSet.add(cornerKey);
    }
  }

  checkSolvability() {
    // Additional solvability checks
    // A cube is solvable if:
    // 1. Edge orientation sum is even
    // 2. Corner orientation sum is divisible by 3
    // 3. Parity of edge permutation equals parity of corner permutation
    
    // For now, if all other validations pass, assume it's solvable
    if (this.errors.length > 0) {
      this.warnings.push('Cube may not be solvable due to validation errors');
    }
  }
}

module.exports = CubeValidator;
