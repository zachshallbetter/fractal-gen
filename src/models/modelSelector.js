/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (fractionalSineGordon and others)
 * - Providing a unified interface for generating fractal data
 * - Validating model and method selection
 * - Delegating execution to specific solvers
 * - Implementing robust error handling and logging
 * 
 * The implementation acts as a central hub for model selection and execution,
 * allowing for easy integration of new models and maintaining a consistent API for fractal data generation.
 * 
 * @example
 * const data = await generateFractalData({
 *   model: 'fractionalSineGordon',
 *   method: 'LADM',
 *   alpha: 0.5,
 *   beta: 0.5,
 *   initialCondition: (t) => Math.sin(t),
 *   timeSteps: 100,
 *   timeEnd: 10,
 * });
 * @input {{model: string, method: string, alpha: number, beta: number, initialCondition: (t: number) => number, timeSteps: number, timeEnd: number}}
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 * 
 * @example
 * const data = await generateFractalData({
 *   model: 'advectionDiffusionReaction',
 *   method: 'MHPM',
 *   alpha: 0.5,
 *   beta: 0.5,
 *   gamma: 0.5,
 *   polynomialDegree: 5,
 *   timeEnd: 10,
 *   spaceEnd: 1,
 * });
 * 
 * @input {{model: string, method: string, alpha: number, beta: number, gamma: number, polynomialDegree: number, timeEnd: number, spaceEnd: number}}
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 * 
 * @since 1.0.11
 */

import { selectSolver } from '../solvers/solverSelector.js';
import { mandelbrot } from './mandelbrotModel.js';

/**
 * Map of models to their available solvers.
 * @type {Object.<string, Object.<string, Function>>}
 * @since 1.0.12
 */
const modelSolvers = {
  mandelbrot: {
    default: mandelbrot,
  },
  // Add other models and solvers as needed
};

/**
 * Generates fractal data using the selected model and method.
 * @async
 * @param {Object} params - The parameters for fractal generation.
 * @param {string} params.model - The fractal model to use.
 * @param {string} [params.method] - The numerical method to apply.
 * @param {number} [params.alpha] - Fractional order (typically time-related).
 * @param {number} [params.beta] - Fractional order (typically space-related).
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 * @throws {Error} If the model or method is not recognized, or if parameter validation fails.
 */
export async function generateFractalData(params) {
  const { model, method = 'default' } = params;

  if (!modelSolvers[model]) {
    throw new Error(`Model "${model}" is not supported.`);
  }

  const solver = modelSolvers[model][method];

  if (!solver) {
    throw new Error(`Method "${method}" is not available for model "${model}".`);
  }

  return solver(params);
}

/**
 * Returns an array of available model names.
 * @returns {string[]} Array of model names.
 */
export function getAvailableModels() {
  return Object.keys(modelSolvers);
}

/**
 * Returns an array of available method names for a given model.
 * @param {string} model - The name of the model.
 * @returns {string[]} Array of method names.
 * @throws {Error} If the model is not recognized.
 */
export function getAvailableMethods(model) {
  if (!modelSolvers[model]) {
    throw new Error(`Model "${model}" is not recognized.`);
  }
  return Object.keys(modelSolvers[model]);
}
