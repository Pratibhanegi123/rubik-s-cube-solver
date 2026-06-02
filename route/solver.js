// routes/solver.js
const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const solverController = require('../controllers/solverController');

// Validation for solve request
const solveValidation = [
  body('faces').isObject().withMessage('Faces object is required'),
];

// Solve cube
router.post('/solve', solveValidation, solverController.solveCube);

// Get solve history
router.get('/history', solverController.getHistory);

// Get specific solve
router.get('/:id', solverController.getSolveById);

// Delete solve record
router.delete('/:id', solverController.deleteSolve);

module.exports = router;
