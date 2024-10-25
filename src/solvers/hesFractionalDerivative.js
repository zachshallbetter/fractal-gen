/**
 * @module solvers/hesFractionalDerivative
 * @description Computes He’s fractional derivative using numerical approximation.
 * This module is designed to numerically approximate He’s fractional derivative, a key concept in fractional calculus.
 * It leverages numerical methods to provide an efficient and accurate computation of the derivative.
 * 
 * @example
 * const derivative = hesFractionalDerivative(yFunc, alpha, t);
 * console.log(derivative);
 * 
 * @input yFunc - The function for which the fractional derivative is to be computed. (Function)
 * @input alpha - The order of the fractional derivative. (Number)
 * @input t - The time at which to evaluate the derivative. (Number)
 * 
 * @since 1.0.1
 */

import { math } from '../utils/mathUtils.js';

/**
 * Computes He’s fractional derivative using numerical approximation.
 * @param {Function} yFunc - The function for which the fractional derivative is to be computed.
 * @param {number} alpha - The order of the fractional derivative.
 * @param {number} t - The time at which to evaluate the derivative.
 * @returns {number} - The computed fractional derivative at time `t`.
 */
export function hesFractionalDerivative(yFunc, alpha, t) {
  const h = 0.01; // Step size
  const n = Math.floor(t / h);
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    const coeff = math.combinations(alpha, k) * Math.pow(-1, k);
    sum += coeff * yFunc(t - k * h);
  }
  return sum / Math.pow(h, alpha);
}
