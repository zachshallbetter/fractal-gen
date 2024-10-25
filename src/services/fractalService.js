/**
 * @module services/fractalService
 * @description Provides services for processing fractal-related requests and computations.
 * @since 1.2.4
 */

import { selectSolver } from '../solvers/solverSelector.js';
import { getAvailableModels, getAvailableMethods } from '../models/modelSelector.js';
import { validateFractalParams } from '../utils/inputHandler.js';
import { storeFractalResult, optimizeForEdge } from '../utils/dataUtils.js';
import { outputResults } from '../utils/outputHandler.js';
import logger from '../utils/logger.js';

/**
 * Processes a fractal request by validating parameters, invoking the solver, and handling outputs.
 * @async
 * @param {Object} request - The request object containing parameters.
 * @param {Object} [options={}] - Optional parameters for the request processing.
 * @returns {Promise<Object>} The result of the fractal generation.
 * @since 1.2.4
 */
export async function processFractalRequest(request, options = {}) {
  try {
    logger.info('Processing fractal request', { request });

    // Validate and process input parameters
    const params = validateFractalParams(request);
    logger.debug('Validated fractal parameters', { params });

    // Select the appropriate solver
    const solver = selectSolver(params.model, params.method);
    if (!solver) {
      throw new Error('Invalid model or method selected');
    }

    // Generate fractal data
    const data = await solver(params);
    logger.info('Fractal data generated', { dataLength: data.length });

    // Optimize data for edge runtime
    const optimizedData = optimizeForEdge(data);

    // Store results in the database
    await storeFractalResult(optimizedData, params);

    // Handle outputs (visualizations, files)
    await outputResults(optimizedData, params);

    return { success: true, data: optimizedData };
  } catch (error) {
    logger.error('Error processing fractal request', { error: error.stack || error.message || error });
    return { success: false, message: error.message || 'Unknown error occurred' };
  }
}

/**
 * Retrieves available fractal models and their corresponding methods.
 * @function
 * @returns {Object} An object mapping model names to arrays of available methods.
 * @since 1.2.0
 */
export function getAvailableFractalModels() {
    const models = getAvailableModels();
    return models.reduce((acc, model) => {
        acc[model] = getAvailableMethods(model);
        return acc;
    }, {});
}

/**
 * Performs Laplace transform on a given function.
 * @async
 * @param {Function} f - The function to transform.
 * @returns {Promise<Function>} The Laplace transformed function.
 * @since 1.2.0
 */
export async function performLaplaceTransform(f) {
    return await laplaceTransform(f);
}

/**
 * Performs inverse Laplace transform on a given function.
 * @async
 * @param {Function} F - The Laplace-transformed function to invert.
 * @returns {Promise<Function>} The inverse Laplace transformed function.
 * @since 1.2.0
 */
export async function performInverseLaplaceTransform(F) {
    return await inverseLaplaceTransform(F);
}

export { getAvailableModels, getAvailableMethods };

/**
 * Fetches available fractal models and their methods.
 * @returns {{ models: string[], methods: { [model: string]: string[] } }} An object containing arrays of models and methods.
 */
export function fetchFractalModelsAndMethods() {
  const models = getAvailableModels();
  const methods = {};

  models.forEach(model => {
    try {
      methods[model] = getAvailableMethods(model);
    } catch (error) {
      methods[model] = [];
      logger.warn(`No methods found for model "${model}": ${error.message}`);
    }
  });

  return { models, methods };
}
