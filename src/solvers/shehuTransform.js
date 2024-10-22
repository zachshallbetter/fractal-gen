/**
 * @module solvers/shehuTransform
 * @description Provides functions to compute the Shehu Transform and its inverse numerically.
 * This module achieves its intent by:
 * - Implementing the Shehu Transform using numerical integration
 * - Utilizing asynchronous operations to prevent blocking
 * - Employing change of variables and Gaussian quadrature for efficient computation
 * - Implementing the inverse Shehu Transform using numerical inversion techniques
 * - Incorporating variance reduction techniques inspired by sequential quasi-Monte Carlo methods
 * 
 * The Shehu Transform is a novel integral transform introduced by Shehu and Maitama in 2019.
 * It is defined for a function f(t) as:
 * 
 * S[f(t)](s) = sqrt(2/π) * ∫[0 to ∞] exp(-s^2*t^2/2) * f(t) dt
 * 
 * Where s is the complex frequency variable.
 * 
 * This transform has applications in solving certain types of differential equations
 * and analyzing signals in engineering and physics.
 * 
 * @since 1.0.9
 * 
 * @example
 * // Example usage of shehuTransform:
 * import { shehuTransform } from './solvers/shehuTransform.js';
 * import { exp } from '../utils/mathUtils.js';
 * import logger from '../utils/logger.js';
 * 
 * const f = (t) => exp(-t);
 * try {
 *   const F = await shehuTransform(f);
 *   const result = await F(2); // Compute F(s) at s = 2
 *   logger.info('Shehu transform computed successfully', { result });
 * } catch (error) {
 *   logger.error('Error in Shehu transform:', error);
 * }
 * 
 * @input {Function} f - The function to transform.
 * @returns {Function} - A function that computes the Shehu transform for a given s.
 * 
 * @example
 * // Example usage of inverseShehuTransform:
 * import { inverseShehuTransform } from './solvers/shehuTransform.js';
 * import logger from '../utils/logger.js';
 * 
 * const F = (s) => 1 / (s + 1);
 * try {
 *   const f = await inverseShehuTransform(F);
 *   const result = await f(2); // Compute f(t) at t = 2
 *   logger.info('Inverse Shehu transform computed successfully', { result });
 * } catch (error) {
 *   logger.error('Error in inverse Shehu transform:', error);
 * }
 * 
 * @input {Function} F - The Shehu-transformed function.
 * @returns {Function} - A function that computes the inverse Shehu transform for a given t.
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S2226719X19300202|Shehu Transform}
 * for more information on the Shehu Transform.
 * @see {@link https://www.mdpi.com/2227-7390/8/4/522|Applications of Shehu Transform}
 * for examples of Shehu Transform applications in differential equations and variance reduction techniques.
 */

import { validateFunction, validateNumber, validatePositiveInteger } from '../utils/validation.js';
import { exp, sin, cos, sqrt, PI } from '../utils/mathUtils.js';
import logger from '../utils/logger.js';
import { generateSobolSequence } from '../utils/sobolSequence.js';

/**
 * Computes the Shehu Transform of a function f(t) asynchronously using variance reduction techniques.
 * @async
 * @param {Function} f - The function to transform.
 * @returns {Function} - A function that computes the Shehu transform for a given s.
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function shehuTransform(f) {
  validateFunction(f);

  return async function(s) {
    validateNumber(s, 'Complex frequency variable');

    try {
      // Change of variables: u = s * t
      const integrand = (u) => {
        const t = u / s;
        return exp(-u * u / 2) * f(t) / s;
      };

      // Gaussian quadrature parameters
      const n = 100; // Number of points
      const [points, weights] = gaussLegendre(n);

      // Generate Sobol sequence for variance reduction
      const sobolSequence = generateSobolSequence(n);

      // Perform numerical integration with variance reduction
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = points[i] * sobolSequence[i];
        sum += weights[i] * integrand(u);
      }

      // Apply the scaling factor
      return sqrt(2 / PI) * sum;
    } catch (error) {
      logger.error('Shehu transform computation failed:', error);
      throw new Error(`Shehu transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Computes the Inverse Shehu Transform of a function F(s) asynchronously using variance reduction techniques.
 * @async
 * @param {Function} F - The Shehu-transformed function.
 * @returns {Function} - A function that computes the inverse Shehu transform for a given t.
 * @throws {Error} If the input is invalid or computation fails.
 */
export async function inverseShehuTransform(F) {
  validateFunction(F);

  return async function(t) {
    validateNumber(t, 'Time variable');

    try {
      // Implement numerical inversion using the Bromwich integral with variance reduction
      const integrand = async (u) => {
        const s = u / t;
        const Fs = await F(s);
        return exp(u) * Fs / t;
      };

      // Gaussian quadrature parameters
      const n = 100; // Number of points
      const [points, weights] = gaussLegendre(n);

      // Generate Sobol sequence for variance reduction
      const sobolSequence = generateSobolSequence(n);

      // Perform numerical integration with variance reduction
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const u = points[i] * sobolSequence[i];
        sum += weights[i] * await integrand(u);
      }

      // Apply the scaling factor
      return sqrt(t / (2 * PI)) * sum;
    } catch (error) {
      logger.error('Inverse Shehu transform computation failed:', error);
      throw new Error(`Inverse Shehu transform computation failed: ${error.message}`);
    }
  };
}

/**
 * Generates Gauss-Legendre quadrature points and weights.
 * @param {number} n - Number of points.
 * @returns {[number[], number[]]} - Arrays of points and weights.
 */
function gaussLegendre(n) {
  validatePositiveInteger(n, 'Number of quadrature points');

  const EPSILON = 1e-14;
  const m = Math.floor((n + 1) / 2);
  const x = [];
  const w = [];

  for (let i = 1; i <= m; i++) {
    let z = Math.cos(Math.PI * (i - 0.25) / (n + 0.5));
    let z1 = 0;
    let iteration = 0;

    while (Math.abs(z - z1) > EPSILON && iteration < 100) {
      iteration++;
      let p1 = 1;
      let p2 = 0;

      for (let j = 1; j <= n; j++) {
        const p3 = p2;
        p2 = p1;
        p1 = ((2 * j - 1) * z * p2 - (j - 1) * p3) / j;
      }

      const pp = (n * (z * p1 - p2)) / (z * z - 1);
      z1 = z;
      z = z1 - p1 / pp;
    }

    x[i - 1] = -z;
    x[n - i] = z;
    w[i - 1] = (2 / ((1 - z * z) * Math.pow(pp, 2)));
    w[n - i] = w[i - 1];
  }

  return [x, w];
}

export { shehuTransform, inverseShehuTransform };
