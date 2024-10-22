/**
 * @module solvers/bernsteinPolynomials
 * @description Generates Bernstein polynomials for approximation.
 * Optimized for non-blocking computation by using asynchronous operations.
 * 
 * The Bernstein Polynomials are a set of polynomials that are used to approximate functions.
 * 
 * This module provides the following key functionalities:
 * - Generates Bernstein polynomials of a given degree.
 * - Evaluates the polynomials at a given point.
 * 
 * The implementation is designed to be efficient and suitable for edge computing environments, 
 * utilizing asynchronous operations where possible to ensure non-blocking execution.
 * 
 * @example
 * const polynomials = await generateBernsteinPolynomials(5, 0.5);
 * 
 * @input {number, number} - n: Degree of the polynomials, x: Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number[]>} - Array of polynomial values at point x.
 * 
 * @since 1.0.4
 */
const { factorial, combination } = require('../utils/mathUtils');
const { validatePositiveInteger, validateNumber } = require('../utils/validation');

/**
 * Generates Bernstein polynomials of degree n evaluated at x.
 * @async
 * @param {number} n - Degree of the polynomials.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number[]>} - Array of polynomial values at point x.
 * @throws {Error} If input validation fails.
 */
async function generateBernsteinPolynomials(n, x) {
  try {
    validatePositiveInteger(n, 'n');
    validateNumber(x, 'x');
    
    if (x < 0 || x > 1) {
      throw new Error('x must be between 0 and 1 inclusive');
    }

    const polynomials = [];
    for (let k = 0; k <= n; k++) {
      const coeff = combination(n, k);
      const value = coeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
      polynomials.push(value);
    }
    return polynomials;
  } catch (error) {
    throw new Error(`Error in generating Bernstein polynomials: ${error.message}`);
  }
}

/**
 * Evaluates a Bernstein polynomial at a given point.
 * @async
 * @param {number[]} coefficients - Coefficients of the Bernstein polynomial.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number>} - Value of the polynomial at point x.
 * @throws {Error} If input validation fails.
 */
async function evaluateBernsteinPolynomial(coefficients, x) {
  try {
    validateNumber(x, 'x');
    
    if (x < 0 || x > 1) {
      throw new Error('x must be between 0 and 1 inclusive');
    }

    const n = coefficients.length - 1;
    let result = 0;
    for (let k = 0; k <= n; k++) {
      const coeff = combination(n, k);
      result += coefficients[k] * coeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
    }
    return result;
  } catch (error) {
    throw new Error(`Error in evaluating Bernstein polynomial: ${error.message}`);
  }
}

module.exports = { 
  generateBernsteinPolynomials,
  evaluateBernsteinPolynomial
};
