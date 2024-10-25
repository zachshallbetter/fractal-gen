/**
 * @module solvers/bernsteinPolynomials
 * @description Generates Bernstein polynomials for approximation and evaluates them at a given point.
 * Optimized for non-blocking computation by using asynchronous operations.
 * 
 * This module is designed to efficiently generate Bernstein polynomials of a given degree, evaluated at a specific point x within the range [0, 1]. It leverages asynchronous operations to ensure non-blocking computation, making it suitable for applications where responsiveness is crucial.
 * 
 * @example
 * const polynomials = await generateBernsteinPolynomials(3, 0.5);
 * console.log(polynomials);
 * 
 * @since 1.0.4
 */

import { math } from '../utils/mathUtils.js';

/**
 * Generates Bernstein basis polynomials of degree n evaluated at x.
 * @param {number} n - Degree of the polynomials.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number[]>} - Array of Bernstein basis polynomial values at point x.
 * @since 1.0.4
 */
export async function generateBernsteinPolynomials(n, x) {
  if (x < 0 || x > 1) {
    throw new Error('x must be in range [0,1]');
  }
  
  const polynomials = [];
  for (let k = 0; k <= n; k++) {
    const coeff = math.combinations(n, k);
    const value = coeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
    polynomials.push(value);
  }
  return polynomials;
}

/**
 * Evaluates a Bernstein polynomial given control points and a point x.
 * @param {number[]} controlPoints - Array of control points defining the polynomial.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number>} - The evaluated polynomial value at point x.
 * @since 1.0.4
 */
export async function evaluateBernsteinPolynomial(controlPoints, x) {
  if (x < 0 || x > 1) {
    throw new Error('x must be in range [0,1]');
  }

  const n = controlPoints.length - 1;
  const basisPolynomials = await generateBernsteinPolynomials(n, x);
  
  let result = 0;
  for (let i = 0; i <= n; i++) {
    result += controlPoints[i] * basisPolynomials[i];
  }
  return result;
}

/**
 * Solves a Bernstein polynomial approximation given control points and a point x.
 * This function is a wrapper for evaluateBernsteinPolynomial to provide a more descriptive name.
 * @param {number[]} controlPoints - Array of control points defining the polynomial.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number>} - The evaluated polynomial value at point x.
 * @since 1.0.4
 */
export async function solveBernsteinPolynomials(controlPoints, x) {
  return await evaluateBernsteinPolynomial(controlPoints, x);
}