/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * @since 1.0.6
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (twoScale, interpersonal, advectionDiffusion, fractionalSineGordon)
 * - Ensuring non-blocking execution suitable for edge environments
 * - Providing a unified interface for generating fractal data
 * - Validating model selection and delegating parameter validation to individual models
 * 
 * The implementation acts as a central hub for model selection and execution,
 * allowing for easy integration of new models and maintaining a consistent API for fractal data generation.
 */

import { validateString, validateNumber } from '../utils/validation.js';

const modelMap = {
  twoScale: require('./twoScaleModel'),
  interpersonal: require('./interpersonalRelationshipsModel'),
  advectionDiffusion: require('./advectionDiffusionReactionModel'),
  fractionalSineGordon: require('./fractionalSineGordonModel')
};

/**
 * Generates fractal data using the selected model.
 * @param {Object} params - The parameters parsed from user inputs.
 * @param {string} params.model - The fractal model to use.
 * @param {string} params.method - The numerical method to apply.
 * @param {number} [params.alpha] - Fractional order (typically time-related).
 * @param {number} [params.beta] - Fractional order (typically space-related).
 * @param {number} [params.gamma] - Additional fractional dimension (model-specific).
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 * @throws {Error} If the model is not recognized, if required parameters are missing, or if method validation fails.
 */
async function generateFractalData(params) {
  const { model, method, alpha, beta, gamma } = params;
  
  validateString(model, 'Model');
  validateString(method, 'Method');

  if (!modelMap[model]) {
    throw new Error(`Model "${model}" not recognized or not available.`);
  }

  if (alpha !== undefined) validateNumber(alpha, 'Alpha', 0, 1);
  if (beta !== undefined) validateNumber(beta, 'Beta', 0, 1);
  if (gamma !== undefined) validateNumber(gamma, 'Gamma', 0, 1);

  try {
    // Delegate method validation and parameter validation to the specific model
    if (!modelMap[model].validateMethod(method)) {
      throw new Error(`Method "${method}" is not available for model "${model}".`);
    }

    modelMap[model].validateParameters(params);

    return await modelMap[model].solve(params);
  } catch (error) {
    console.error(`Error executing model ${model}:`, error);
    throw new Error(`Execution failed for model ${model}: ${error.message}`);
  }
}

/**
 * Returns an array of available model names.
 * @returns {string[]} Array of model names.
 */
function getAvailableModels() {
  return Object.keys(modelMap);
}

/**
 * Returns an array of available method names for a given model.
 * @param {string} model - The name of the model.
 * @returns {string[]} Array of method names.
 * @throws {Error} If the model is not recognized.
 */
function getAvailableMethods(model) {
  if (!modelMap[model]) {
    throw new Error(`Model "${model}" not recognized or not available.`);
  }
  return modelMap[model].getAvailableMethods();
}

export { generateFractalData, getAvailableModels, getAvailableMethods };
