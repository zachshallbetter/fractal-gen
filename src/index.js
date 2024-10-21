/**
 * @fileoverview Main entry point for the Fractal Generator application.
 * @description Orchestrates input parsing, fractal data generation, output handling, and reverse engineering.
 * Utilizes advanced mathematical models and methods to generate fractals and analyze them.
 * Optimized for non-blocking, performant execution suitable for edge computing environments.
 * @author
 * @since 1.0.3
 */

const { parseInputs } = require('./utils/inputHandler');
const { generateFractalData } = require('./models/modelSelector');
const { outputResults } = require('./utils/outputHandler');
const { reverseEngineer } = require('./utils/reverseEngineering');

(async function main() {
  try {
    // Parse user inputs
    const params = parseInputs();

    // Generate fractal data based on selected model and method
    const data = await generateFractalData(params);

    // Output results (data files, plots, images)
    await outputResults(data, params);

    // Reverse engineering (if enabled)
    if (params.reverseEngineer) {
      const inferredParams = await reverseEngineer(data, params);
      console.log('Inferred Parameters:', inferredParams);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  }
})();
