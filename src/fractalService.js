/**
 * Fractal Generator Service
 * Provides functionality to generate fractal data based on input parameters.
 *
 * @module FractalGeneratorService
 * @since 1.0.1
 */

const { generateFractalData } = require('./models/modelSelector');

/**
 * Processes fractal request and generates fractal data.
 * @param {Object} params - Fractal generation parameters
 * @returns {Promise} - Resolves with fractal data or rejects with error
 */
async function processFractalRequest(params) {
  try {
    const data = await generateFractalData(params);
    console.log('Fractal generation successful.');
    return data;
  } catch (error) {
    console.error('Failed to generate fractal data:', error);
    throw error;
  }
}

export { processFractalRequest };
