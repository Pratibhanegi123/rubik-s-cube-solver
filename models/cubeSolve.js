// models/CubeSolve.js
const mongoose = require('mongoose');

const cubeSolveSchema = new mongoose.Schema({
  // Cube state in standard notation (54 facelets)
  cubeState: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[URFDLB]{54}$/.test(v);
      },
      message: 'Cube state must be 54 characters using U, R, F, D, L, B'
    }
  },
  
  // Individual face states for frontend compatibility
  faces: {
    U: { type: [[String]], required: true }, // Up (White)
    R: { type: [[String]], required: true }, // Right (Red)
    F: { type: [[String]], required: true }, // Front (Green)
    D: { type: [[String]], required: true }, // Down (Yellow)
    L: { type: [[String]], required: true }, // Left (Orange)
    B: { type: [[String]], required: true }  // Back (Blue)
  },
  
  // Solution moves
  solution: {
    type: String,
    default: null
  },
  
  // Solution as array for frontend
  solutionMoves: [{
    type: String
  }],
  
  // Number of moves in solution
  moveCount: {
    type: Number,
    default: 0
  },
  
  // Solving time in milliseconds
  solveTime: {
    type: Number,
    default: 0
  },
  
  // Input method: 'manual' or 'opencv'
  inputMethod: {
    type: String,
    enum: ['manual', 'opencv'],
    default: 'manual'
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'solved', 'invalid', 'error'],
    default: 'pending'
  },
  
  // Error message if any
  errorMessage: {
    type: String,
    default: null
  },
  
  // Client info
  clientIp: String,
  userAgent: String
  
}, {
  timestamps: true
});

// Index for querying recent solves
cubeSolveSchema.index({ createdAt: -1 });
cubeSolveSchema.index({ status: 1 });

module.exports = mongoose.model('CubeSolve', cubeSolveSchema);
