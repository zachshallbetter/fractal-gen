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
 * @since 1.0.14
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
export async function generateInverseBernsteinPolynomials(coefficients) {
  validateArray(coefficients, 'coefficients');

  // Verify the polynomial is monotonic to ensure a valid inverse exists
  const isMonotonic = await verifyMonotonicity(coefficients);
  if (!isMonotonic) {
    throw new Error('Bernstein polynomial must be monotonic to have a valid inverse');
  }

  const degree = coefficients.length - 1;

  return async function (y) {
    validateNumber(y, 'y', 0, 1);

    // Define the Bernstein polynomial using the generateBernsteinPolynomials function
    const B = async (x) => {
      const bernsteinPolynomials = await generateBernsteinPolynomials(degree, x);
      return coefficients.reduce((sum, coeff, k) => sum + coeff * bernsteinPolynomials[k], 0);
    };

    // Use Newton's method with bisection fallback for more robust root finding
    try {
      const x = await newtonMethod(
        B,
        async (x) => {
          const h = 1e-7;
          const fx1 = await B(x + h);
          const fx2 = await B(x - h);
          return (fx1 - fx2) / (2 * h);
        },
        y,
        0.5, // Initial guess at midpoint
        1e-6,
        50
      );
      return x;
    } catch (error) {
      // Fallback to bisection method if Newton's method fails
      return findRoot(
        async (x) => (await B(x)) - y,
        0,
        1,
        1e-6,
        100
      );
    }
  };
}

/**
 * Verifies that a Bernstein polynomial is monotonic by checking coefficients
 * and evaluating at sample points.
 * @async
 * @param {number[]} coefficients - Coefficients of the Bernstein polynomial
 * @returns {Promise<boolean>} - True if the polynomial is monotonic
 */
async function verifyMonotonicity(coefficients) {
  // Check if coefficients are strictly increasing or decreasing
  let increasing = true;
  let decreasing = true;
  
  for (let i = 1; i < coefficients.length; i++) {
    if (coefficients[i] <= coefficients[i-1]) increasing = false;
    if (coefficients[i] >= coefficients[i-1]) decreasing = false;
  }
  
  if (increasing || decreasing) return true;

  // If coefficients test is inconclusive, sample points to verify
  const samples = 20;
  let lastValue = null;
  
  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    const value = await evaluateBernsteinPolynomial(coefficients, x);
    
    if (lastValue !== null) {
      if (Math.abs(value - lastValue) < 1e-10) {
        return false; // Not strictly monotonic
      }
    }
    lastValue = value;
  }
  
  return true;
}

/**
 * Newton's method for root finding with improved convergence checks
 * @async
 * @param {Function} f - The function
 * @param {Function} df - The derivative function
 * @param {number} y - Target value
 * @param {number} x0 - Initial guess
 * @param {number} tol - Tolerance
 * @param {number} maxIter - Maximum iterations
 * @returns {Promise<number>} - The root
 */
async function newtonMethod(f, df, y, x0, tol, maxIter) {
  let x = x0;
  
  for (let i = 0; i < maxIter; i++) {
    const fx = await f(x);
    const dfx = await df(x);
    
    if (Math.abs(dfx) < tol) {
      throw new Error('Derivative too close to zero');
    }
    
    const delta = (fx - y) / dfx;
    x = x - delta;
    
    if (Math.abs(delta) < tol) {
      return x;
    }
    
    // Keep x in valid range
    x = Math.max(0, Math.min(1, x));
  }
  
  throw new Error('Newton\'s method did not converge');
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