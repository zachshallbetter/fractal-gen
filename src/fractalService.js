/**
 * Fractal Generator Service
 * Provides functionality to generate fractal data based on input parameters.
 *
 * @module FractalGeneratorService
 * @since 1.0.1
 */

const { solveFractionalSineGordon } = require('./models/fractionalSineGordonModel');

/**
 * Generates fractal data based on the provided parameters.
 * @param {Object} params - Fractal generation parameters
 * @returns {Promise} - Resolves with fractal data
 */
function generateFractalData(params) {
  return new Promise((resolve, reject) => {
    let modelResult;

    switch (params.model) {
      case 'fractionalSineGordon':
        modelResult = solveFractionalSineGordon(params);
        break;
      // ... existing code ...
      default:
        return reject(new Error('Invalid model specified'));
    }

    // Process the result to prepare data for visualization
    const fractalData = processModelResult(modelResult);

    resolve(fractalData);
  });
}

/**
 * Processes model result into fractal data suitable for visualization.
 * @param {Array} modelResult - Result from the model solver
 * @returns {Object} - Fractal data for visualization
 */
function processModelResult(modelResult) {
  const data = {
    points: []
  };

  // Example processing (placeholder logic)
  modelResult.forEach(point => {
    data.points.push({
      x: point.x,
      y: point.y,
      color: {
        r: 255 * Math.abs(Math.sin(point.value)),
        g: 255 * Math.abs(Math.cos(point.value)),
        b: 255 * Math.abs(Math.sin(point.value)),
        a: 1
      }
    });
  });

  return data;
}

module.exports = {
  generateFractalData
};
