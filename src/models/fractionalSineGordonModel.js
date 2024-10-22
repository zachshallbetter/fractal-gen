/**
 * @module models/fractionalSineGordonModel
 * @description Implements the Fractional Order Sine-Gordon Equation using a simplified numerical method.
 * Optimized for non-blocking execution.
 * @since 1.0.6
 * 
 * This model implements the Fractional Order Sine-Gordon Equation using a simplified numerical method. It achieves its intent by:
 * - Using the LADM (Laplace Adomian Decomposition Method) solver
 * - Generating data points for visualization
 * - Optimizing for non-blocking execution
 * 
 * @example
 * const data = await solve({
 *   method: 'LADM',
 *   alpha: 0.5,
 *   beta: 0.5,
 *   initialCondition: (t) => Math.sin(t),
 *   timeSteps: 100,
 *   timeEnd: 10,
 * });
 * 
 * @input {{method: string, alpha: number, beta: number, initialCondition: (t: number) => number, timeSteps: number, timeEnd: number}}
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */

const { ladmSolver } = require('../solvers/ladmSolver');

/**
 * Solves the fractional Sine-Gordon equation using the selected method.
 * @param {Object} params - Parameters for the model, including method selection, fractional orders, and initial conditions.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
async function solve(params) {
  const solution = await ladmSolver(params);

  // Generate data points for visualization
  const data = [];
  const dt = params.timeEnd / params.timeSteps;
  for (let i = 0; i <= params.timeSteps; i++) {
    const t = i * dt;
    const y = solution(t);
    data.push({ x: t, y: y });
  }

  return data;
}

module.exports = { solve };
