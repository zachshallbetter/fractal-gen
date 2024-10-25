/**
 * @module FractalGeneratorApp
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @author
 * @since 1.0.5
 */

import { parseInputs } from './utils/inputHandler.js';
import { processFractalRequest } from './services/fractalService.js';
import { outputResults } from './utils/outputHandler.js';
import { reverseEngineer } from './utils/reverseEngineering.js';
import logger from './utils/logger.js';

/**
 * Main function to execute the Fractal Generator application.
 * @async
 * @function
 * @throws {Error} If an unexpected error occurs during execution.
 */
async function main() {
  try {
    logger.info('Starting Fractal Generator application');
    const rawParams = parseInputs();
    logger.debug('Parsed input parameters', { rawParams });

    // Process the fractal request using fractalService
    const result = await processFractalRequest(rawParams);
    if (result.success) {
      logger.info('Fractal generation successful');

      // Output handling is managed within fractalService

      // If reverse engineering is requested
      if (rawParams.reverseEngineer) {
        const inferredParams = await reverseEngineer(result.data);
        logger.info('Reverse engineering complete', { inferredParams });
      }
    } else {
      logger.error('Fractal generation failed', { error: result.message });
    }
  } catch (error) {
    logger.error('An unexpected error occurred', { error });
    throw error; // Re-throw for higher-level error handling
  }
}

// Execute the main function
main().catch(error => {
  logger.fatal('Fatal error in main execution', { error });
  process.exit(1);
});
