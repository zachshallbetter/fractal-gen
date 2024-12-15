/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (fractionalSineGordon, advectionDiffusionReaction, mandelbrot, twoScale, interpersonalRelationships)
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
import { modelMethods as advectionDiffusionReactionModelMethods } from './advectionDiffusionReactionModel.js';
import { modelMethods as fractionalSineGordonModelMethods } from './fractionalSineGordonModel.js';
import { modelMethods as twoScaleModelMethods } from './twoScaleModel.js';
import { modelMethods as interpersonalModelMethods } from './interpersonalRelationshipsModel.js';
import { modelMethods as fractionalHeatEquationModelMethods } from './fractionalHeatEquationModel.js';
import { modelMethods as fractionalSchrodingerModelMethods } from './fractionalSchrodingerModel.js';

const modelMap = {
  'twoScale': twoScaleModelMethods,
  'interpersonal': interpersonalModelMethods,
  'advectionDiffusion': advectionDiffusionReactionModelMethods,
  'fractionalSineGordon': fractionalSineGordonModelMethods,
  'fractionalHeat': fractionalHeatEquationModelMethods,
  'fractionalSchrodinger': fractionalSchrodingerModelMethods,
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

  const solver = await selectSolver(model, method);

  if (!solver) {
    throw new Error(`Method "${method}" is not available for model "${model}".`);
  }

  return solver(params);
}

/**
 * Retrieves available fractal models.
 * @function
 * @returns {Array<string>} An array of available model names.
 */
export function getAvailableModels() {
  return Object.keys(modelMap);
}

/**
 * Retrieves available methods for a given model.
 * @function
 * @param {string} model - The name of the model.
 * @returns {Array<string>} An array of available method names.
 * @throws {Error} If the model is not found or its methods are not a function.
 */
export function getAvailableMethods(model) {
  const methodsModule = modelMap[model];
  if (!methodsModule || !methodsModule.getAvailableMethods) {
    throw new Error(`No methods available for model "${model}".`);
  }
  return methodsModule.getAvailableMethods();
}

