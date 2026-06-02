// controllers/cubeController.js
const { validationResult } = require('express-validator');
const CubeValidator = require('../services/cubeValidator');
const { facesToString, colorToFace, faceToColor } = require('../utils/cubeNotation');

exports.validateCube = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        valid: false, 
        errors: errors.array() 
      });
    }

    const { faces } = req.body;
    const validator = new CubeValidator(faces);
    const validation = validator.validate();

    res.json({
      valid: validation.isValid,
      cubeString: validation.isValid ? facesToString(faces) : null,
      errors: validation.errors,
      warnings: validation.warnings
    });
  } catch (error) {
    next(error);
  }
};

exports.convertNotation = async (req, res, next) => {
  try {
    const { faces, format } = req.body;
    
    if (format === 'color') {
      // Convert face notation to color notation
      const colorFaces = {};
      for (const [face, grid] of Object.entries(faces)) {
        colorFaces[face] = grid.map(row => 
          row.map(cell => faceToColor(cell))
        );
      }
      res.json({ faces: colorFaces, format: 'color' });
    } else {
      // Convert color notation to face notation
      const faceFaces = {};
      for (const [face, grid] of Object.entries(faces)) {
        faceFaces[face] = grid.map(row => 
          row.map(cell => colorToFace(cell))
        );
      }
      res.json({ faces: faceFaces, format: 'face' });
    }
  } catch (error) {
    next(error);
  }
};

// Placeholder for OpenCV integration
exports.processOpenCV = async (req, res, next) => {
  try {
    // This will be implemented when OpenCV is integrated
    res.json({
      message: 'OpenCV endpoint ready for integration',
      status: 'pending',
      instructions: 'Send image data to this endpoint for cube detection'
    });
  } catch (error) {
    next(error);
  }
};
