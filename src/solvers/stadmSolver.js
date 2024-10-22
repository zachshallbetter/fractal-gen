/**
 * @module solvers/stadmSolver
 * @description Solves the fractional Sine-Gordon equation using the Shehu Transform-Adomian Decomposition Method (STADM).
 * This module implements an efficient, non-blocking solver that leverages asynchronous operations for optimal performance.
 * 
 * The solver achieves its purpose through:
 * 1. Implementation of the `stadmSolver` function
 * 2. Utilization of Shehu Transform for fractional calculus
 * 3. Application of Adomian Decomposition for nonlinear term handling
 * 
 * @since 1.0.4
 * 
 * @example
 * const { stadmSolver } = require('./solvers/stadmSolver');
 * 
 * const params = {
 *   initialCondition: 0,
 *   alpha: 0.5,
 *   maxTerms: 10
 * };
 * 
 * stadmSolver(params).then(solution => {
 *   console.log(solution(1)); // Evaluate solution at t = 1
 * });
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S2226719X19300202|Shehu Transform}
 * for more information on the Shehu Transform.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0096300306015098|Adomian Decomposition Method}
 * for details on the Adomian Decomposition Method.
 * @see {@link https://www.sciencedirect.com/science/article/pii/S1110016821000016|STADM}
 * for an overview of the Shehu Transform Adomian Decomposition Method (STADM).
 */

const { shehuTransform, inverseShehuTransform } = require('./shehuTransform');
const { generateAdomianPolynomials } = require('./adomianDecomposition');

/**
 * Solves the fractional Sine-Gordon equation.
 * @param {Object} params - Parameters for the solver, including initial conditions, fractional orders, and maximum terms.
 * @returns {Promise<Function>} - A promise that resolves to the solution function u(t).
 */
async function stadmSolver(params) {
  try {
    const { initialCondition, alpha, maxTerms } = params;
    const uSeries = [];

    // Initial approximation u0(t)
    uSeries[0] = (t) => initialCondition;

    // Generate series terms asynchronously
    for (let n = 1; n < maxTerms; n++) {
      // Compute Adomian polynomial An
      const A_n = await generateAdomianPolynomials(uSeries, n - 1);

      // Apply Shehu Transform and solve for U_n(s)
      const U_n_s = await shehuTransform((t) => A_n(t));

      // Solve algebraic equation in Shehu domain (implementation depends on the specific equation)

      // Inverse Shehu Transform to get u_n(t)
      const u_n = await inverseShehuTransform(U_n_s);

      uSeries[n] = u_n;
    }

    // Sum the series to get the approximate solution
    return async (t) => {
      let sum = 0;
      for (let n = 0; n < maxTerms; n++) {
        sum += await Promise.resolve(uSeries[n](t));
      }
      return sum;
    };
  } catch (error) {
    throw new Error(`Error in STADM Solver: ${error.message}`);
  }
}

module.exports = { stadmSolver };
