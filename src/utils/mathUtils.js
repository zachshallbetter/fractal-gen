/**
 * @module utils/mathUtils
 * @description Provides optimized utility functions for mathematical operations used in various solvers and models.
 * @since 1.1.3
 */

import { create, all } from 'mathjs';

const math = create(all); // Initialize math.js

/**
 * Calculates the combination (n choose k).
 * @param {number} n - The total number of items.
 * @param {number} k - The number of items to choose.
 * @returns {number} - The binomial coefficient \( \binom{n}{k} \).
 */
export function combination(n, k) {
  if (!Number.isInteger(n) || !Number.isInteger(k)) {
    throw new Error('n and k must be integers');
  }
  if (k < 0 || k > n) {
    return 0;
  }
  if (k === 0 || k === n) {
    return 1;
  }
  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - (k - i))) / i;
  }
  return result;
}

/**
 * Computes the Gamma function of a number.
 * @param {number} z - The input value.
 * @returns {number} - The Gamma function evaluated at \( z \).
 */
export function gammaFunction(z) {
  return math.gamma(z);
}

/**
 * Computes the modulo operation.
 * @param {number} a - The dividend.
 * @param {number} b - The divisor.
 * @returns {number} - The remainder of a divided by b.
 */
export function mod(a, b) {
  return ((a % b) + b) % b;
}

/**
 * Computes the maximum of two numbers.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} - The larger of a and b.
 */
export function max(a, b) {
  return Math.max(a, b);
}


export function numericalIntegration(f, a, b, n) {
  return math.integrate(f, a, b, n);
}
