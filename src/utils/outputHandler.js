/**
 * @module utils/outputHandler
 * @description Handles the output of results, including saving data files, generating visualizations,
 * and validating results. Integrates with parallel computation for improved performance.
 * 
 * This module achieves its intent by:
 * - Managing data output, including JSON files and visualizations
 * - Supporting parallel computation for efficient result processing
 * - Integrating with validation and visualization modules for comprehensive output handling
 * - Providing extensible architecture for future enhancements and integrations
 * - Implementing error handling and logging for robust operation
 * - Offering flexible output formats to accommodate various data types and structures
 * 
 * @example
 * import { outputResults } from './outputHandler.js';
 * await outputResults(data, params, analyticalSolution);
 * 
 * @since 1.0.11
 */

import fs from 'fs/promises';
import path from 'path';
import { createInteractivePlot } from '../visualizations/plotGenerator.js';
import { generateFractalImage } from '../visualizations/imageGenerator.js';
import { ParallelComputation } from './parallelComputation.js';
import logger from './logger.js';
import { validateArray, validateObject } from './validation.js';

/**
 * Outputs and validates the results of fractal generation.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The generated fractal data.
 * @param {Object} params - Parameters used in fractal generation.
 * @returns {Promise<void>}
 * @since 1.0.13
 */
export async function outputResults(data, params) {
  try {
    logger.info('Starting output process', { params });

    // Save data to file
    await saveDataToFile(data, params);

    // Generate visualizations
    await generateVisualization(data, params);

    logger.info('Results saved and visualizations generated successfully.');
  } catch (error) {
    logger.error('Error in outputResults', { error });
    throw error;
  }
}

/* ... Other functions ... */
