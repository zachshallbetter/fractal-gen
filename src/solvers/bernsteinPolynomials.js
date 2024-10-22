/**
 * @module solvers/bernsteinPolynomials
 * @description Generates and evaluates Bernstein polynomials for function approximation.
 * Optimized for non-blocking computation in edge environments using asynchronous operations.
 * 
 * Bernstein Polynomials are a set of polynomials used to approximate functions with high accuracy.
 * They form the basis for Bézier curves and have applications in computer graphics and numerical analysis.
 * 
 * This module provides the following key functionalities:
 * - Generates Bernstein polynomials of a given degree.
 * - Evaluates Bernstein polynomials at a specified point.
 * - Supports efficient computation suitable for edge computing environments.
 * 
 * @example
 * // Generate Bernstein polynomials of degree 5 evaluated at x = 0.5
 * const polynomials = await generateBernsteinPolynomials(5, 0.5);
 * 
 * @example
 * // Evaluate a Bernstein polynomial with given coefficients at x = 0.7
 * const coefficients = [1, 2, 3, 4];
 * const value = await evaluateBernsteinPolynomial(coefficients, 0.7);
 * 
 * @since 1.0.7
 */

import { factorial, combination } from '../utils/mathUtils.js';
import { validatePositiveInteger, validateNumber, validateArray } from '../utils/validation.js';
import { ParallelComputation } from '../utils/parallelComputation.js';
import logger from '../utils/logger.js';

/**
 * Generates Bernstein polynomials of degree n evaluated at x.
 * @async
 * @param {number} n - Degree of the polynomials (non-negative integer).
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number[]>} Array of polynomial values at point x.
 * @throws {Error} If input validation fails.
 */
export async function generateBernsteinPolynomials(n, x) {
  try {
    validatePositiveInteger(n, 'n');
    validateNumber(x, 'x', 0, 1);

    const parallelComputation = new ParallelComputation();
    const tasks = Array.from({ length: n + 1 }, (_, k) => () => {
      const coeff = combination(n, k);
      return coeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
    });

    logger.info(`Generating Bernstein polynomials of degree ${n} at x=${x}`);
    const polynomials = await parallelComputation.executeTasks(tasks);
    logger.info(`Generated ${polynomials.length} Bernstein polynomials`);

    return polynomials;
  } catch (error) {
    logger.error('Error in generating Bernstein polynomials', error);
    throw new Error(`Error in generating Bernstein polynomials: ${error.message}`);
  }
}

/**
 * Evaluates a Bernstein polynomial at a given point.
 * @async
 * @param {number[]} coefficients - Coefficients of the Bernstein polynomial.
 * @param {number} x - Evaluation point (0 ≤ x ≤ 1).
 * @returns {Promise<number>} Value of the polynomial at point x.
 * @throws {Error} If input validation fails.
 */
export async function evaluateBernsteinPolynomial(coefficients, x) {
  try {
    validateArray(coefficients, 'coefficients');
    validateNumber(x, 'x', 0, 1);

    const n = coefficients.length - 1;
    const parallelComputation = new ParallelComputation();
    const tasks = coefficients.map((coeff, k) => () => {
      const binomialCoeff = combination(n, k);
      return coeff * binomialCoeff * Math.pow(x, k) * Math.pow(1 - x, n - k);
    });

    logger.info(`Evaluating Bernstein polynomial of degree ${n} at x=${x}`);
    const results = await parallelComputation.executeTasks(tasks);
    const result = results.reduce((sum, value) => sum + value, 0);
    logger.info(`Evaluated Bernstein polynomial, result: ${result}`);

    return result;
  } catch (error) {
    logger.error('Error in evaluating Bernstein polynomial', error);
    throw new Error(`Error in evaluating Bernstein polynomial: ${error.message}`);
  }
}

/**
 * Approximates a function using Bernstein polynomials.
 * @async
 * @param {Function} func - The function to approximate.
 * @param {number} degree - The degree of the Bernstein polynomial approximation.
 * @param {number} [start=0] - The start of the interval.
 * @param {number} [end=1] - The end of the interval.
 * @returns {Promise<Function>} An approximation of the input function.
 * @throws {Error} If input validation fails.
 */
export async function approximateFunction(func, degree, start = 0, end = 1) {
  try {
    validatePositiveInteger(degree, 'degree');
    validateNumber(start, 'start');
    validateNumber(end, 'end');
    if (typeof func !== 'function') {
      throw new Error('func must be a function');
    }

    const coefficients = await calculateBernsteinCoefficients(func, degree, start, end);

    return async (x) => {
      const normalizedX = (x - start) / (end - start);
      return await evaluateBernsteinPolynomial(coefficients, normalizedX);
    };
  } catch (error) {
    logger.error('Error in approximating function', error);
    throw new Error(`Error in approximating function: ${error.message}`);
  }
}

/**
 * Calculates the coefficients for Bernstein polynomial approximation.
 * @async
 * @param {Function} func - The function to approximate.
 * @param {number} degree - The degree of the Bernstein polynomial approximation.
 * @param {number} start - The start of the interval.
 * @param {number} end - The end of the interval.
 * @returns {Promise<number[]>} The coefficients for the Bernstein polynomial approximation.
 */
async function calculateBernsteinCoefficients(func, degree, start, end) {
  const parallelComputation = new ParallelComputation();
  const tasks = Array.from({ length: degree + 1 }, (_, i) => async () => {
    const t = i / degree;
    const x = start + t * (end - start);
    return func(x);
  });

  logger.info(`Calculating Bernstein coefficients for degree ${degree}`);
  const coefficients = await parallelComputation.executeTasks(tasks);
  logger.info(`Calculated ${coefficients.length} Bernstein coefficients`);

  return coefficients;
}
