/**
 * @module solvers/ladmSolver
 * @description Solves the fractional Sine-Gordon equation using the Local Adomian Decomposition Method (LADM).
 * This module achieves its intent by:
 * - Implementing asynchronous operations to prevent blocking
 * - Utilizing the Adomian Decomposition Method for solving nonlinear fractional differential equations
 * - Employing a local approach to improve convergence and efficiency
 * - Integrating with mathUtils and validation modules for enhanced functionality
 * 
 * The fractional Sine-Gordon equation is defined as:
 * 
 * D^α_t u(x,t) + sin(u(x,t)) = 0, 0 < α ≤ 2
 * 
 * Where D^α_t represents the fractional derivative of order α with respect to t,
 * and u(x,t) is the solution we're seeking.
 * 
 * @since 1.0.7
 * 
 * @example
 * // Example usage of ladmSolver:
 * import { ladmSolver } from './solvers/ladmSolver.js';
 * import logger from '../utils/logger.js';
 * 
 * const params = {
 *   initialCondition: 0,
 *   timeEnd: 1,
 *   timeSteps: 100,
 *   alpha: 1.5 // Fractional order
 * };
 * 
 * try {
 *   const solution = await ladmSolver(params);
 *   const t = 0.5;
 *   const result = await solution(t);
 *   logger.info('LADM solution computed successfully', { result });
 * } catch (error) {
 *   logger.error('Error in LADM solver:', error);
 * }
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0377042721004131|Local Adomian Decomposition Method}
 * for more information on the LADM and its applications to fractional differential equations.
 */

import { create, all } from 'mathjs';
import { validateObject, validateNumber, validatePositiveInteger } from '../utils/validation.js';
import { generateAdomianPolynomials } from './adomianDecomposition.js';
import logger from '../utils/logger.js';

const math = create(all);

/**
 * Solves the fractional Sine-Gordon equation numerically using LADM.
 * @async
 * @param {Object} params - Parameters for the solver.
 * @param {number} params.initialCondition - Initial condition u(x,0).
 * @param {number} params.timeEnd - End time for the solution.
 * @param {number} params.timeSteps - Number of time steps.
 * @param {number} params.alpha - Fractional order of the equation (0 < α ≤ 2).
 * @returns {Promise<Function>} - A promise that resolves to the solution function u(t).
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function ladmSolver(params) {
  validateObject(params, 'Solver parameters');
  const { initialCondition, timeEnd, timeSteps, alpha } = params;
  validateNumber(initialCondition, 'Initial condition');
  validateNumber(timeEnd, 'End time');
  validatePositiveInteger(timeSteps, 'Number of time steps');
  validateNumber(alpha, 'Fractional order');

  if (alpha <= 0 || alpha > 2) {
    throw new Error('Fractional order must be in the range 0 < α ≤ 2');
  }

  const dt = timeEnd / timeSteps;
  const uValues = [initialCondition];
  const tValues = [0];

  try {
    for (let i = 1; i <= timeSteps; i++) {
      const t = i * dt;
      const uPrev = uValues[i - 1];
      
      // Compute Adomian polynomials
      const A = await generateAdomianPolynomials([uPrev], 1);
      
      // LADM iteration
      const du = math.multiply(
        math.pow(dt, alpha),
        math.divide(A[0](t), math.gamma(alpha + 1))
      );
      const uNext = math.add(uPrev, du);
      
      uValues.push(uNext);
      tValues.push(t);
    }

    logger.info('LADM solution computed successfully');

    // Return the solution as a function interpolated over the computed values
    return (t) => {
      if (t <= timeEnd) {
        const index = Math.floor((t / timeEnd) * timeSteps);
        return uValues[index];
      } else {
        return uValues[uValues.length - 1];
      }
    };
  } catch (error) {
    logger.error('Error in LADM computation:', error);
    throw new Error(`LADM computation failed: ${error.message}`);
  }
}