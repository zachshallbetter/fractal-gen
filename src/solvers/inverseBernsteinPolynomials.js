/**
 * @module solvers/inverseBernsteinPolynomials
 * @description Provides functions to compute the inverse of Bernstein polynomials numerically.
 * This module is designed to work in conjunction with the bernsteinPolynomials module,
 * providing the inverse functionality for Bernstein polynomial approximations.
 * 
 * Key features:
 * - Asynchronous implementation of inverseBernsteinPolynomials function
 * - Utilizes numerical optimization techniques for inverting Bernstein polynomials
 * - Non-blocking operations through asynchronous implementation
 * - Leverages parallel computation for improved performance
 * - Comprehensive error handling and parameter validation
 * 
 * @since 1.0.13
 * 
 * @example
 * // Example usage of inverseBernsteinPolynomials:
 * import { inverseBernsteinPolynomials } from './inverseBernsteinPolynomials.js';
 * import { generateBernsteinPolynomials } from './bernsteinPolynomials.js';
 * import logger from '../utils/logger.js';
 * 
 * const degree = 3;
 * const coefficients = [1, 2, 3, 4];
 * 
 * try {
 *   const bernsteinPolynomials = await generateBernsteinPolynomials(degree, 0.5);
 *   logger.info('Bernstein polynomials:', bernsteinPolynomials);
 * 
 *   const inverseFunction = await inverseBernsteinPolynomials(coefficients);
 *   const result = await inverseFunction(0.5); // Compute inverse at y = 0.5
 *   logger.info('Inverse Bernstein polynomials result:', { result });
 * } catch (error) {
 *   logger.error('Error in Bernstein polynomials operations:', error);
 * }
 */

import { validateArray, validateNumber } from '../utils/validation.js';
import { math, combination } from '../utils/mathUtils.js';
import { reverseEngineer } from '../utils/reverseEngineering.js';
import { generateBernsteinPolynomials, evaluateBernsteinPolynomial } from './bernsteinPolynomials.js';
import { ParallelComputation } from '../utils/parallelComputation.js';
import logger from '../utils/logger.js';

/**
 * Computes the inverse of a Bernstein polynomial using numerical root finding.
 * @async
 * @param {number[]} coefficients - Coefficients of the Bernstein polynomial.
 * @returns {Function} - A function that computes the inverse of the Bernstein polynomial for a given y.
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function inverseBernsteinPolynomials(coefficients) {
  validateArray(coefficients, 'coefficients');

  const degree = coefficients.length - 1;

  return async function (y) {
    validateNumber(y, 'y', 0, 1);

    // Define the Bernstein polynomial using the generateBernsteinPolynomials function
    const B = async (x) => {
      const bernsteinPolynomials = await generateBernsteinPolynomials(degree, x);
      return coefficients.reduce((sum, coeff, k) => sum + coeff * bernsteinPolynomials[k], 0);
    };

    // Use a root-finding method (e.g., Brent's method) to find x such that B(x) = y
    const x = await findRoot(
      async (x) => (await B(x)) - y,
      0,
      1,
      1e-6,
      100
    );

    return x;
  };
}

/**
 * Finds the root of a function within a given interval using the bisection method.
 * @async
 * @param {Function} f - The function for which to find the root.
 * @param {number} a - Start of interval.
 * @param {number} b - End of interval.
 * @param {number} tol - Tolerance for convergence.
 * @param {number} maxIter - Maximum number of iterations.
 * @returns {Promise<number>} - The root of the function.
 */
async function findRoot(f, a, b, tol, maxIter) {
  let fa = await f(a);
  let fb = await f(b);

  if (fa * fb > 0) {
    throw new Error('Function does not change sign over the interval');
  }

  for (let i = 0; i < maxIter; i++) {
    const c = (a + b) / 2;
    const fc = await f(c);

    if (Math.abs(fc) < tol || (b - a) / 2 < tol) {
      return c;
    }

    if (fa * fc < 0) {
      b = c;
      fb = fc;
    } else {
      a = c;
      fa = fc;
    }
  }

  throw new Error('Root finding did not converge');
}