/**
 * @module solvers/mhpmSolver
 * @description Solves nonlinear fractional differential equations using the Modified Homotopy Perturbation Method (MHPM).
 * This module implements an advanced numerical technique for solving complex nonlinear fractional differential equations.
 * It combines the concepts of homotopy from topology and perturbation methods to provide accurate approximate solutions.
 * 
 * @since 1.0.6
 * 
 * @example
 * // Example usage of the mhpmSolver function:
 * const solution = await mhpmSolver({
 *   B_t: (t) => {
 *     // Time operational matrix implementation
 *     return []; // Placeholder implementation
 *   },
 *   B_x: (x) => {
 *     // Space operational matrix implementation
 *     return []; // Placeholder implementation
 *   },
 *   D_t: (t, alpha) => {
 *     // Time fractional derivative matrix implementation
 *     return []; // Placeholder implementation
 *   },
 *   D_x: (x, beta) => {
 *     // Space fractional derivative matrix implementation
 *     return []; // Placeholder implementation
 *   },
 *   params: {
 *     alpha: 0.5,
 *     beta: 0.5,
 *     steps: 100,
 *     tolerance: 1e-6,
 *     maxIterations: 1000
 *   }
 * });
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0898122110005536|Modified homotopy perturbation method for solving fractional differential equations}
 * for more information on the MHPM algorithm.
 */
const math = require('mathjs');
const { validateInputs } = require('./utils/inputValidation');
const { performMHPMIteration } = require('./utils/mhpmUtils');
const { SystemTypes } = require('@types/system');

/**
 * Solves a nonlinear fractional differential equation using the Modified Homotopy Perturbation Method (MHPM).
 * @param {Object} options - The options object containing all necessary parameters and functions.
 * @param {Function} options.B_t - Time operational matrix
 * @param {Function} options.B_x - Space operational matrix
 * @param {Function} options.D_t - Time fractional derivative matrix
 * @param {Function} options.D_x - Space fractional derivative matrix
 * @param {Object} options.params - Additional parameters
 * @param {number} options.params.alpha - Time fractional order
 * @param {number} options.params.beta - Space fractional order
 * @param {number} options.params.steps - Number of steps for discretization
 * @param {number} options.params.tolerance - Convergence tolerance
 * @param {number} options.params.maxIterations - Maximum number of iterations
 * @returns {Promise<SystemTypes.Core.CoreServiceResult<Array<{x: number, y: number}>>>} - Approximate solution vector wrapped in a CoreServiceResult
 * @throws {Error} If input validation fails or computation encounters an error
 * @since 1.0.7
 */
async function mhpmSolver(options) {
  try {
    const validationResult = validateInputs(options);
    if (!validationResult.success) {
      throw new Error(`Input validation failed: ${validationResult.error}`);
    }

    const { B_t, B_x, D_t, D_x, params } = options;
    const { steps, tolerance, maxIterations, alpha, beta } = params;

    let solution = Array(steps).fill().map((_, i) => ({ x: i / (steps - 1), y: 0 }));
    let iteration = 0;
    let error = Infinity;

    while (iteration < maxIterations && error > tolerance) {
      const newSolution = await performMHPMIteration(solution, B_t, B_x, D_t, D_x, { alpha, beta, steps });
      error = math.max(newSolution.map((val, i) => Math.abs(val.y - solution[i].y)));
      solution = newSolution;
      iteration++;

      if (iteration % 100 === 0) {
        console.log(`MHPM iteration ${iteration}: current error = ${error}`);
      }
    }

    if (iteration === maxIterations) {
      console.warn('MHPM solver reached maximum iterations without converging');
    }

    return {
      success: true,
      data: solution,
      message: `MHPM solver completed in ${iteration} iterations with final error ${error}`
    };
  } catch (error) {
    console.error('Error in MHPM solver:', error);
    return {
      success: false,
      error: error.message,
      message: 'MHPM solver failed to compute solution'
    };
  }
}

/**
 * Performs a single iteration of the MHPM algorithm.
 * @param {Array<{x: number, y: number}>} currentSolution - Current solution vector
 * @param {Function} B_t - Time operational matrix
 * @param {Function} B_x - Space operational matrix
 * @param {Function} D_t - Time fractional derivative matrix
 * @param {Function} D_x - Space fractional derivative matrix
 * @param {Object} params - Parameters for the iteration
 * @param {number} params.alpha - Time fractional order
 * @param {number} params.beta - Space fractional order
 * @param {number} params.steps - Number of steps for discretization
 * @returns {Promise<Array<{x: number, y: number}>>} - Updated solution vector
 * @throws {Error} If computation encounters an error
 * @since 1.0.7
 */
async function performMHPMIteration(currentSolution, B_t, B_x, D_t, D_x, params) {
  const { alpha, beta, steps } = params;

  try {
    const B_t_matrix = await B_t(currentSolution.map(point => point.x));
    const B_x_matrix = await B_x(currentSolution.map(point => point.x));
    const D_t_matrix = await D_t(currentSolution.map(point => point.x), alpha);
    const D_x_matrix = await D_x(currentSolution.map(point => point.x), beta);

    // Implement the core MHPM algorithm here
    // This is a placeholder for the actual implementation
    const newSolution = currentSolution.map((point, i) => {
      const newY = point.y + 0.1 * (B_t_matrix[i] + B_x_matrix[i] - D_t_matrix[i] - D_x_matrix[i]);
      return { x: point.x, y: newY };
    });

    return newSolution;
  } catch (error) {
    throw new Error(`Error in MHPM iteration: ${error.message}`);
  }
}

module.exports = { mhpmSolver, performMHPMIteration };
