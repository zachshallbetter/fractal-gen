/**
 * @module FractalGeneratorApplication
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @since 1.0.6
 */

import { parseInputs, processInputs } from './utils/inputHandler.js';
import { startServer } from './server.js';

/**
 * Main function to execute the Fractal Generator application.
 * @async
 * @function
 * @throws {Error} If an error occurs during execution.
 */
async function main() {
  try {
    // Start the server asynchronously
    const serverPromise = startServer();

    // Parse user inputs
    const params = parseInputs();

    // Process inputs and generate fractal data
    await processInputs(params);

    // Ensure the server has started
    await serverPromise;

    console.log('Fractal Generator application and server started successfully.');
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Execute the main function
main().catch(error => {
  console.error('Unhandled error in main:', error);
  process.exit(1);
});
