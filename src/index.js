/**
 * @module FractalGeneratorApplication
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @since 1.0.5
 */

import { parseInputs } from './utils/inputHandler.js';
import { processFractalRequest } from './fractalService.js';
import { outputResults } from './utils/outputHandler.js';
import { reverseEngineer } from './utils/reverseEngineering.js';
import { startServer } from './server.js';

/**
 * Main function to execute the Fractal Generator application.
 * @async
 * @function
 * @throws {Error} If an error occurs during execution.
 */
async function main() {
  try {
    // Parse user inputs
    const params = await parseInputs();

    if (params.startServer) {
      // Start the web server if requested
      startServer();
    } else {
      // Generate fractal data using the fractalService
      const result = await processFractalRequest(params);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Output results (data files, plots, images)
      await outputResults(result.data, params);

      // Reverse engineering (if enabled)
      if (params.reverseEngineer) {
        const inferredParams = await reverseEngineer(result.data, params);
        console.log('Inferred Parameters:', inferredParams);
      }
    }
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Execute the main function
main();
