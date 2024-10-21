/**
 * @module models/interpersonalRelationshipsModel
 * @description Solves the fractal–fractional interpersonal relationships model using Lagrangian polynomial interpolation.
 * @since 1.0.1
 * 
 * This model solves the fractal-fractional interpersonal relationships model using Lagrangian polynomial interpolation. It achieves its intent by:
 * - Utilizing a fractal-fractional solver for complex dynamics
 * - Setting up model parameters including fractional orders (alpha, gamma) and kernel function
 * - Returning the solution as data points representing relationship dynamics over time
 * 
 * The implementation leverages fractal-fractional calculus to capture the intricate and potentially chaotic nature
 * of interpersonal relationships, allowing for more nuanced modeling of human interactions.
 */

const { fractalFractionalSolver } = require('../solvers/fractalFractionalSolver');

/**
 * Solves the interpersonal relationships model using Lagrangian polynomial interpolation.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
async function solve(params) {
  // Set up model parameters
  const modelParams = {
    alpha: params.alpha,
    gamma: params.gamma,
    kernel: params.kernel,
    initialCondition: params.initialCondition,
    N: params.timeSteps,
    T: params.timeEnd,
  };

  // Solve using the fractal-fractional solver
  const data = await fractalFractionalSolver(modelParams);

  return data;
}

module.exports = { solve };
