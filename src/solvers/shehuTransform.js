/**
 * @module solvers/shehuTransform
 * @description Provides functions to compute the Shehu Transform and its inverse numerically.
 * This module achieves its intent by:
 * - Implementing asynchronous operations to prevent blocking
 * - Utilizing numerical integration techniques for forward Shehu Transform
 * - Employing numerical inversion methods for inverse Shehu Transform
 * - Integrating with mathUtils and validation modules for enhanced functionality
 * 
 * The Shehu Transform is defined as:
 * 
 * S(f(t)) = F(s) = ∫[0 to ∞] f(t) * e^(-st) * (1 + s)^t dt
 * 
 * Where f(t) is the original function and F(s) is its Shehu Transform.
 * 
 * @since 1.0.4
 * 
 * @example
 * // Example usage of shehuTransform:
 * import { shehuTransform, inverseShehuTransform } from './solvers/shehuTransform.js';
 * import logger from '../utils/logger.js';
 * 
 * const f = (t) => Math.exp(-t);
 * try {
 *   const F = await shehuTransform(f);
 *   const s = 2;
 *   const result = await F(s);
 *   logger.info('Shehu transform computed successfully', { result });
 *   
 *   const inverseF = await inverseShehuTransform(F);
 *   const t = 1;
 *   const inverseResult = await inverseF(t);
 *   logger.info('Inverse Shehu transform computed successfully', { inverseResult });
 * } catch (error) {
 *   logger.error('Error in Shehu transform operations:', error);
 * }
 * 
 * @see {@link https://www.scirp.org/journal/paperinformation.aspx?paperid=90169|Shehu transform}
 * for more information on the Shehu Transform and its applications.
 */

import { create, all } from 'mathjs';
import { validateFunction, validateNumber } from '../utils/validation.js';
import { numericalIntegration } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';

const math = create(all);

/**
 * Computes the Shehu Transform of a function f(t) asynchronously.
 * @async
 * @param {Function} f - The function to transform.
 * @returns {Promise<Function>} - A promise that resolves to the Shehu Transformed function F(s).
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function shehuTransform(f) {
  validateFunction(f, 'Time-domain function');

  return async function(s) {
    validateNumber(s, 'Complex frequency');

    try {
      const result = await numericalShehuTransform(f, s);
      logger.info('Shehu transform computed successfully');
      return result;
    } catch (error) {
      logger.error('Shehu transform computation failed:', error);
      throw new Error(`Shehu transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Computes the Inverse Shehu Transform of a function F(s) asynchronously.
 * @async
 * @param {Function} F - The Shehu-transformed function.
 * @returns {Promise<Function>} - A promise that resolves to the inverse-transformed function f(t).
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function inverseShehuTransform(F) {
  validateFunction(F, 'Shehu-domain function');

  return async function(t) {
    validateNumber(t, 'Time variable');

    try {
      const result = await numericalInverseShehuTransform(F, t);
      logger.info('Inverse Shehu transform computed successfully');
      return result;
    } catch (error) {
      logger.error('Inverse Shehu transform computation failed:', error);
      throw new Error(`Inverse Shehu transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Numerically computes the Shehu Transform.
 * @async
 * @param {Function} f - The function to transform.
 * @param {number} s - The complex frequency.
 * @returns {Promise<number>} - A promise that resolves to the transformed value.
 */
async function numericalShehuTransform(f, s) {
  // Implementation of numerical integration for Shehu Transform
  // This is a placeholder and should be replaced with actual implementation
  return await numericalIntegration((t) => f(t) * Math.exp(-s * t) * Math.pow(1 + s, t), 0, Infinity);
}

/**
 * Numerically computes the Inverse Shehu Transform.
 * @async
 * @param {Function} F - The Shehu-transformed function.
 * @param {number} t - The time variable.
 * @returns {Promise<number>} - A promise that resolves to the inverse-transformed value.
 */
async function numericalInverseShehuTransform(F, t) {
  // Implementation of numerical inversion for Shehu Transform
  // This is a placeholder and should be replaced with actual implementation
  return await numericalIntegration((s) => F(s) * Math.exp(s * t) / Math.pow(1 + s, t), 0, Infinity);
}
