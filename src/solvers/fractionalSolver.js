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
 * const solution = await grunwaldLetnikovSolver({
 *   alpha: 0.5,
 *   initialCondition: t => 1,
 *   timeStart: 0,
 *   timeEnd: 10,
 *   timeSteps: 1000,
 *   equation: (t, y) => -y
 * });
 * 
 * @since 1.0.9
 */

import { combination } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';

/**
 * Solves a fractional differential equation using the Grünwald-Letnikov method.
 * @async
 * @function
 * @param {Object} params - The parameters for the Grünwald-Letnikov solver.
 * @param {number} params.alpha - The fractional order of the derivative (0 < alpha <= 1).
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

    // Validate input parameters
    if (alpha <= 0 || alpha > 1) {
      throw new Error('Alpha must be in range (0,1]');
    }
    if (timeEnd <= timeStart) {
      throw new Error('End time must be greater than start time');
    }
    if (timeSteps < 1) {
      throw new Error('Number of time steps must be positive');
    }

    const h = (timeEnd - timeStart) / timeSteps;
    const timePoints = Array.from({ length: timeSteps + 1 }, (_, i) => timeStart + i * h);
    const solution = [initialCondition(timeStart)];

    // Pre-compute Grünwald-Letnikov coefficients
    const glCoefficients = new Array(timeSteps + 1);
    glCoefficients[0] = 1;
    for (let j = 1; j <= timeSteps; j++) {
      glCoefficients[j] = glCoefficients[j-1] * (1 - (alpha + 1) / j);
    }

    // Main solution loop using corrected Grünwald-Letnikov formula
    for (let n = 1; n <= timeSteps; n++) {
      let sum = 0;
      for (let j = 1; j <= n; j++) {
        sum += glCoefficients[j] * solution[n - j];
      }
      
      // Apply corrected Grünwald-Letnikov formula
      const t_n = timePoints[n];
      const y_prev = solution[n - 1];
      const f_n = equation(t_n, y_prev);
      
      const y_n = y_prev + (Math.pow(h, alpha) / gamma(alpha)) * 
                  (f_n - sum / Math.pow(h, alpha));
      
      solution.push(y_n);
    }

    logger.info(`Grünwald-Letnikov solution computed successfully with ${timeSteps} time steps`);
    return { timePoints, solution };
  } catch (error) {
    logger.error('Error in Grünwald-Letnikov solver:', error);
    throw new Error(`Grünwald-Letnikov solver failed: ${error.message}`);
  }
}

/**
 * Computes the Gamma function using Lanczos approximation.
 * @private
 * @param {number} z - Input value
 * @returns {number} Gamma function value
 */
function gamma(z) {
  const p = [
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.13857109526572012,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  
  if (z < 0.5) {
    return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  }
  
  z -= 1;
  let x = 0.99999999999980993;
  for (let i = 0; i < p.length; i++) {
    x += p[i] / (z + i + 1);
  }
  
  const t = z + p.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}
