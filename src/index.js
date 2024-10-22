/**
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @author
 * @since 1.0.3
 */

import { parseInputs } from './utils/inputHandler.js';
import { processFractalRequest } from './services/fractalService.js';
import { outputResults } from './utils/outputHandler.js';
import { reverseEngineer } from './utils/reverseEngineering.js';

(async function main() {
  try {
    const params = parseInputs();
    const result = await processFractalRequest(params);
    if (result.success) {
      await outputResults(result.data, params);
      if (params.reverseEngineer) {
        const inferredParams = await reverseEngineer(result.data);
        console.log('Inferred Parameters:', inferredParams);
      }
    } else {
      console.error('Error:', result.message);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
