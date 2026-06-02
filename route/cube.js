// routes/cube.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cubeController = require('../controllers/cubeController');

// Validation rules for cube state
const cubeValidation = [
  body('faces').isObject().withMessage('Faces object is required'),
  body('faces.U').isArray({ min: 3, max: 3 }).withMessage('U face must be 3x3 array'),
  body('faces.R').isArray({ min: 3, max: 3 }).withMessage('R face must be 3x3 array'),
  body('faces.F').isArray({ min: 3, max: 3 }).withMessage('F face must be 3x3 array'),
  body('faces.D').isArray({ min: 3, max: 3 }).withMessage('D face must be 3x3 array'),
  body('faces.L').isArray({ min: 3, max: 3 }).withMessage('L face must be 3x3 array'),
  body('faces.B').isArray({ min: 3, max: 3 }).withMessage('B face must be 3x3 array'),
];

// Validate cube state
router.post('/validate', cubeValidation, cubeController.validateCube);

// Convert between color and face notation
router.post('/convert', cubeController.convertNotation);

// Placeholder for OpenCV integration
router.post('/opencv', cubeController.processOpenCV);

module.exports = router;
