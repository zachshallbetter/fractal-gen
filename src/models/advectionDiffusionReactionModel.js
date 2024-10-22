/**
 * @module models/advectionDiffusionReactionModel
 * @description Implements the fractal–fractional ADR equation using Bernstein polynomials and operational matrices.
 * @since 1.0.1
 * 
 * This model implements the fractal-fractional Advection-Diffusion-Reaction (ADR) equation using Bernstein polynomials and operational matrices. It appears to achieve its intent by:
 * - Using Bernstein polynomials for time and space discretization
 * - Generating operational matrices for fractional derivatives
 * - Employing the MHPM (Modified Homotopy Perturbation Method) solver
 * - Returning a solution as data points
 * 
 * @example
 * const data = await solve({
 *   alpha: 0.5,
 *   beta: 0.5,
 *   gamma: 0.5,
 *   polynomialDegree: 5,
 *   timeEnd: 10,
 *   spaceEnd: 1,
 * });
 * 
 * @input {{alpha: number, beta: number, gamma: number, polynomialDegree: number, timeEnd: number, spaceEnd: number}}
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */

const { bernsteinPolynomials } = require('../solvers/bernsteinPolynomials');
const { generateOperationalMatrices } = require('../solvers/operationalMatrices');
const { mhpmSolver } = require('../solvers/mhpmSolver');


/**
 * Solves the ADR equation using Bernstein polynomials and operational matrices.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
async function solve(params) {
  // Problem-specific parameters
  const n = params.polynomialDegree || 5;
  const T = params.timeEnd;
  const X = params.spaceEnd || 1;

  // Generate Bernstein polynomials and operational matrices
  const B_t = bernsteinPolynomials(n, T);
  const B_x = bernsteinPolynomials(n, X);
  const D_t = generateOperationalMatrices('time', params.alpha, params.gamma, n);
  const D_x = generateOperationalMatrices('space', params.beta || params.alpha, params.gamma, n);

  // Set up and solve the system using MHPM
  const solution = mhpmSolver(B_t, B_x, D_t, D_x, params);

  // Generate data points
  const data = solution.map((value, index) => ({
    x: index * (T / params.timeSteps),
    y: value,
  }));

  return data;
}

module.exports = { solve };
