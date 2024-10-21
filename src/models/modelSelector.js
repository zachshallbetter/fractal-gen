/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * @since 1.0.3
 */

const twoScaleModel = require('./twoScaleModel');
const interpersonalModel = require('./interpersonalRelationshipsModel');
const advectionDiffusionModel = require('./advectionDiffusionReactionModel');
const { solve: fractionalSineGordonSolve } = require('./fractionalSineGordonModel');

/**
 * Generates fractal data using the selected model.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 */
async function generateFractalData(params) {
  switch (params.model) {
    case 'twoScale':
      return await twoScaleModel.solve(params);
    case 'interpersonal':
      return await interpersonalModel.solve(params);
    case 'advectionDiffusion':
      return await advectionDiffusionModel.solve(params);
    case 'fractionalSineGordon':
      return await fractionalSineGordonSolve(params);
    default:
      throw new Error(`Model "${params.model}" not recognized.`);
  }
}

module.exports = { generateFractalData };
