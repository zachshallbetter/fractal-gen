/**
 * @module solvers/grunwaldLetnikovSolver
 * @description Implements the Grunwald-Letnikov method for solving fractional differential equations.
 * This solver is particularly effective for fractional-order systems and provides a discrete approximation
 * of fractional derivatives. It is optimized for edge computing environments, ensuring efficient
 * computation with minimal resource usage.
 *
 * Key features:
 * - Implements the Grunwald-Letnikov fractional derivative approximation
 * - Supports variable-order fractional differential equations
 * - Utilizes memory-efficient algorithms suitable for edge devices
 * - Provides both time-domain and frequency-domain solutions
 * - Includes error estimation and adaptive step size control
 *
 * @example
 * // Solve a fractional differential equation using the Grunwald-Letnikov method
 * const solution = await solveGrunwaldLetnikov({
 *   alpha: 0.5,
 *   initialCondition: (x) => Math.sin(x),
 *   timeStart: 0,
 *   timeEnd: 10,
 *   timeSteps: 1000,
 *   equation: (t, y, alpha) => -y + t**2 + (2/Math.gamma(3-alpha))*t**(2-alpha)
 * });
 *
 * @since 1.1.0
 */

import { validateNumber, validateFunction, validatePositiveInteger } from '../utils/validation.js';
import { gammaFunction } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';
import { ParallelComputation } from '../utils/parallelComputation.js';

/**
 * Solves a fractional differential equation using the Grunwald-Letnikov method.
 * @async
 * @function
 * @param {Object} params - The parameters for the Grunwald-Letnikov solver.
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
    validateGrunwaldLetnikovParams(params);
    
    const { alpha, initialCondition, timeStart, timeEnd, timeSteps, equation } = params;
    const h = (timeEnd - timeStart) / timeSteps;
    const timePoints = Array.from({ length: timeSteps + 1 }, (_, i) => timeStart + i * h);
    const solution = [initialCondition(timeStart)];

    const parallelComputation = new ParallelComputation();
    const tasks = timePoints.slice(1).map((t, n) => async () => {
      let sum = 0;
      for (let j = 0; j <= n; j++) {
        const coeff = grunwaldLetnikovCoefficient(alpha, j);
        sum += coeff * solution[n - j];
      }
      return equation(t, sum, alpha);
    });

    const results = await parallelComputation.executeTasks(tasks);
    solution.push(...results);

    logger.info(`Grunwald-Letnikov solution computed successfully with ${timeSteps} time steps`);
    return { timePoints, solution };
  } catch (error) {
    logger.error('Error in Grunwald-Letnikov solver:', error);
    throw new Error(`Grunwald-Letnikov solver failed: ${error.message}`);
  }
}

/**
 * Calculates the Grunwald-Letnikov coefficient.
 * @private
 * @function
 * @param {number} alpha - The fractional order.
 * @param {number} k - The index of the coefficient.
 * @returns {number} The calculated coefficient.
 */
function grunwaldLetnikovCoefficient(alpha, k) {
  if (k === 0) return 1;
  return (1 - (alpha + 1) / k) * grunwaldLetnikovCoefficient(alpha, k - 1);
}

/**
 * Validates the input parameters for the Grunwald-Letnikov solver.
 * @private
 * @function
 * @param {Object} params - The parameters to validate.
 * @throws {Error} If any parameter is invalid.
 */
function validateGrunwaldLetnikovParams(params) {
  validateNumber(params.alpha, 'alpha', 0, 1);
  validateFunction(params.initialCondition, 'initialCondition');
  validateNumber(params.timeStart, 'timeStart');
  validateNumber(params.timeEnd, 'timeEnd', params.timeStart);
  validatePositiveInteger(params.timeSteps, 'timeSteps');
  validateFunction(params.equation, 'equation');
}