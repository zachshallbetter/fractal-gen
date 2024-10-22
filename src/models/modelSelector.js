/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * @since 1.0.8
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (fractionalSineGordon and others)
 * - Providing a unified interface for generating fractal data
 * - Validating model and method selection
 * - Delegating execution to specific solvers
 * 
 * The implementation acts as a central hub for model selection and execution,
 * allowing for easy integration of new models and maintaining a consistent API for fractal data generation.
 */

import { ladmSolver } from '../solvers/ladmSolver.js';
import { stadmSolver } from '../solvers/stadmSolver.js';
// Import other models and solvers

/**
 * Generates fractal data using the selected model and method.
 * @param {Object} params - The parameters for fractal generation.
 * @param {string} params.model - The fractal model to use.
 * @param {string} params.method - The numerical method to apply.
 * @param {number} [params.alpha] - Fractional order (typically time-related).
 * @param {number} [params.beta] - Fractional order (typically space-related).
 * @param {number} [params.gamma] - Additional fractional dimension (model-specific).
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 * @throws {Error} If the model or method is not recognized.
 */
function generateFractalData(params) {
  const { model, method } = params;

  // Map models to their solvers
  const modelSolvers = {
    fractionalSineGordon: {
      LADM: ladmSolver,
      STADM: stadmSolver,
      // Other methods
    },
    // Other models
  };

  if (!modelSolvers[model]) {
    throw new Error(`Model "${model}" is not supported.`);
  }

  if (!modelSolvers[model][method]) {
    throw new Error(`Method "${method}" is not available for model "${model}".`);
  }

  return modelSolvers[model][method](params);
}

/**
 * Returns an array of available model names.
 * @returns {string[]} Array of model names.
 */
function getAvailableModels() {
  return Object.keys(modelSolvers);
}

/**
 * Returns an array of available method names for a given model.
 * @param {string} model - The name of the model.
 * @returns {string[]} Array of method names.
 * @throws {Error} If the model is not recognized.
 */
function getAvailableMethods(model) {
  if (!modelSolvers[model]) {
    throw new Error(`Model "${model}" not recognized or not available.`);
  }
  return Object.keys(modelSolvers[model]);
}

export { generateFractalData, getAvailableModels, getAvailableMethods };
