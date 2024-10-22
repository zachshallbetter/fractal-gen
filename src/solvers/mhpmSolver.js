/**
 * @module solvers/mhpmSolver
 * @description Implements the Modified Homotopy Perturbation Method (MHPM) for solving nonlinear fractional differential equations,
 * and provides functionality to compute the inverse solution.
 * This module achieves its intent by:
 * - Utilizing Bernstein polynomials and operational matrices for approximation
 * - Implementing an iterative scheme to obtain approximate solutions
 * - Supporting models like the fractional Sine-Gordon equation and advection-diffusion equations
 * - Ensuring compatibility with the existing solver interface
 * - Providing inverse solution computation using inverse Bernstein polynomials
 *
 * The MHPM combines homotopy and perturbation methods to solve complex fractional differential equations effectively.
 *
 * @since 1.0.17
 *
 * @example
 * const solution = await mhpmSolver(params);
 * const inverseSolution = await mhpmInverseSolver(solution, params);
 */

import { generateOperationalMatrices } from './operationalMatrices.js';
import { bernsteinPolynomials, evaluateBernsteinPolynomial } from './bernsteinPolynomials.js';
import { validateParams, validateArray, validateNumber } from '../utils/validation.js';
import logger from '../utils/logger.js';
import { computeNextCoefficients, calculateError, constructSolution } from '../utils/mhpmUtils.js';
import { math, combination } from '../utils/mathUtils.js';
import { reverseEngineer } from '../utils/reverseEngineering.js';
import { inverseBernsteinPolynomials } from './inverseBernsteinPolynomials.js';

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
 * @throws {Error} If the solver fails to converge or encounters an error.
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

/**
 * Computes the inverse solution for the MHPM solver results.
 * @async
 * @param {Array<{ x: number, y: number }>} solution - The solution obtained from mhpmSolver.
 * @param {Object} params - Parameters used in the original solution.
 * @param {number} params.polynomialDegree - Degree of Bernstein polynomials used in the original solution.
 * @returns {Promise<Array<{ x: number, y: number }>>} - Inverse solution as an array of data points.
 * @throws {Error} If the inverse computation fails.
 * @since 1.0.17
 */
async function mhpmInverseSolver(solution, params) {
  try {
    validateArray(solution, 'solution');
    validateParams(params);
    const { polynomialDegree } = params;

    // Extract y values from the solution
    const yValues = solution.map(point => point.y);

    // Compute coefficients for the inverse Bernstein polynomials
    const inverseCoefficients = await computeInverseCoefficients(yValues, polynomialDegree);

    // Compute the inverse solution
    const inverseSolution = await Promise.all(solution.map(async (point) => {
      const inverseY = await evaluateBernsteinPolynomial(inverseCoefficients, point.x);
      return { x: point.y, y: inverseY };
    }));

    logger.info('MHPM inverse solver completed successfully');
    return inverseSolution;
  } catch (error) {
    logger.error('Error in MHPM inverse solver', error);
    throw error;
  }
}

/**
 * Computes the coefficients for the inverse Bernstein polynomials.
 * @async
 * @param {number[]} yValues - The y values from the original solution.
 * @param {number} polynomialDegree - Degree of Bernstein polynomials.
 * @returns {Promise<number[]>} - Coefficients for the inverse Bernstein polynomials.
 * @throws {Error} If the coefficient computation fails.
 */
async function computeInverseCoefficients(yValues, polynomialDegree) {
  try {
    const inverseFunction = await inverseBernsteinPolynomials(yValues);
    const coefficients = [];

    for (let i = 0; i <= polynomialDegree; i++) {
      const x = i / polynomialDegree;
      coefficients.push(await inverseFunction(x));
    }

    return coefficients;
  } catch (error) {
    logger.error('Error in computing inverse coefficients', error);
    throw new Error(`Failed to compute inverse coefficients: ${error.message}`);
  }
}

export { mhpmSolver, mhpmInverseSolver };
