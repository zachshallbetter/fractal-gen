/**
 * @module solvers/operationalMatrices
 * @description Generates operational matrices for fractional derivatives using Bernstein polynomials.
 * This module achieves its intent by:
 * - Constructing matrices based on the fractional order and polynomial degree
 * - Supporting both time and space variables
 * - Utilizing mathematical utilities for accurate computations
 *
 * @since 1.0.16
 */

import { gammaFunction, combination } from '../utils/mathUtils.js';
import { validatePositiveInteger, validateNumber, validateString } from '../utils/validation.js';

/**
 * Generates the operational matrix for fractional derivatives.
 * @param {string} variable - The variable ('time' or 'space').
 * @param {number} order - The fractional order.
 * @param {number} fractalDim - The fractal dimension (typically 1 for time).
 * @param {number} n - Degree of Bernstein polynomials.
 * @returns {number[][]} - The operational matrix.
 * @since 1.0.16
 */
function generateOperationalMatrices(variable, order, fractalDim, n) {
  validateString(variable, 'Variable');
  validateNumber(order, 'Order', 0, 2);
  validatePositiveInteger(n, 'Polynomial Degree');

  const matrix = [];
  for (let i = 0; i <= n; i++) {
    matrix[i] = [];
    for (let j = 0; j <= n; j++) {
      // Compute matrix elements based on the variable and order
      const value = computeMatrixElement(i, j, order, n, variable);
      matrix[i][j] = value;
    }
  }

  return matrix;
}

/**
 * Computes a single element of the operational matrix for fractional derivatives.
 * @param {number} i - Row index (0-based).
 * @param {number} j - Column index (0-based).
 * @param {number} order - The fractional order of the derivative (alpha).
 * @param {number} n - Degree of Bernstein polynomials.
 * @param {string} variable - The variable ('time' or 'space').
 * @returns {number} - The computed matrix element D_{i,j}.
 */
function computeMatrixElement(i, j, order, n, variable) {
  // Validate indices
  if (i < 0 || i > n || j < 0 || j > n) {
    throw new Error('Invalid indices for operational matrix');
  }

  // For fractional derivative of Bernstein polynomials, the operational matrix elements can be computed using:
  // D_{i,j} = (n choose j) * sum_{k=0}^{j} (-1)^{k} * (j choose k) * (i / n)^{j - k} * (orderGamma / gamma(j - k + 1 - order))
  // where orderGamma = gamma(j + 1 - order) and gamma is the Gamma function.
  // Reference: Fractional Calculus and Bernstein Polynomials literature.

  const binomial_n_j = combination(n, j);
  let sum = 0;
  const orderGamma = gammaFunction(j + 1 - order);

  for (let k = 0; k <= j; k++) {
    const sign = Math.pow(-1, k);
    const binomial_j_k = combination(j, k);
    const powerTerm = Math.pow(i / n, j - k);
    const gammaDenominator = gammaFunction(j - k + 1 - order);
    const term = (sign * binomial_j_k * powerTerm * orderGamma) / gammaDenominator;
    sum += term;
  }

  const D_ij = binomial_n_j * sum;
  return D_ij;
}

export { generateOperationalMatrices };
