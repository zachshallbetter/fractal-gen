/**
 * @module FractalGeneratorService
 * @description Provides functionality to generate fractal data based on input parameters.
 * Acts as a service layer between the web server/CLI and the model selector.
 * Ensures consistent fractal generation across different application entry points.
 * Integrates with advanced logging and model selection capabilities.
 * @since 1.0.5
 */

import { generateFractalData, getAvailableModels, getAvailableMethods } from './models/modelSelector.js';
import { validateParameters, validateArray, validateObject, ValidationError } from './utils/validation.js';
import { ParallelComputation } from './utils/parallelComputation.js';
import logger from './utils/logger.js';
import { createFractalImage } from './visualizations/imageGenerator.js';
import { createInteractivePlot as createPlot } from './visualizations/plotGenerator.js';

/**
 * Processes fractal request and generates fractal data.
 * @async
 * @function
 * @param {Object} params - Fractal generation parameters
 * @returns {Promise<Object>} - Resolves with fractal data or rejects with error
 */
async function processFractalRequest(params) {
  try {
    validateParameters(params);
    logger.logInputParams(params);
    const jobId = Date.now().toString();
    logger.logJobStart(jobId);

    const startTime = Date.now();
    const data = await generateFractalData(params);
    const duration = Date.now() - startTime;

    logger.logJobCompletion(jobId, duration);
    logger.logOutputResults(data);

    return {
      success: true,
      data: data,
      message: 'Fractal data generated successfully',
      jobId,
      duration
    };
  } catch (error) {
    logger.error('Failed to generate fractal data:', error, { params });
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
      message: 'Failed to generate fractal data'
    };
  }
}

/**
 * Retrieves the list of available fractal models.
 * @function
 * @returns {string[]} - Array of available model names
 */
function getModels() {
  const models = getAvailableModels();
  logger.info('Retrieved available models', { models });
  return models;
}

/**
 * Retrieves the list of available methods for a given model.
 * @function
 * @param {string} model - The name of the model
 * @returns {string[]} - Array of available method names for the specified model
 * @throws {Error} If the model is not recognized
 */
function getMethods(model) {
  try {
    const methods = getAvailableMethods(model);
    logger.info('Retrieved available methods for model', { model, methods });
    return methods;
  } catch (error) {
    logger.error('Error retrieving available methods', error, { model });
    throw error;
  }
}

export { processFractalRequest, getModels, getMethods, createFractalImage, createPlot };
