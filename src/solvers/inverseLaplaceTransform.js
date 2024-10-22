/**
 * @module solvers/inverseLaplaceTransform
 * @description Provides functions to compute the inverse Laplace transform numerically using the Talbot method.
 * This module achieves its intent by:
 * - Implementing the inverseLaplaceTransform function asynchronously
 * - Utilizing the Talbot method for numerical inversion of Laplace transforms
 * - Preventing blocking operations through asynchronous implementation
 * - Leveraging parallel computation for improved performance
 * - Implementing comprehensive error handling and parameter validation
 * 
 * @since 1.0.11
 * 
 * @example
 * // Example usage of inverseLaplaceTransform:
 * import { inverseLaplaceTransform } from './inverseLaplaceTransform.js';
 * import logger from '../utils/logger.js';
 * 
 * const F = (s) => 1 / (s + 1);
 * try {
 *   const f = await inverseLaplaceTransform(F);
 *   const result = await f(3); // Compute f(t) at t = 3
 *   logger.info('Inverse Laplace transform result:', { result });
 * } catch (error) {
 *   logger.error('Error in inverse Laplace transform:', error);
 * }
 */

import { create, all } from 'mathjs';
import { validateFunction, validateNumber } from '../utils/validation.js';
import { ParallelComputation } from '../utils/parallelComputation.js';
import logger from '../utils/logger.js';

const math = create(all);

/**
 * Computes the inverse Laplace transform of a given function using the Talbot method.
 * @async
 * @param {Function} F - The Laplace-domain function to invert.
 * @returns {Function} - A function that computes the inverse Laplace transform for a given t.
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function inverseLaplaceTransform(F) {
  validateFunction(F, 'Laplace-domain function');

  return async function(t) {
    validateNumber(t, 'Time variable');

    try {
      const M = 64; // Number of terms in the Talbot algorithm
      const talbotMethod = new TalbotMethod(M);
      const result = await talbotMethod.compute(F, t);
      logger.info('Inverse Laplace transform computed successfully');
      return result;
    } catch (error) {
      logger.error('Inverse Laplace transform computation failed:', error);
      throw new Error(`Inverse Laplace transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Implements the Talbot method for numerical inversion of Laplace transforms.
 * @class
 * @since 1.0.11
 */
class TalbotMethod {
  /**
   * @param {number} M - Number of terms in the Talbot algorithm
   */
  constructor(M) {
    this.M = M;
    this.parallelComputation = new ParallelComputation();
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
    
    const tasks = Array.from({ length: this.M }, (_, k) => async () => {
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
      return math.re(math.multiply(math.exp(z), F(s), dz));
    });

    const results = await this.parallelComputation.executeTasks(tasks);
    const sum = results.reduce((acc, val) => acc + val, 0);

    return math.divide(math.multiply(r, sum), 2 * Math.PI);
  }
}

export { inverseLaplaceTransform };