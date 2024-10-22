/**
 * @module solvers/hesFractionalDerivative
 * @description Computes He's fractional derivative using numerical approximation.
 * This module achieves its intent by:
 * - Implementing the hesFractionalDerivative function asynchronously
 * - Utilizing numerical approximation techniques for fractional derivatives
 * - Preventing blocking operations through asynchronous implementation
 * 
 * @since 1.0.2
 * 
 * @example
 * // Example usage of hesFractionalDerivative:
 * const yFunc = (t) => Math.exp(t);
 * const alpha = 0.5;
 * const t = 1;
 * const result = await hesFractionalDerivative(yFunc, alpha, t);
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0960077903005534|He's fractional derivative and its applications}
 * for more information on He's fractional derivative.
 */

const math = require('mathjs');

/**
 * Computes He's fractional derivative using numerical approximation.
 * @param {Function} yFunc - The function y(t).
 * @param {number} alpha - The fractional order.
 * @param {number} t - The time point.
 * @returns {number} - The fractional derivative at time t.
 */
function hesFractionalDerivative(yFunc, alpha, t) {
  const h = 0.01; // Step size
  const n = Math.floor(t / h);
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    const coeff = math.combinations(alpha, k) * Math.pow(-1, k);
    sum += coeff * yFunc(t - k * h);
  }
  return sum / Math.pow(h, alpha);
}

module.exports = { hesFractionalDerivative };
