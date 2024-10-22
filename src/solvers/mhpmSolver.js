/**
 * @module solvers/mhpmSolver
 * @description Implements the Modified Homotopy Perturbation Method (MHPM) for solving nonlinear fractional differential equations.
 * This module achieves its intent by:
 * - Utilizing Bernstein polynomials and operational matrices for approximation
 * - Implementing an iterative scheme to obtain approximate solutions
 * - Supporting models like the fractional Sine-Gordon equation and advection-diffusion equations
 * - Ensuring compatibility with the existing solver interface
 *
 * The MHPM combines homotopy and perturbation methods to solve complex fractional differential equations effectively.
 *
 * @since 1.0.16
 *
 * @example
 * const solution = await mhpmSolver(params);
 */

import { generateOperationalMatrices } from './operationalMatrices.js';
import { bernsteinPolynomials } from './bernsteinPolynomials.js';
import { validateParams } from '../utils/validation.js';
import logger from '../utils/logger.js';
import { computeNextCoefficients, calculateError, constructSolution } from '../utils/mhpmUtils.js';

/**
 * Solves a fractional differential equation using the Modified Homotopy Perturbation Method (MHPM).
 * @async
 * @param {Object} params - Parameters for the solver.
 * @param {Function} params.equation - The fractional differential equation to solve.
 * @param {Object} params.initialConditions - Initial conditions for the problem.
 * @param {number} params.alpha - Time fractional order.
 * @param {number} params.beta - Space fractional order.
 * @param {number} params.polynomialDegree - Degree of Bernstein polynomials.
 * @param {number} [params.tolerance=1e-6] - Convergence tolerance.
 * @param {number} [params.maxIterations=100] - Maximum number of iterations.
 * @param {number} [params.steps=100] - Number of steps for the solution.
 * @returns {Promise<Array<{ x: number, y: number }>>} - Approximate solution as an array of data points.
 * @since 1.0.16
 */
async function mhpmSolver(params) {
  try {
    validateParams(params);
    const {
      equation,
      initialConditions,
      alpha,
      beta,
      polynomialDegree,
      tolerance = 1e-6,
      maxIterations = 100,
      steps = 100,
    } = params;

    // Generate Bernstein polynomials
    const B = bernsteinPolynomials(polynomialDegree);
    // Generate operational matrix
    const D = generateOperationalMatrices('time', alpha, 1, polynomialDegree);

    // Initialize coefficients
    let coefficients = Array(polynomialDegree + 1).fill(0);
    let iteration = 0;
    let error = Infinity;

    // Iterative process
    while (error > tolerance && iteration < maxIterations) {
      iteration++;
      // Compute the next approximation
      const newCoefficients = await computeNextCoefficients(coefficients, D, equation, initialConditions, params);
      error = calculateError(coefficients, newCoefficients);
      coefficients = newCoefficients;

      logger.debug(`Iteration ${iteration}: error = ${error}`);
    }

    if (error > tolerance) {
      throw new Error('MHPM did not converge within the maximum number of iterations.');
    }

    // Construct the approximate solution
    const solution = constructSolution(B, coefficients, { steps });

    logger.info('MHPM solver completed successfully', { iterations: iteration });
    return solution;
  } catch (error) {
    logger.error('Error in MHPM solver', error);
    throw error;
  }
}

export { mhpmSolver };
