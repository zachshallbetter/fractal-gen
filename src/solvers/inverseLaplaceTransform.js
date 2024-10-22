import math from 'mathjs';

/**
 * @module solvers/inverseLaplaceTransform
 * @description Provides functions to compute the inverse Laplace transform numerically using the Stehfest algorithm.
 * @since 1.0.7
 */

/**
 * Numerically computes the inverse Laplace transform of a given function F(s) using the Stehfest algorithm.
 * @param {Function} F - The Laplace-domain function F(s).
 * @param {number} t - The time variable t.
 * @returns {number} - The inverse Laplace transform f(t).
 * @throws {Error} If the input is invalid or computation fails.
 */
function inverseLaplaceTransform(F, t) {
  if (typeof F !== 'function') {
    throw new Error('F must be a function');
  }
  if (typeof t !== 'number' || t <= 0) {
    throw new Error('t must be a positive number');
  }

  const N = 12; // Number of terms, must be even
  let sum = 0;
  const ln2 = math.log(2);

  try {
    for (let k = 1; k <= N; k++) {
      const coefficient = stehfestCoefficient(k, N);
      sum += coefficient * F(k * ln2 / t);
    }
    return (ln2 / t) * sum;
  } catch (error) {
    throw new Error(`Inverse Laplace transform computation failed: ${error.message}`);
  }
}

/**
 * Computes the Stehfest coefficients used in the numerical inversion of Laplace transforms.
 * @param {number} k - Current term index.
 * @param {number} N - Total number of terms (must be even).
 * @returns {number} - The Stehfest coefficient V_k.
 * @throws {Error} If the input parameters are invalid.
 */
function stehfestCoefficient(k, N) {
  if (!Number.isInteger(k) || k < 1 || k > N) {
    throw new Error('k must be an integer between 1 and N');
  }
  if (!Number.isInteger(N) || N % 2 !== 0 || N < 2) {
    throw new Error('N must be an even integer greater than or equal to 2');
  }

  let sum = 0;
  const M = N / 2;

  for (let j = Math.floor((k + 1) / 2); j <= Math.min(k, M); j++) {
    const numerator = math.pow(j, M) * math.factorial(2 * j);
    const denominator =
      math.factorial(M - j) *
      math.factorial(j) *
      math.factorial(j - 1) *
      math.factorial(k - j) *
      math.factorial(2 * j - k);
    sum += math.pow(-1, j + M) * numerator / denominator;
  }

  return sum;
}

export { inverseLaplaceTransform };