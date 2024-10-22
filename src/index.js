/**
 * @module FractalGeneratorApplication
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @since 1.0.8
 */

import { parseInputs, processInputs } from './utils/inputHandler.js';
import { startServer } from './server.js';
import { outputResults } from './utils/outputHandler.js';
import logger from './utils/logger.js';
import { validateParameters } from './utils/validation.js';

/**
 * Main function to execute the Fractal Generator application.
 * @async
 * @function
 * @throws {Error} If an error occurs during execution.
 */
async function main() {
  try {
    logger.info('Starting Fractal Generator application');

    // Parse user inputs
    const params = parseInputs();

    // Validate parameters
    validateParameters(params);

    // Process inputs and generate fractal data
    const fractalData = await processInputs(params);

    // Output results
    await outputResults(fractalData, params);

    // Start the server if requested
    if (params.startServer) {
      await startServer();
      logger.info('Server started successfully');
    }

    logger.info('Fractal Generator application completed successfully');
  } catch (error) {
    logger.error('An error occurred in the main function:', error);
    process.exit(1);
  }
}

// Execute the main function
main().catch(error => {
  logger.error('Unhandled error in main:', error);
  process.exit(1);
});
