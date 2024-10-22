/**
 * @module utils/mhpmUtils
 * @description Provides utility functions for the Modified Homotopy Perturbation Method (MHPM) solver.
 * This module includes functions for computing the next approximation, calculating errors, and constructing the solution.
 * It supports the MHPM solver implementation in the solverSelector module.
 *
 * The MHPM solver is designed to solve fractional differential equations efficiently,
 * offering improved convergence compared to traditional methods.
 *
 * @example
 * // Example usage within the MHPM solver
 * const nextCoefficients = await computeNextCoefficients(currentCoefficients, D, equation, initialConditions, params);
 * const error = calculateError(currentCoefficients, nextCoefficients);
 * const solution = constructSolution(bernsteinPolynomials, finalCoefficients, params);
 *
 * @since 1.0.17
 */

import { multiplyMatrixVector, subtractVectors, vectorNorm, bernsteinPolynomials, math } from './mathUtils.js';
import { validateArray } from './validation.js';
import logger from './logger.js';

/**
 * Computes the next set of coefficients in the MHPM iteration.
 * @async
 * @param {number[]} coefficients - Current coefficients.
 * @param {number[][]} D - Operational matrix for fractional derivatives.
 * @param {Function} equation - The fractional differential equation to solve.
 * @param {Object} initialConditions - Initial conditions for the problem.
 * @param {Object} params - Additional parameters including fractional orders.
 * @param {number} params.alpha - The fractional order.
 * @param {number} [params.beta] - The second fractional order (if applicable).
 * @returns {Promise<number[]>} - Next set of coefficients.
 * @throws {Error} If there's an error during coefficient computation.
 * @since 1.0.17
 */
async function computeNextCoefficients(coefficients, D, equation, initialConditions, params) {
  try {
    const { polynomialDegree: n, alpha, beta } = params;

    // Assemble the system matrix A and right-hand side vector b
    const A = [];
    const b = [];

    // Compute A and b using parallel computation
    const tasks = [];
    for (let i = 0; i <= n; i++) {
      tasks.push((async () => {
        const Ai = D[i];

        // Compute the nonlinear term approximation at index i
        const nonlinearTerm = await approximateNonlinearTerm(i, coefficients, equation, params);

        // Right-hand side b_i = -nonlinearTerm
        const bi = -nonlinearTerm;

        return { Ai, bi, index: i };
      })());
    }

    // Execute tasks in parallel
    const results = await Promise.all(tasks);

    // Assemble A and b from results
    results.forEach(({ Ai, bi, index }) => {
      A[index] = Ai;
      b[index] = bi;
    });

    // Apply initial conditions
    applyInitialConditions(A, b, initialConditions, params);

    // Solve the linear system A * c_new = b
    const c_new = math.lusolve(A, b).map(row => row[0]); // Convert matrix to vector

    logger.info('Next coefficients computed successfully');
    return c_new;
  } catch (error) {
    logger.error('Error computing next coefficients:', error);
    throw error;
  }
}

/**
 * Approximates the nonlinear term in the equation for the given index.
 * @async
 * @param {number} i - The index.
 * @param {number[]} coefficients - Current coefficients.
 * @param {Function} equation - The fractional differential equation to solve.
 * @param {Object} params - Additional parameters including fractional orders.
 * @param {number} params.alpha - The fractional order.
 * @param {number} [params.beta] - The second fractional order (if applicable).
 * @returns {Promise<number>} - Approximated nonlinear term at index i.
 */
export async function approximateNonlinearTerm(i, coefficients, equation, params) {
  const { polynomialDegree: n, alpha, beta } = params;

  // Collocation point x_i
  const x_i = i / n;

  // Evaluate the approximate solution y_i at x_i
  let y_i = 0;
  const B = bernsteinPolynomials(n);
  for (let k = 0; k <= n; k++) {
    y_i += coefficients[k] * B[k](x_i);
  }

  // Evaluate the nonlinear term f(x_i, y_i)
  const nonlinearValue = equation(x_i, y_i, alpha, beta);

  return nonlinearValue;
}

/**
 * Applies initial conditions to the system matrix and right-hand side vector.
 * @param {number[][]} A - The system matrix.
 * @param {number[]} b - The right-hand side vector.
 * @param {Object} initialConditions - Initial conditions.
 * @param {Object} params - Additional parameters.
 */
export function applyInitialConditions(A, b, initialConditions, params) {
  const { polynomialDegree: n } = params;

  // Enforce initial condition y(0) = y0
  if (initialConditions && initialConditions.y0 !== undefined) {
    // Modify the first row of A and b
    const B_at_0 = bernsteinPolynomials(n).map(bf => bf(0));
    A[0] = B_at_0;
    b[0] = initialConditions.y0;
  }
}

/**
 * Calculates the error between two coefficient vectors.
 * @param {number[]} prevCoefficients - Previous coefficients.
 * @param {number[]} newCoefficients - New coefficients.
 * @returns {number} - Calculated error.
 * @throws {Error} If input arrays are invalid.
 */
export function calculateError(prevCoefficients, newCoefficients) {
  try {
    validateArray(prevCoefficients, 'Previous Coefficients');
    validateArray(newCoefficients, 'New Coefficients');

    const difference = subtractVectors(newCoefficients, prevCoefficients);
    return vectorNorm(difference);
  } catch (error) {
    logger.error('Error calculating error:', error);
    throw error;
  }
}

/**
 * Constructs the approximate solution from Bernstein polynomials and coefficients.
 * @param {Function[]} B - Array of Bernstein polynomial functions.
 * @param {number[]} coefficients - Coefficients of the approximation.
 * @param {Object} params - Additional parameters.
 * @param {number} [params.steps=100] - Number of points in the solution.
 * @returns {Array<{ x: number, y: number }>} - Approximate solution data points.
 */
export function constructSolution(B, coefficients, params) {
  const { steps = 100 } = params;
  const solution = [];

  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const y = B.reduce((sum, bFunc, idx) => sum + coefficients[idx] * bFunc(x), 0);
    solution.push({ x, y });
  }

  logger.info(`Solution constructed with ${steps + 1} points`);
  return solution;
}
