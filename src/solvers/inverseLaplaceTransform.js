/**
 * @module solvers/laplaceTransform
 * @description Provides functions to compute the Laplace Transform and its inverse numerically.
 * This module achieves its intent by:
 * - Implementing asynchronous operations to prevent blocking
 * - Utilizing numerical integration techniques for forward Laplace Transform
 * - Employing the Talbot method for inverse Laplace Transform
 * - Integrating with mathUtils and validation modules for enhanced functionality
 * 
 * The Laplace Transform is defined as:
 * 
 * F(s) = ∫[0 to ∞] f(t) * e^(-st) dt
 * 
 * Where f(t) is the original function and F(s) is its Laplace Transform.
 * 
 * @since 1.0.13
 * 
 * @example
 * // Example usage of laplaceTransform:
 * import { laplaceTransform, inverseLaplaceTransform } from './solvers/laplaceTransform.js';
 * import logger from '../utils/logger.js';
 * 
 * const f = (t) => Math.exp(-t);
 * try {
 *   const F = await laplaceTransform(f);
 *   const s = 2;
 *   const result = await F(s);
 *   logger.info('Laplace transform computed successfully', { result });
 *   
 *   const inverseF = await inverseLaplaceTransform(F);
 *   const t = 1;
 *   const inverseResult = await inverseF(t);
 *   logger.info('Inverse Laplace transform computed successfully', { inverseResult });
 * } catch (error) {
 *   logger.error('Error in Laplace transform operations:', error);
 * }
 * 
 * @see {@link https://en.wikipedia.org/wiki/Laplace_transform|Laplace transform}
 * for more information on the Laplace Transform and its applications.
 */

import { create, all } from 'mathjs';
import { validateFunction, validateNumber } from '../utils/validation.js';
import { ParallelComputation } from '../utils/parallelComputation.js';
import logger from '../utils/logger.js';

const math = create(all);

/**
 * Computes the Inverse Laplace Transform of a function F(s) asynchronously.
 * @async
 * @param {Function} F - The Laplace-transformed function.
 * @returns {Promise<Function>} - A promise that resolves to the inverse-transformed function f(t).
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function inverseLaplaceTransform(F) {
  validateFunction(F, 'Laplace-domain function');

  return async function(t) {
    validateNumber(t, 'Time variable');

    try {
      const M = 64; // Number of terms in the Talbot algorithm
      const result = await computeTalbotMethod(F, t, M);
      logger.info('Inverse Laplace transform computed successfully');
      return result;
    } catch (error) {
      logger.error('Inverse Laplace transform computation failed:', error);
      throw new Error(`Inverse Laplace transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Computes the inverse Laplace transform using the Talbot method.
 * @async
 * @param {Function} F - The Laplace-domain function to invert
 * @param {number} t - The time variable
 * @param {number} M - Number of terms in the Talbot algorithm
 * @returns {Promise<number>} The computed inverse Laplace transform value
 */
export async function computeTalbotMethod(F, t, M) {
  const r = 2 * M / (5 * t);
  const parallelComputation = new ParallelComputation();
  
  const tasks = Array.from({ length: M }, (_, k) => async () => {
    const theta = k * Math.PI / M;
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

  const results = await parallelComputation.executeTasks(tasks);
  const sum = results.reduce((acc, val) => acc + val, 0);

  return math.divide(math.multiply(r, sum), 2 * Math.PI);
}