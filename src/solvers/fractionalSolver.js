/**
 * @module solvers/fractionalSolver
 * @description Provides solvers for fractional differential equations, including the Grünwald-Letnikov approach.
 * This module achieves its intent by:
 * - Implementing various fractional differential equation solvers, with a focus on the Grünwald-Letnikov method
 * - Utilizing asynchronous operations for non-blocking and efficient computation
 * - Providing numerical solutions to fractional differential equations
 * - Supporting different modes, utilities, and visualizations
 * 
 * The Grünwald-Letnikov derivative is a fundamental extension of the derivative in fractional calculus,
 * allowing for the computation of derivatives of non-integer order. It was introduced by Anton Karl Grünwald
 * in 1867 and Aleksey Vasilievich Letnikov in 1868.
 * 
 * @since 1.0.11
 * 
 * @example
 * // Example usage of the solveFractionalDE function:
 * const f = (t, y) => -y; // Simple fractional DE: D^α y = -y
 * const params = {
 *   f: f,
 *   y0: 1,
 *   t0: 0,
 *   tEnd: 10,
 *   steps: 1000,
 *   alpha: 0.5,
 *   method: 'grunwaldLetnikov'
 * };
 * solveFractionalDE(params).then(result => {
 *   if (result.success) {
 *     console.log(result.data);
 *   } else {
 *     console.error(result.error);
 *   }
 * });
 * 
 * The Grünwald-Letnikov derivative is defined as:
 * 
 * D^q f(x) = lim(h->0) (1/h^q) * sum(m=0 to infinity) (-1)^m * (q choose m) * f(x - mh)
 * 
 * Where:
 * - D^q represents the fractional derivative of order q
 * - f(x) is the function being differentiated
 * - h is the step size
 * - (q choose m) is the binomial coefficient
 * 
 * This definition is known as the direct Grünwald-Letnikov derivative. There's also a reverse form:
 * 
 * D^q f(x) = lim(h->0) (-1)^q/h^q * sum(m=0 to infinity) (-1)^m * (q choose m) * f(x + mh)
 * 
 * @see {@link https://en.wikipedia.org/wiki/Grünwald–Letnikov_derivative|Grünwald–Letnikov derivative}
 * for more information on the numerical method used.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0898122110005536|Modified homotopy perturbation method}
 * for an alternative approach to solving fractional differential equations.
 */

import { validateParams } from '../utils/validation.js';
import { visualizeSolution } from '../utils/visualization.js';

/**
 * Solves a fractional differential equation using specified method.
 * @async
 * @param {Object} params - Parameters for the solver.
 * @param {Function} params.f - The derivative function f(t, y).
 * @param {number} params.y0 - Initial condition.
 * @param {number} params.t0 - Initial time.
 * @param {number} params.tEnd - End time.
 * @param {number} params.steps - Number of steps.
 * @param {number} params.alpha - Fractional order.
 * @param {string} [params.method='grunwaldLetnikov'] - Solver method to use.
 * @param {Object} [params.options] - Additional options for the solver.
 * @returns {Promise<Object>} - Promise resolving to an object containing success status, data or error message.
 * @throws {Error} If input validation fails or unsupported solver method is specified.
 * @since 1.0.6
 */
async function solveFractionalDE(params) {
  try {
    validateParams(params);
    
    const { method = 'grunwaldLetnikov', options = {} } = params;
    let solver;

    switch (method) {
      case 'grunwaldLetnikov':
        solver = grunwaldLetnikovSolver;
        break;
      case 'modifiedHomotopy':
        solver = modifiedHomotopySolver;
        break;
      default:
        throw new Error(`Unsupported solver method: ${method}`);
    }

    const solution = await solver(params);
    
    if (options.visualize) {
      await visualizeSolution(solution);
    }

    return {
      success: true,
      data: solution,
      message: `Fractional DE solved successfully using ${method} method.`
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      data: null
    };
  }
}

/**
 * Solves a fractional differential equation using the Grünwald-Letnikov method.
 * @async
 * @param {Object} params - Parameters for the solver.
 * @param {Function} params.f - The derivative function f(t, y).
 * @param {number} params.y0 - Initial condition.
 * @param {number} params.t0 - Initial time.
 * @param {number} params.tEnd - End time.
 * @param {number} params.steps - Number of steps.
 * @param {number} params.alpha - Fractional order.
 * @returns {Promise<Array<{ x: number, y: number }>>} - Promise resolving to an array of data points.
 * @throws {Error} If input parameters are invalid.
 * @since 1.0.6
 */
async function grunwaldLetnikovSolver({ f, y0, t0, tEnd, steps, alpha }) {
  if (steps <= 0 || alpha <= 0) {
    throw new Error("Invalid input parameters: steps and alpha must be positive");
  }

  const dt = (tEnd - t0) / steps;
  let t = t0;
  let y = y0;
  const data = [{ x: t, y: y }];

  for (let i = 1; i <= steps; i++) {
    t += dt;
    let delta = 0;
    for (let k = 0; k <= i; k++) {
      delta += combination(alpha, k) * Math.pow(-1, k) * f(t - k * dt, y);
    }
    y += Math.pow(dt, alpha) * delta / Math.gamma(alpha + 1);
    data.push({ x: t, y: y });
  }

  return data;
}

/**
 * Calculates the binomial coefficient (alpha choose k) for fractional alpha.
 * @param {number} alpha - The fractional order.
 * @param {number} k - The index.
 * @returns {number} The binomial coefficient.
 * @private
 */
function combination(alpha, k) {
  if (k === 0) return 1;
  let prod = 1;
  for (let i = 0; i < k; i++) {
    prod *= (alpha - i) / (i + 1);
  }
  return prod;
}

module.exports = { solveFractionalDE, grunwaldLetnikovSolver };
