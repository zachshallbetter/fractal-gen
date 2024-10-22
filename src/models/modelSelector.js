/**
 * @module models/modelSelector
 * @description Selects and executes the appropriate mathematical model based on user inputs.
 * Supports multiple models, including those utilizing advanced fractional calculus methods.
 * Ensures models are executed in a non-blocking manner suitable for edge environments.
 * @since 1.0.4
 * 
 * This module achieves its intent by:
 * - Supporting multiple models (twoScale, interpersonal, advectionDiffusion, fractionalSineGordon)
 * - Ensuring non-blocking execution suitable for edge environments
 * - Providing a unified interface for generating fractal data
 * 
 * The implementation acts as a central hub for model selection and execution,
 * allowing for easy integration of new models and maintaining a consistent API for fractal data generation.
 */

const modelMap = {
  twoScale: require('./twoScaleModel'),
  interpersonal: require('./interpersonalRelationshipsModel'),
  advectionDiffusion: require('./advectionDiffusionReactionModel'),
  fractionalSineGordon: require('./fractionalSineGordonModel')
};

/**
 * Generates fractal data using the selected model.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the fractal.
 * @throws {Error} If the model is not recognized or if required parameters are missing.
 */
async function generateFractalData(params) {
  const { model } = params;
  if (!modelMap[model]) {
    throw new Error(`Model "${model}" not recognized or not available.`);
  }

  try {
    return await modelMap[model].solve(params);
  } catch (error) {
    console.error(`Error executing model ${model}:`, error);
    throw new Error(`Execution failed for model ${model}: ${error.message}`);
  }
}

module.exports = { generateFractalData };
