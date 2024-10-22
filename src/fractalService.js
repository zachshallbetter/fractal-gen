/**
 * @module FractalGeneratorService
 * @description Provides functionality to generate fractal data based on input parameters.
 * Acts as a service layer between the web server/CLI and the model selector.
 * Ensures consistent fractal generation across different application entry points.
 * @since 1.0.3
 */

import { generateFractalData, getAvailableModels, getAvailableMethods } from './models/modelSelector.js';
import { validateParameters } from './utils/validation.js';

/**
 * Processes fractal request and generates fractal data.
 * @param {Object} params - Fractal generation parameters
 * @returns {Promise<Object>} - Resolves with fractal data or rejects with error
 */
async function processFractalRequest(params) {
  try {
    validateParameters(params);
    const data = await generateFractalData(params);
    console.log('Fractal generation successful.');
    return {
      success: true,
      data: data,
      message: 'Fractal data generated successfully'
    };
  } catch (error) {
    console.error('Failed to generate fractal data:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
      message: 'Failed to generate fractal data'
    };
  }
}

/**
 * Retrieves the list of available fractal models.
 * @returns {string[]} - Array of available model names
 */
function getModels() {
  return getAvailableModels();
}

/**
 * Retrieves the list of available methods for a given model.
 * @param {string} model - The name of the model
 * @returns {string[]} - Array of available method names for the specified model
 * @throws {Error} If the model is not recognized
 */
function getMethods(model) {
  return getAvailableMethods(model);
}

export { processFractalRequest, getModels, getMethods };
