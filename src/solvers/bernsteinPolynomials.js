/**
 * @module solvers/bernsteinPolynomials
 * @description Generates Bernstein polynomials for approximation.
 * Optimized for non-blocking computation by using asynchronous operations.
 * @since 1.0.3
 */

const math = require('mathjs');

/**
 * Generates Bernstein polynomials of degree n evaluated at x.
 * @param {number} n - Degree of the polynomials.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number[]>} - Array of polynomial values at point x.
 */
async function generateBernsteinPolynomials(n, x) {
  const polynomials = [];
  for (let k = 0; k <= n; k++) {
    const coeff = math.combinations(n, k);
    const value = coeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
    polynomials.push(value);
  }
  return polynomials;
}

module.exports = { generateBernsteinPolynomials };
