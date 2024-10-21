/**
 * @module models/interpersonalRelationshipsModel
 * @description Solves the fractal–fractional interpersonal relationships model using Lagrangian polynomial interpolation.
 * @since 1.0.1
 */

const { fractalFractionalSolver } = require('../solvers/fractalFractionalSolver');

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
