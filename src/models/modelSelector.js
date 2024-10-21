/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * @since 1.0.4
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (twoScale, interpersonal, advectionDiffusion, fractionalSineGordon)
 * - Ensuring non-blocking execution suitable for edge environments
 * - Providing a unified interface for generating fractal data
 * 
 * The implementation acts as a central hub for model selection and execution,
 * allowing for easy integration of new models and maintaining a consistent API for fractal data generation.
 */

const twoScaleModel = require('./twoScaleModel');
const interpersonalModel = require('./interpersonalRelationshipsModel');
const advectionDiffusionModel = require('./advectionDiffusionReactionModel');
const { solve: fractionalSineGordonSolve } = require('./fractionalSineGordonModel');
const { rungeKuttaSolver } = require('../solvers/rungeKuttaSolver');
const { grunwaldLetnikovSolver } = require('../solvers/fractionalSolver');

/**
 * Generates fractal data using the selected model.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 * @throws {Error} If the model is not recognized or if required parameters are missing.
 */
async function generateFractalData(params) {
  if (!params.model) {
    throw new Error('Model parameter is required.');
  }

  try {
    switch (params.model) {
      case 'twoScale':
        return await twoScaleModel.solve(params);
      case 'interpersonal':
        return await interpersonalModel.solve(params);
      case 'advectionDiffusion':
        return await advectionDiffusionModel.solve(params);
      case 'fractionalSineGordon':
        return await fractionalSineGordonSolve(params);
      // Add other models and solvers as needed
      default:
        throw new Error(`Model "${params.model}" not recognized.`);
    }
  } catch (error) {
    console.error(`Error in generateFractalData: ${error.message}`);
    throw error;
  }
}

module.exports = { generateFractalData };
