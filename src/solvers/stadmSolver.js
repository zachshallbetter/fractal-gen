/**
 * @module solvers/stadmSolver
 * @description Solves the fractional Sine-Gordon equation using the Shehu Transform-Adomian Decomposition Method (STADM).
 * This module implements an efficient, non-blocking solver that leverages asynchronous operations for optimal performance.
 * 
 * The solver achieves its purpose through:
 * 1. Implementation of the `stadmSolver` function
 * 2. Utilization of Shehu Transform for fractional calculus
 * 3. Application of Adomian Decomposition for nonlinear term handling
 * 4. Integration with shehuTransform and inverseShehuTransform modules for enhanced functionality
 * 
 * @since 1.0.6
 * 
 * @example
 * import { stadmSolver } from './solvers/stadmSolver.js';
 * import logger from '../utils/logger.js';
 * 
 * const params = {
 *   initialCondition: 0,
 *   alpha: 0.5,
 *   maxTerms: 10
 * };
 * 
 * try {
 *   const solution = await stadmSolver(params);
 *   const result = await solution(1); // Evaluate solution at t = 1
 *   logger.info('STADM solution computed successfully', { result });
 * } catch (error) {
 *   logger.error('Error in STADM solver:', error);
 * }
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S2226719X19300202|Shehu Transform}
 * for more information on the Shehu Transform.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0096300306015098|Adomian Decomposition Method}
 * for details on the Adomian Decomposition Method.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S1110016821000016|STADM}
 * for an overview of the Shehu Transform Adomian Decomposition Method (STADM).
 */

import { shehuTransform, inverseShehuTransform } from './shehuTransform.js';
import { generateAdomianPolynomials } from './adomianDecomposition.js';
import { validateFunction, validateNumber, validatePositiveInteger } from '../utils/validation.js';
import { exp, sin, cos, sqrt, PI } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';
import { generateSobolSequence } from '../utils/sobolSequence.js';

/**
 * Solves the fractional Sine-Gordon equation using STADM.
 * @async
 * @param {Object} params - Parameters for the solver.
 * @param {number} params.initialCondition - Initial condition u(0).
 * @param {number} params.alpha - Fractional order of the derivative.
 * @param {number} params.maxTerms - Maximum number of terms in the series solution.
 * @returns {Promise<Function>} - A promise that resolves to the solution function u(t).
 * @throws {Error} If input validation fails or computation encounters an error.
 */
export async function stadmSolver(params) {
  try {
    const { initialCondition, alpha, maxTerms } = params;

    validateNumber(initialCondition, 'Initial condition');
    validateNumber(alpha, 'Fractional order', 0, 1);
    validatePositiveInteger(maxTerms, 'Maximum terms');

    logger.info('Starting STADM solver with parameters:', params);

    const uSeries = [];

    // Initial approximation u0(t)
    uSeries[0] = (t) => initialCondition;

    // Generate series terms asynchronously
    for (let n = 1; n < maxTerms; n++) {
      // Compute Adomian polynomial An
      const A_n = await generateAdomianPolynomials(uSeries, n - 1);

      // Apply Shehu Transform with variance reduction
      const U_n_s = await shehuTransform(A_n);

      // Solve algebraic equation in Shehu domain
      const U_n_s_solved = (s) => {
        const denominator = s * s + 1;
        return U_n_s(s) / (denominator !== 0 ? denominator : 1e-10); // Avoid division by zero
      };

      // Inverse Shehu Transform with variance reduction
      const u_n = await inverseShehuTransform(U_n_s_solved);

      uSeries[n] = u_n;
    }

    // Sum the series to get the approximate solution
    const solution = async (t) => {
      validateNumber(t, 'Time variable', 0);
      let sum = 0;
      for (let n = 0; n < maxTerms; n++) {
        sum += await uSeries[n](t);
      }
      return sum;
    };

    logger.info('STADM solver completed successfully');
    return solution;
  } catch (error) {
    logger.error('Error in STADM Solver:', error);
    throw new Error(`STADM Solver failed: ${error.message}`);
  }
}

/**
 * Generates Gauss-Legendre quadrature points and weights.
 * @param {number} n - Number of points.
 * @returns {[number[], number[]]} - Array of points and weights.
 */
function gaussLegendre(n) {
  validatePositiveInteger(n, 'Number of quadrature points');
  const points = [];
  const weights = [];
  for (let i = 0; i < n; i++) {
    points.push(cos((2 * i + 1) * PI / (2 * n)));
    weights.push(PI / n);
  }
  return [points, weights];
}

export { stadmSolver };
