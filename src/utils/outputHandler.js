/**
 * @module utils/outputHandler
 * @description Handles the output of results, including saving data files, generating visualizations,
 * and validating results. Integrates with parallel computation for improved performance.
 * 
 * - Manages data output, including JSON files and visualizations
 * - Supports parallel computation for efficient result processing
 * - Integrates with validation and visualization modules for comprehensive output handling
 * - Provides extensible architecture for future enhancements and integrations
 * 
 * @example
 * import { outputResults } from './outputHandler.js';
 * await outputResults(data, params, analyticalSolution);
 * 
 * @since 1.0.10
 */

import fs from 'fs/promises';
import path from 'path';
import { createInteractivePlot } from '../visualizations/plotGenerator.js';
import { createFractalImage } from '../visualizations/imageGenerator.js';
import { validateResults } from './validators.js';
import { ParallelComputation } from './parallelComputation.js';
import logger from './logger.js';

/**
 * Outputs and validates the results of fractal generation.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The generated fractal data.
 * @param {Object} params - Parameters used in fractal generation.
 * @param {Function} [analyticalSolution] - The analytical solution function, if available.
 * @throws {Error} If file operations or visualization generation fails.
 * @returns {Promise<void>}
 */
export async function outputResults(data, params, analyticalSolution) {
  const parallelComputation = new ParallelComputation();

  try {
    logger.info('Starting output process', { params });

    // Ensure directories exist
    await Promise.all([
      fs.mkdir('data', { recursive: true }),
      fs.mkdir('plots', { recursive: true }),
      fs.mkdir('images', { recursive: true })
    ]);

    // Save data to file
    const dataFilePath = path.join('data', `fractalData_${params.model}_${Date.now()}.json`);
    await fs.writeFile(dataFilePath, JSON.stringify({ data, params }, null, 2));
    logger.info(`Data saved to file: ${dataFilePath}`);

    // Generate visualizations in parallel
    const visualizationTasks = [
      () => createInteractivePlot(data, params),
      () => createFractalImage(data, params)
    ];
    await parallelComputation.executeTasks(visualizationTasks);
    logger.info('Visualizations generated successfully');

    // Validate results if analytical solution is provided
    if (typeof analyticalSolution === 'function') {
      const maxError = validateResults(data, analyticalSolution, params);
      logger.info(`Validation complete. Maximum error: ${maxError}`, { maxError });
      await fs.appendFile(dataFilePath, `\nMaximum error: ${maxError}`);
    }

    logger.info('Results saved and visualizations generated successfully.');
  } catch (error) {
    logger.error('Error in outputResults', error, { params });
    throw error;
  }
}
