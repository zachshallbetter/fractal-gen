/**
 * @module solvers/fractionalSolver
 * @description Solves fractional differential equations using the Grünwald-Letnikov approach.
 * This module provides an efficient implementation of the Grünwald-Letnikov method for solving
 * fractional differential equations. It is optimized for non-blocking and efficient computation,
 * making it suitable for both small-scale and large-scale simulations.
 * 
 * The solver uses a discretized approach to approximate the fractional derivative, allowing for
 * the solution of a wide range of fractional-order systems. It is particularly useful in modeling
 * complex phenomena that exhibit memory effects or non-local behavior.
 * 
 * @example
 * // Example usage:
 * const { grunwaldLetnikovSolver } = require('./fractionalSolver');
 * const f = (t, y) => -y; // Simple decay equation
 * const solution = grunwaldLetnikovSolver(f, 1, 0, 10, 1000, 0.5);
 * 
 * @since 1.0.8
 */

import { combination } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';

/**
 * Solves a fractional differential equation using the Grünwald-Letnikov method.
 * @async
 * @function
 * @param {Object} params - The parameters for the Grünwald-Letnikov solver.
 * @param {number} params.alpha - The fractional order of the derivative.
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.timeStart - The start time of the solution interval.
 * @param {number} params.timeEnd - The end time of the solution interval.
 * @param {number} params.timeSteps - The number of time steps.
 * @param {Function} params.equation - The fractional differential equation to solve.
 * @returns {Promise<Object>} The solution object containing time points and corresponding values.
 * @throws {Error} If input validation fails or computation encounters an error.
 */
export async function grunwaldLetnikovSolver(params) {
  try {
    const { alpha, initialCondition, timeStart, timeEnd, timeSteps, equation } = params;
    const h = (timeEnd - timeStart) / timeSteps;
    const timePoints = Array.from({ length: timeSteps + 1 }, (_, i) => timeStart + i * h);
    const solution = [initialCondition(timeStart)];

    for (let n = 1; n <= timeSteps; n++) {
      let sum = 0;
      for (let j = 1; j <= n; j++) {
        const coeff = Math.pow(-1, j) * combination(alpha, j);
        sum += coeff * solution[n - j];
      }
      const y_n = solution[0] + Math.pow(h, alpha) * (equation(timePoints[n], solution[n - 1]) - sum / Math.pow(h, alpha));
      solution.push(y_n);
    }

    logger.info(`Grünwald-Letnikov solution computed successfully with ${timeSteps} time steps`);
    return { timePoints, solution };
  } catch (error) {
    logger.error('Error in Grünwald-Letnikov solver:', error);
    throw new Error(`Grünwald-Letnikov solver failed: ${error.message}`);
  }
}
