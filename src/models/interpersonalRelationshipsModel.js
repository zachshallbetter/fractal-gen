/**
 * @module models/interpersonalRelationshipsModel
 * @description Models the dynamics of interpersonal relationships using fractional differential equations.
 * Implements methods like Modified Homotopy Perturbation Method (MHPM) for solving the model equations.
 *
 * This module achieves its intent by:
 * - Defining equations that represent interpersonal relationship dynamics with fractional orders
 * - Implementing the MHPM for efficient and accurate solutions
 * - Allowing customization of parameters including `alpha`, `gamma`, and simulation time
 * - Providing output compatible with visualization components
 *
 * @since 1.0.1
 */

import { fractalFractionalSolver } from '../solvers/fractalFractionalSolver.js';

/**
 * Solves the fractal–fractional interpersonal relationships model using Lagrangian polynomial interpolation.
 * This method leverages the {@fractalFractionalSolver} to compute the solution data points.
 * @async
 * @param {Object} params - The parameters for the model.
 * @param {number} params.alpha - The fractional order of the derivative.
 * @param {number} params.gamma - The gamma parameter for the model.
 * @param {Function} params.kernel - The kernel function for the model.
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.timeSteps - The number of time steps.
 * @param {number} params.timeEnd - The end time for the simulation.
 * @returns {Promise<Array<{x: number, y: number}>>} The solution data points.
 */
export async function solveInterpersonalRelationships(params) {
  // Set up model parameters
  const modelParams = {
    alpha: params.alpha,
    gamma: params.gamma,
    kernel: params.kernel,
    initialCondition: params.initialCondition,
    N: params.timeSteps,
    T: params.timeEnd,
  };

  // Solve using the {@fractalFractionalSolver}
  const data = await fractalFractionalSolver(modelParams);

  return data;
}

/**
 * Custom method to generate a detailed report of the model's parameters and solution.
 * This method is designed to provide a comprehensive overview of the model's configuration and results.
 * @async
 * @param {Object} params - The parameters for the model.
 * @returns {Promise<{report: string, data: Array<{x: number, y: number}>}>} The report and solution data points.
 */
export async function generateReport(params) {
  const data = await solveInterpersonalRelationships(params);
  const report = `Model Parameters:
  Alpha: ${params.alpha}
  Gamma: ${params.gamma}
  Time Steps: ${params.timeSteps}
  Time End: ${params.timeEnd}
  Solution Data Points: ${data.length} points`;

  return { report, data };
}


/**
 * Customizes the model parameters for the fractal–fractional interpersonal relationships model.
 * This method allows for adjusting the model parameters before solving.
 * @param {Object} params - The parameters to customize.
 * @param {number} [params.alpha=1] - The fractional order of the derivative.
 * @param {number} [params.gamma=1] - The gamma parameter for the model.
 * @param {Function} [params.kernel=Math.sin] - The kernel function for the model.
 * @param {Function} [params.initialCondition=Math.cos] - The initial condition function.
 * @param {number} [params.timeSteps=100] - The number of time steps.
 * @param {number} [params.timeEnd=10] - The end time for the simulation.
 * @returns {Object} The customized parameters.
 */
export function customizeModelParams(params = {}) {
  const defaultParams = {
    alpha: 1,
    gamma: 1,
    kernel: Math.sin,
    initialCondition: Math.cos,
    timeSteps: 100,
    timeEnd: 10
  };

  return {
    ...defaultParams,
    ...params
  };
}

/**
 * Customizes the kernel function for the fractal–fractional interpersonal relationships model.
 * This method allows for adjusting the kernel function before solving.
 * @param {Function} kernel - The kernel function to use.
 * @returns {Function} The customized kernel function.
 */
export function customizeKernel(kernel = Math.sin) {
  return kernel;
}

/**
 * Customizes the initial condition function for the fractal–fractional interpersonal relationships model.
 * This method allows for adjusting the initial condition function before solving.
 * @param {Function} initialCondition - The initial condition function to use.
 * @returns {Function} The customized initial condition function.
 */
export function customizeInitialCondition(initialCondition = Math.cos) {
  return initialCondition;
}

/**
 * Retrieves the available methods for solving the fractal–fractional interpersonal relationships model.
 * This function returns an array of strings representing the names of the available methods.
 * @function
 * @returns {Array<string>} An array of available method names.
 * @since 1.0.0
 */
export function getAvailableMethods() {
  return ['FractalFractional', 'GenerateReport'];
}

/**
 * Object containing the various methods for the fractal–fractional interpersonal relationships model.
 * This object provides access to the solve method, the custom generateReport method, the getAvailableMethods function, and the customizeModelParams method.
 * @type {Object.<string, Function>}
 */
export const modelMethods = {
  getAvailableMethods: getAvailableMethods,
  solveInterpersonalRelationships: solveInterpersonalRelationships,
  generateReport: generateReport,
  customizeModelParams: customizeModelParams,
  customizeKernel: customizeKernel,
  customizeInitialCondition: customizeInitialCondition,
};
