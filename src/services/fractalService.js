/**
 * @module services/fractalService
 * @description Provides services for processing fractal-related requests and computations.
 * @since 1.1.4
 */

import { stadmSolver } from '../solvers/stadmSolver.js';
import logger from '../utils/logger.js';

/**
 * Processes a fractal request using the STADM solver.
 * @async
 * @function
 * @param {Object} request - The fractal request object.
 * @returns {Promise<Object>} The processed fractal data.
 * @throws {Error} If processing fails.
 */
export async function processFractalRequest(request) {
  try {
    logger.info('Processing fractal request', { request });
    const solution = await stadmSolver(request);
    logger.info('Fractal request processed successfully');
    return { success: true, data: solution };
  } catch (error) {
    logger.error('Error processing fractal request:', error);
    throw new Error(`Fractal processing failed: ${error.message}`);
  }
}

/**
 * Retrieves available fractal models and their corresponding methods.
 * @function
 * @returns {Object} An object mapping model names to arrays of available methods.
 */
export function getAvailableFractalModels() {
  const models = getAvailableModels();
  return models.reduce((acc, model) => {
    acc[model] = getAvailableMethods(model);
    return acc;
  }, {});
}
