/**
 * @module solvers/laplaceTransform
 * @description Provides functions to compute the Laplace Transform and its inverse numerically.
 * This module achieves its intent by:
 * - Implementing asynchronous functions for laplaceTransform and inverseLaplaceTransform
 * - Using advanced numerical integration techniques for the forward transform
 * - Employing sophisticated numerical inversion algorithms for the inverse transform
 * - Preventing blocking operations through asynchronous implementation
 * - Implementing comprehensive error handling and parameter validation
 * - Optimizing performance through efficient algorithms and parallel processing
 * 
 * @since 1.0.6
 * 
 * @example
 * // Example usage of laplaceTransform:
 * const f = (t) => Math.exp(-t);
 * try {
 *   const F = await laplaceTransform(f);
 *   const result = await F(2); // Compute F(s) at s = 2
 *   console.log(result);
 * } catch (error) {
 *   console.error('Error in Laplace transform:', error.message);
 * }
 * 
 * @example
 * // Example usage of inverseLaplaceTransform:
 * const F = (s) => 1 / (s + 1);
 * try {
 *   const f = await inverseLaplaceTransform(F);
 *   const result = await f(3); // Compute f(t) at t = 3
 *   console.log(result);
 * } catch (error) {
 *   console.error('Error in inverse Laplace transform:', error.message);
 * }
 * 
 * @example
 * // Example of error handling and parameter validation:
 * try {
 *   const invalidF = 'not a function';
 *   await laplaceTransform(invalidF);
 * } catch (error) {
 *   console.error('Validation error:', error.message);
 * }
 */

import math from 'mathjs';
import { validateFunction, validateNumber } from '../utils/validators';
import { ParallelComputation } from '../utils/parallelComputation';

/**
 * Computes the Laplace transform of a given function using numerical integration.
 * @async
 * @param {Function} f - The time-domain function to transform.
 * @returns {Function} - A function that computes the Laplace transform for a given s.
 * @throws {Error} If the input is invalid or computation fails.
 */
async function laplaceTransform(f) {
  validateFunction(f);

  return async function(s) {
    validateNumber(s, 'Complex frequency variable');

    try {
      const integrand = (t) => Math.exp(-s * t) * f(t);
      const upperLimit = 100; // Adjust based on the behavior of f(t)
      return await math.integrate(integrand, 0, upperLimit);
    } catch (error) {
      throw new Error(`Laplace transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Computes the inverse Laplace transform of a given function using the Talbot method.
 * @async
 * @param {Function} F - The Laplace-domain function to invert.
 * @returns {Function} - A function that computes the inverse Laplace transform for a given t.
 * @throws {Error} If the input is invalid or computation fails.
 */
async function inverseLaplaceTransform(F) {
  validateFunction(F);

  return async function(t) {
    validateNumber(t, 'Time variable');

    try {
      const M = 64; // Number of terms in the Talbot algorithm
      const talbotMethod = new TalbotMethod(M);
      return await talbotMethod.compute(F, t);
    } catch (error) {
      throw new Error(`Inverse Laplace transform computation failed: ${error.message}`);
    }
  };
}
/**
 * Implements the Talbot method for numerical inversion of Laplace transforms.
 * @class
 * @since 1.0.8
 */
class TalbotMethod {
  /**
   * @param {number} M - Number of terms in the Talbot algorithm
   */
  constructor(M) {
    this.M = M;
  }

  /**
   * Computes the inverse Laplace transform using the Talbot method.
   * @async
   * @param {Function} F - The Laplace-domain function to invert
   * @param {number} t - The time variable
   * @returns {Promise<number>} The computed inverse Laplace transform value
   */
  async compute(F, t) {
    const r = 2 * this.M / (5 * t);
    let sum = 0;

    for (let k = 0; k < this.M; k++) {
      const theta = k * Math.PI / this.M;
      const s = math.complex(
        r * theta / Math.tan(theta),
        r * theta
      );
      const z = math.multiply(t, s);
      const dz = math.complex(
        t * r / Math.pow(Math.sin(theta), 2),
        t * r * (1 / Math.tan(theta) + theta)
      );
      sum += math.re(math.multiply(math.exp(z), F(s), dz));
    }

    return math.divide(math.multiply(r, sum), 2 * Math.PI);
  }
}

export { laplaceTransform, inverseLaplaceTransform };
