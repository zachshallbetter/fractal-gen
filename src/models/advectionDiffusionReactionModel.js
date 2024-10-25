/**
 * @module models/advectionDiffusionReactionModel
 * @description Implements the Nonlinear Space-Time Fractal-Fractional Advection-Diffusion-Reaction Equation using various numerical methods.
 * Includes methods like LADM and STADM for solving complex fractional equations.
 * Supports high-performance computations optimized for fractal generation.
 *
 * This module achieves its intent by:
 * - Defining the advection-diffusion-reaction equations with fractal-fractional derivatives
 * - Implementing numerical solvers applicable to these equations
 * - Providing interfaces for parameter input and validation
 * - Ensuring compatibility with the visualization components
 *
 * @since 1.0.1
 */

import { generateBernsteinPolynomials } from '../solvers/bernsteinPolynomials.js';
import { generateOperationalMatrices } from '../solvers/operationalMatrices.js';
import { mhpmSolver } from '../solvers/mhpmSolver.js';
import { generateInverseBernsteinPolynomials } from '../solvers/inverseBernsteinPolynomials.js';

/**
 * Solves the fractal–fractional Advection-Diffusion-Reaction equation.
 * @async
 * @function
 * @param {Object} params - The parameters for the ADR model.
 * @param {number} params.polynomialDegree - The degree of Bernstein polynomials to use.
 * @param {number} params.timeEnd - The end time for the simulation.
 * @param {number} params.spaceEnd - The end point of the spatial domain.
 * @param {number} params.alpha - The fractional order of the time derivative.
 * @param {number} params.beta - The fractional order of the space derivative.
 * @param {number} params.gamma - The fractional order of the Caputo derivative.
 * @param {number} params.timeSteps - The number of time steps for data generation.
 * @returns {Promise<Array<{x: number, y: number}>>} The solution data points.
 */
export async function solveMHPM(params) {
  try {
    // Problem-specific parameters
    const n = params.polynomialDegree || 5;
    const T = params.timeEnd;
    const X = params.spaceEnd || 1;

    // Generate Bernstein polynomials and operational matrices
    const B_t = await generateBernsteinPolynomials(n, T);
    const B_x = await generateBernsteinPolynomials(n, X);
    const D_t = await generateOperationalMatrices('time', params.alpha, params.gamma, n);
    const D_x = await generateOperationalMatrices('space', params.beta || params.alpha, params.gamma, n);

    // Set up and solve the system using MHPM
    const solution = await mhpmSolver(B_t, B_x, D_t, D_x, params);

    // Generate data points
    const data = solution.map((value, index) => ({
      x: index * (T / params.timeSteps),
      y: value,
    }));

    return {
      success: true,
      data,
      message: 'ADR equation solved successfully.',
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      message: `Error solving ADR equation: ${error.message}`,
    };
  }
}

/**
 * Customizes the model parameters for the Advection-Diffusion-Reaction model.
 * This method allows for adjusting the model parameters before solving.
 * @param {Object} params - The parameters to customize.
 * @param {number} [params.polynomialDegree=5] - The degree of Bernstein polynomials to use.
 * @param {number} [params.timeEnd=1] - The end time for the simulation.
 * @param {number} [params.spaceEnd=1] - The end point of the spatial domain.
 * @param {number} [params.alpha=1] - The fractional order of the time derivative.
 * @param {number} [params.beta=1] - The fractional order of the space derivative.
 * @param {number} [params.gamma=1] - The fractional order of the Caputo derivative.
 * @param {number} [params.timeSteps=100] - The number of time steps for data generation.
 * @returns {Object} The customized parameters.
 */
export function customizeModelParams(params = {}) {
  const defaultParams = {
    polynomialDegree: 5,
    timeEnd: 1,
    spaceEnd: 1,
    alpha: 1,
    beta: 1,
    gamma: 1,
    timeSteps: 100
  };

  return {
    ...defaultParams,
    ...params
  };
}

/**
 * Object containing the various custom methods for the Advection-Diffusion-Reaction Model.
 * This object provides access to custom methods for solving the ADR equation using different approaches.
 * @type {Object.<string, Function>}
 */
export const modelMethods = {
  solveMHPM: solveMHPM,
  solveBernsteinPolynomials: generateBernsteinPolynomials,
  solveInverseBernsteinPolynomials: generateInverseBernsteinPolynomials,
  customizeModelParams: customizeModelParams,
};
