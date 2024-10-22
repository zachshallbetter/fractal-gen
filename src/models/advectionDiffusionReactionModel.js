/**
 * @module models/advectionDiffusionReactionModel
 * @description Implements the fractal–fractional ADR equation using Bernstein polynomials and operational matrices.
 * @since 1.0.2
 * 
 * This model implements the fractal-fractional Advection-Diffusion-Reaction (ADR) equation using Bernstein polynomials and operational matrices. It achieves its intent by:
 * - Using Bernstein polynomials for time and space discretization
 * - Generating operational matrices for fractional derivatives
 * - Employing the MHPM (Modified Homotopy Perturbation Method) solver
 * - Returning a solution as data points
 * 
 * @example
 * import { solve } from './advectionDiffusionReactionModel.js';
 * 
 * const data = await solve({
 *   alpha: 0.5,
 *   beta: 0.5,
 *   gamma: 0.5,
 *   polynomialDegree: 5,
 *   timeEnd: 10,
 *   spaceEnd: 1,
 * });
 * 
 * @param {Object} params - The parameters for the model.
 * @param {number} params.alpha - Fractional order (typically time-related).
 * @param {number} params.beta - Fractional order (typically space-related).
 * @param {number} params.gamma - Additional fractional dimension.
 * @param {number} params.polynomialDegree - Degree of Bernstein polynomials.
 * @param {number} params.timeEnd - End time for the simulation.
 * @param {number} params.spaceEnd - End point in space for the simulation.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */

import { bernsteinPolynomials } from '../solvers/bernsteinPolynomials.js';
import { generateOperationalMatrices } from '../solvers/operationalMatrices.js';
import { mhpmSolver } from '../solvers/mhpmSolver.js';

/**
 * Solves the ADR equation using Bernstein polynomials and operational matrices.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
export async function solve(params) {
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
  const solution = await mhpmSolver(B_t, B_x, D_t, D_x, params);

  // Generate data points
  const data = solution.map((value, index) => ({
    x: index * (T / params.timeSteps),
    y: value,
  }));

  return data;
}
