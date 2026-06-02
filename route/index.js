// routes/index.js
const express = require('express');
const router = express.Router();
const cubeRoutes = require('./cube');
const solverRoutes = require('./solver');

router.use('/cube', cubeRoutes);
router.use('/solver', solverRoutes);

// API info
router.get('/', (req, res) => {
  res.json({
    message: 'Rubik\'s Cube Solver API',
    version: '1.0.0',
    endpoints: {
      'POST /api/cube/validate': 'Validate cube state',
      'POST /api/solver/solve': 'Solve cube using Kociemba algorithm',
      'GET /api/solver/history': 'Get solve history',
      'GET /api/solver/:id': 'Get specific solve result',
      'POST /api/cube/opencv': 'Future: OpenCV integration endpoint'
    }
  });
});

module.exports = router;
