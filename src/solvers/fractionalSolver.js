/**
 * @module solvers/fractionalSolver
 * @description Provides solvers for fractional differential equations, including the Grünwald-Letnikov approach.
 * This module achieves its intent by:
 * - Implementing various fractional differential equation solvers
 * - Utilizing asynchronous operations for non-blocking and efficient computation
 * - Providing numerical solutions to fractional differential equations
 * - Supporting different modes, utilities, and visualizations
 * 
 * @since 1.0.9
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
 * @see {@link https://en.wikipedia.org/wiki/Grünwald–Letnikov_derivative|Grünwald–Letnikov derivative}
 * for more information on the numerical method used.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0898122110005536|Modified homotopy perturbation method}
 * for an alternative approach to solving fractional differential equations.
 */

const { validateParams } = require('./utility');
const { visualizeSolution } = require('./visualization');

/**
 * Solves a fractional differential equation using specified method.
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
 * @param {Object} params - Parameters for the solver.
 * @returns {Promise<Array<{ x: number, y: number }>>} - Promise resolving to an array of data points.
 */
async function grunwaldLetnikovSolver(f, y0, t0, tEnd, steps, alpha) {
  if (steps <= 0 || alpha <= 0) {
    throw new Error("Invalid input parameters");
  }

  const dt = (tEnd - t0) / steps;
  let t = t0;
  let y = y0;
  const data = [{ x: t, y: y }];

  for (let i = 1; i <= steps; i++) {
    t += dt;
    let delta = 0;
    for (let k = 0; k <= i; k++) {
      delta += math.combinations(i, k) * Math.pow(-1, k) * f(t - k * dt, y);
    }
    y += Math.pow(dt, alpha) * delta;
    data.push({ x: t, y: y });
  }

  return data;
}

module.exports = { grunwaldLetnikovSolver };
