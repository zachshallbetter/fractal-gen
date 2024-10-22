/**
 * @module solvers/adomianDecomposition
 * @description Implements the Adomian Decomposition Method for solving nonlinear differential equations.
 * Optimized for non-blocking computation in edge environments.
 * 
 * The Adomian Decomposition Method (ADM) is a powerful analytical technique for solving nonlinear differential equations. 
 * It decomposes the solution into a series of polynomials, which are then used to approximate the solution with high accuracy.
 * 
 * This module provides the following key functionalities:
 * - Generates Adomian polynomials for various nonlinear terms in differential equations.
 * - Implements the Laplace-Adomian Decomposition Method (LADM) for solving fractional differential equations.
 * - Offers utility functions for mathematical operations such as combinations and factorials.
 * - Generates solution data for visualization and analysis purposes.
 * 
 * The implementation is designed to be efficient and suitable for edge computing environments, 
 * utilizing asynchronous operations where possible to ensure non-blocking execution.
 * 
 * @example
 * // Generate Adomian polynomials for the sine function
 * const polynomials = await generateAdomianPolynomials((t) => Math.sin(t), 5);
 * 
 * @example
 * // Solve a fractional differential equation using LADM
 * const solution = await solveLADM({
 *   alpha: 0.5,
 *   beta: 1.0,
 *   initialCondition: (t) => t,
 *   nonlinearTerm: (u) => Math.sin(u),
 *   maxTerms: 10,
 *   timeEnd: 1,
 *   spaceEnd: 1,
 *   timeSteps: 100,
 *   spaceSteps: 100
 * });
 * 
 * @since 1.0.9
 */

const { factorial, combination } = require('../utils/mathUtils.js');
const { validatePositiveInteger, validateFunction, validateNumber } = require('../utils/validation.js');

/**
 * Generates Adomian polynomials for a given nonlinear term.
 * @async
 * @param {Function} nonlinearTerm - The nonlinear term in the differential equation.
 * @param {number} n - The number of polynomials to generate.
 * @returns {Promise<Array<Function>>} - Array of Adomian polynomials.
 * @throws {Error} If input validation fails.
 */
async function generateAdomianPolynomials(nonlinearTerm, n) {
  validateFunction(nonlinearTerm, 'nonlinearTerm');
  validatePositiveInteger(n, 'n');
  
  const polynomials = [];
  const uSeries = [async (t) => t]; // Initial condition
  
  for (let i = 0; i < n; i++) {
    polynomials.push(async (t) => {
      let sum = 0;
      for (let k = 0; k <= i; k++) {
        const u_k = await uSeries[k](t);
        const coefficient = combination(i, k);
        sum += coefficient * nonlinearTerm(u_k);
      }
      return (1 / factorial(i)) * sum;
    });
    
    // Update uSeries for the next iteration
    uSeries.push(polynomials[i]);
  }
  
  return polynomials;
}

/**
 * Solves the fractional differential equation using LADM.
 * @async
 * @param {Object} params - Solver parameters
 * @param {number} params.alpha - Fractional order of time derivative
 * @param {number} params.beta - Fractional order of space derivative
 * @param {Function} params.initialCondition - Initial condition function
 * @param {Function} params.nonlinearTerm - Nonlinear term in the equation
 * @param {number} params.maxTerms - Maximum number of terms in the series solution
 * @param {number} params.timeEnd - End time for the solution
 * @param {number} params.spaceEnd - End point in space for the solution
 * @param {number} params.timeSteps - Number of time steps
 * @param {number} params.spaceSteps - Number of space steps
 * @returns {Promise<Object>} - Solution data
 */
async function solveLADM(params) {
  try {
    validateNumber(params.alpha, 'alpha');
    validateNumber(params.beta, 'beta');
    validateFunction(params.initialCondition, 'initialCondition');
    validateFunction(params.nonlinearTerm, 'nonlinearTerm');
    validatePositiveInteger(params.maxTerms, 'maxTerms');
    validateNumber(params.timeEnd, 'timeEnd');
    validateNumber(params.spaceEnd, 'spaceEnd');
    validatePositiveInteger(params.timeSteps, 'timeSteps');
    validatePositiveInteger(params.spaceSteps, 'spaceSteps');

    const polynomials = await generateAdomianPolynomials(params.nonlinearTerm, params.maxTerms);
    const solutionData = [];

    const dt = params.timeEnd / params.timeSteps;
    const dx = params.spaceEnd / params.spaceSteps;

    for (let i = 0; i <= params.timeSteps; i++) {
      const t = i * dt;
      for (let j = 0; j <= params.spaceSteps; j++) {
        const x = j * dx;
        let value = params.initialCondition(t);
        
        for (let k = 0; k < params.maxTerms; k++) {
          value += await polynomials[k](t) * Math.pow(x, params.beta * k) / factorial(k);
        }

        solutionData.push({
          x: x,
          y: t,
          value: value
        });
      }
    }

    return {
      success: true,
      data: solutionData,
      message: 'LADM solution computed successfully.'
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: `Error in LADM solver: ${error.message}`
    };
  }
}

module.exports = {
  generateAdomianPolynomials,
  solveLADM
};
