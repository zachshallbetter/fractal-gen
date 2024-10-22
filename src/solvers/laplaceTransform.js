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
 * @since 1.0.4
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
 * Computes the Laplace Transform of a function f(t) asynchronously.
 * @async
 * @param {Function} f - The function to transform.
 * @returns {Promise<Function>} - A promise that resolves to the Laplace Transformed function F(s).
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function laplaceTransform(f) {
  validateFunction(f, 'Time-domain function');

  return async function(s) {
    validateNumber(s, 'Complex frequency');

    try {
      const result = await numericalLaplaceTransform(f, s);
      logger.info('Laplace transform computed successfully');
      return result;
    } catch (error) {
      logger.error('Laplace transform computation failed:', error);
      throw new Error(`Laplace transform computation failed: ${error.message}`);
    }
  };
}

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
 * Performs numerical integration for Laplace Transform.
 * @async
 * @param {Function} f - The function to transform
 * @param {number} s - The complex frequency
 * @returns {Promise<number>} The computed Laplace transform value
 */
async function numericalLaplaceTransform(f, s) {
  const integrationLimit = 100; // Adjust as needed
  const steps = 1000; // Adjust for accuracy vs. performance
  const dx = integrationLimit / steps;
  let sum = 0;

  for (let i = 0; i < steps; i++) {
    const x = i * dx;
    sum += f(x) * Math.exp(-s * x) * dx;
  }

  return sum;
}

/**
 * Computes the inverse Laplace transform using the Talbot method.
 * @async
 * @param {Function} F - The Laplace-domain function to invert
 * @param {number} t - The time variable
 * @param {number} M - Number of terms in the Talbot algorithm
 * @returns {Promise<number>} The computed inverse Laplace transform value
 * @since 1.1.6
 */
async function computeTalbotMethod(F, t, M) {
  const parallelComputation = new ParallelComputation();
  const tasks = Array(M).fill().map((_, k) => async () => {
    const theta = -Math.PI + (2 * k * Math.PI) / M;
    const r = 1 / t * (0.5 * theta / Math.tan(0.5 * theta) + 0.5 * M);
    const s = r * (Math.cos(theta) + math.complex(0, 1));
    const Fs = await F(s);
    return math.multiply(
      1 / (2 * Math.PI * math.complex(0, 1)),
      Math.exp(r * t),
      Fs,
      math.add(0.5 * theta / Math.sin(0.5 * theta), math.complex(0, 1))
    );
  });

  const results = await parallelComputation.executeTasks(tasks);
  return results.reduce((sum, value) => sum + value.re, 0);
}
