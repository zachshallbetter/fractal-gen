/**
 * @module models/fractionalSineGordonModel
 * @description Implements the Fractional Order Sine-Gordon Equation using the Laplace-Adomian Decomposition Method (LADM) or Shehu Transform-Adomian Decomposition Method (STADM).
 * Optimized for non-blocking, asynchronous execution to prevent blocking in edge environments.
 * @since 1.0.3
 */

const { ladmSolver } = require('../solvers/ladmSolver');
const { stadmSolver } = require('../solvers/stadmSolver');

/**
 * Solves the fractional Sine-Gordon equation using the selected method.
 * @param {Object} params - Parameters for the model, including method selection, fractional orders, and initial conditions.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
async function solve(params) {
  let solution;

  if (params.method === 'LADM') {
    solution = await ladmSolver(params);
  } else if (params.method === 'STADM') {
    solution = await stadmSolver(params);
  } else {
    throw new Error('Invalid method selected. Choose either "LADM" or "STADM".');
  }

  // Generate data points for visualization asynchronously
  const data = await generateDataPointsAsync(solution, params);

  return data;
}

/**
 * Generates data points asynchronously to prevent blocking.
 * @param {Function} solution - The solution function u(t).
 * @param {Object} params - Parameters including time steps and end time.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points.
 */
async function generateDataPointsAsync(solution, params) {
  const data = [];
  const { timeSteps, timeEnd } = params;
  const dt = timeEnd / timeSteps;

  for (let i = 0; i <= timeSteps; i++) {
    const t = i * dt;
    // Use Promise.resolve to simulate async operation
    data.push({ x: t, y: await Promise.resolve(solution(t)) });
  }

  return data;
}

module.exports = { solve };
