/**
 * @module utils/reverseEngineering
 * @description Implements algorithms to infer the parameters from the generated fractal data.
 * This module integrates with the Logger module for improved error handling and logging.
 * 
 * - Implements the optimize function from mathjs to infer the parameters
 * - Uses the Logger module for logging
 * - Provides a function to reverse engineer the parameters from the fractal data
 * 
 * @example
 * import { reverseEngineer } from './reverseEngineering.js';
 * import logger from './logger.js';
 * 
 * const data = [{x: 1, y: 2}, {x: 2, y: 4}, {x: 3, y: 6}];
 * const params = {a: 1, b: 2};
 * 
 * const result = await reverseEngineer(data, params);
 * logger.info('Reverse engineering result:', result);
 * 
 * @since 1.0.2
 */

import { optimize } from 'mathjs';
import logger from './logger.js';

/**
 * Infers the original parameters used to generate the fractal data.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The generated fractal data.
 * @param {Object} params - The parameters used for generating the fractal.
 * @returns {Promise<Object>} - The inferred parameters.
 */
export async function reverseEngineer(data, params) {
  logger.info('Starting reverse engineering process', { dataLength: data.length, params });

  try {
    const result = await optimize(data, params);
    logger.info('Reverse engineering successful', { inferredParams: result.parameters });
    return {
      success: true,
      inferredParams: result.parameters,
      error: null
    };
  } catch (error) {
    logger.error('Error in reverse engineering process', error, { params });
    return {
      success: false,
      inferredParams: {},
      error: error.message
    };
  }
}
