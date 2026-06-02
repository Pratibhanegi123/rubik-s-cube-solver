// controllers/solverController.js
const { validationResult } = require('express-validator');
const CubeSolve = require('../models/CubeSolve');
const CubeValidator = require('../services/cubeValidator');
const KociembaSolver = require('../services/kociemba');
const { facesToString } = require('../utils/cubeNotation');
const logger = require('../utils/logger');

exports.solveCube = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        errors: errors.array() 
      });
    }

    const { faces, inputMethod = 'manual' } = req.body;
    
    // Validate cube state
    const validator = new CubeValidator(faces);
    const validation = validator.validate();
    
    if (!validation.isValid) {
      const solve = await CubeSolve.create({
        cubeState: 'INVALID',
        faces,
        status: 'invalid',
        inputMethod,
        errorMessage: validation.errors.join('; '),
        clientIp: req.ip,
        userAgent: req.get('user-agent')
      });
      
      return res.status(400).json({
        success: false,
        id: solve._id,
        errors: validation.errors
      });
    }

    const cubeString = facesToString(faces);
    const startTime = Date.now();
    
    // Solve using Kociemba algorithm
    const solver = new KociembaSolver();
    const result = await solver.solve(cubeString);
    
    const solveTime = Date.now() - startTime;
    
    if (!result.success) {
      const solve = await CubeSolve.create({
        cubeState: cubeString,
        faces,
        status: 'error',
        inputMethod,
        errorMessage: result.error,
        solveTime,
        clientIp: req.ip,
        userAgent: req.get('user-agent')
      });
      
      return res.status(400).json({
        success: false,
        id: solve._id,
        error: result.error
      });
    }

    // Save successful solve
    const solve = await CubeSolve.create({
      cubeState: cubeString,
      faces,
      solution: result.solution,
      solutionMoves: result.moves,
      moveCount: result.moves.length,
      solveTime,
      inputMethod,
      status: 'solved',
      clientIp: req.ip,
      userAgent: req.get('user-agent')
    });

    logger.info(`Cube solved in ${solveTime}ms with ${result.moves.length} moves`);

    res.json({
      success: true,
      id: solve._id,
      solution: result.solution,
      moves: result.moves,
      moveCount: result.moves.length,
      solveTime
    });
    
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const query = {};
    if (status) query.status = status;
    
    const solves = await CubeSolve.find(query)
      .select('-faces -clientIp -userAgent')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await CubeSolve.countDocuments(query);
    
    res.json({
      solves,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getSolveById = async (req, res, next) => {
  try {
    const solve = await CubeSolve.findById(req.params.id)
      .select('-clientIp -userAgent');
    
    if (!solve) {
      return res.status(404).json({ error: 'Solve not found' });
    }
    
    res.json(solve);
  } catch (error) {
    next(error);
  }
};

exports.deleteSolve = async (req, res, next) => {
  try {
    const solve = await CubeSolve.findByIdAndDelete(req.params.id);
    
    if (!solve) {
      return res.status(404).json({ error: 'Solve not found' });
    }
    
    res.json({ message: 'Solve deleted successfully' });
  } catch (error) {
    next(error);
  }
};
