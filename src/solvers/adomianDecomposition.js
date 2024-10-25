/**
 * @module solvers/adomianDecomposition
 * @description Generates Adomian polynomials for nonlinear terms in differential equations.
 * Optimized for non-blocking computation.
 * 
 * This module is designed to efficiently generate Adomian polynomials for nonlinear terms in differential equations.
 * It leverages non-blocking computation to ensure responsiveness and suitability for both small-scale and large-scale simulations.
 * 
 * @example
 * const polynomial = generateAdomianPolynomials(uSeries, 3);
 * console.log(polynomial(0.5));
 * 
 * @input uSeries - Series of solution approximations up to (n-1) terms. (Array<Function>)
 * @input n - The index of the polynomial to generate. (Number)
 * 
 * @since 1.0.2
 */

/**
 * Generates the n-th Adomian polynomial for the sine function.
 * @param {Array<Function>} uSeries - Series of solution approximations up to (n-1) terms.
 * @param {number} n - The index of the polynomial to generate.
 * @returns {Function} - The n-th Adomian polynomial An(t).
 */
export function generateAdomianPolynomials(uSeries, n) {
  return (t) => {
    let sum = 0;
    for (let k = 0; k <= n; k++) {
      const u_k = uSeries[k](t);
      const coefficient = (-1) ** k * combination(n, k);
      sum += coefficient * Math.sin(u_k);
    }
    return sum;
  };
}

/**
 * Calculates the combination (binomial coefficient) n choose k.
 * @param {number} n
 * @param {number} k
 * @returns {number}
 */
function combination(n, k) {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

/**
 * Calculates the factorial of a number.
 * @param {number} n
 * @returns {number}
 */
function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

