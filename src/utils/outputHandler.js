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
 * const { outputResults } = require('./outputHandler');
 * await outputResults(data, params, analyticalSolution);
 * 
 * @since 1.0.8
 */

import fs from 'fs/promises';
import path from 'path';
import { createInteractivePlot } from '../visualizations/plotGenerator';
import { createFractalImage } from '../visualizations/imageGenerator';
import { validateResults } from './validators';
import { ParallelComputation } from './parallelComputation';

/**
 * Outputs and validates the results of fractal generation.
 * @async
 * @param {Array<{x: number, y: number}>} data - The generated fractal data.
 * @param {Object} params - Parameters used in fractal generation.
 * @param {Function} [analyticalSolution] - The analytical solution function, if available.
 * @throws {Error} If file operations or visualization generation fails.
 */
async function outputResults(data, params, analyticalSolution) {
  const parallelComputation = new ParallelComputation();

  try {
    // Ensure directories exist
    await Promise.all([
      fs.mkdir('data', { recursive: true }),
      fs.mkdir('plots', { recursive: true }),
      fs.mkdir('images', { recursive: true })
    ]);

    // Save data to file
    const dataFilePath = path.join('data', `fractalData_${params.model}_${Date.now()}.json`);
    await fs.writeFile(dataFilePath, JSON.stringify({ data, params }, null, 2));

    // Generate visualizations in parallel
    const visualizationTasks = [
      () => createInteractivePlot(data, params),
      () => createFractalImage(data, params)
    ];
    await parallelComputation.executeTasks(visualizationTasks);

    // Validate results if analytical solution is provided
    if (typeof analyticalSolution === 'function') {
      const maxError = validateResults(data, analyticalSolution, params);
      console.log(`Validation complete. Maximum error: ${maxError}`);
      await fs.appendFile(dataFilePath, `\nMaximum error: ${maxError}`);
    }

    console.log(`Results saved and visualizations generated successfully.`);
  } catch (error) {
    console.error(`Error in outputResults: ${error.message}`);
    throw error;
  }
}

export { outputResults };
