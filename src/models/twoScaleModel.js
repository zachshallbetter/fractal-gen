/**
 * @module models/twoScaleModel
 * @description Implements the Two-Scale Population Model using He-Laplace Method and Runge-Kutta Method.
 * This module provides solvers for the two-scale population model using different numerical methods.
 * Additionally, it offers customization methods for model parameters and visualization.
 * @since 1.0.3
 */

import { hesFractionalDerivative } from '../solvers/hesFractionalDerivative.js';
import { heLaplaceMethod } from '../solvers/heLaplaceMethod.js';
import { rungeKuttaSolver } from '../solvers/rungeKuttaSolver.js';

/**
 * Solves the Two-Scale Population Model using He-Laplace Method.
 * @async
 * @function
 * @param {Object} params - The parameters for the model.
 * @param {number} params.alpha - The fractional order of the derivative.
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.timeEnd - The end time for the simulation.
 * @param {number} params.timeSteps - The number of time steps.
 * @returns {Promise<Array<{x: number, y: number}>>} The solution data points.
 */
export async function solveHeLaplace(params) {
  const fractionalDE = (t, y) => hesFractionalDerivative(y, params.alpha, t) + y(t);
  const solution = heLaplaceMethod(fractionalDE, params.initialCondition);

  const data = [];
  const dt = params.timeEnd / params.timeSteps;
  for (let i = 0; i <= params.timeSteps; i++) {
    const t = i * dt;
    data.push({ x: t, y: solution(t) });
  }

  return data;
}

/**
 * Solves the Two-Scale Population Model using Runge-Kutta Method.
 * @async
 * @function
 * @param {Object} params - The parameters for the model.
 * @param {number} params.alpha - The fractional order of the derivative.
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.timeEnd - The end time for the simulation.
 * @param {number} params.timeSteps - The number of time steps.
 * @returns {Promise<Array<{x: number, y: number}>>} The solution data points.
 */
export async function solveRungeKutta(params) {
  const fractionalDE = (t, y) => hesFractionalDerivative(y, params.alpha, t) + y(t);
  const solution = rungeKuttaSolver(fractionalDE, params.initialCondition, params.timeEnd, params.timeSteps);

  return solution.map((point, index) => ({
    x: (index * params.timeEnd) / params.timeSteps,
    y: point
  }));
}

/**
 * Customizes the model parameters for the Two-Scale Population Model.
 * This method allows for adjusting the model parameters before solving.
 * @param {Object} params - The parameters to customize.
 * @param {number} [params.alpha=1] - The fractional order of the derivative.
 * @param {Function} [params.initialCondition=Math.sin] - The initial condition function.
 * @param {number} [params.timeEnd=10] - The end time for the simulation.
 * @param {number} [params.timeSteps=100] - The number of time steps.
 * @returns {Object} The customized parameters.
 */
export function customizeModelParams(params = {}) {
  const defaultParams = {
    alpha: 1,
    initialCondition: Math.sin,
    timeEnd: 10,
    timeSteps: 100
  };

  return {
    ...defaultParams,
    ...params
  };
}

/**
 * Generates a visualization-ready dataset for the Two-Scale Population Model.
 * This method prepares the solution data points for visualization by adding additional properties.
 * @param {Array<{x: number, y: number}>} data - The solution data points.
 * @returns {Array<{x: number, y: number, label: string}>} The visualization-ready dataset.
 */
export function prepareVisualizationData(data) {
  return data.map((point, index) => ({
    ...point,
    label: `Point ${index + 1}`
  }));
}

/**
 * Customizes the initial condition for the Two-Scale Population Model.
 * This method allows for specifying a custom initial condition function.
 * @param {Function} initialCondition - The custom initial condition function.
 * @returns {Function} The custom initial condition function.
 */
export function setInitialCondition(initialCondition) {
  return initialCondition;
}

/**
 * Customizes the fractional order of the derivative for the Two-Scale Population Model.
 * This method allows for specifying a custom fractional order.
 * @param {number} alpha - The custom fractional order.
 * @returns {number} The custom fractional order.
 */
export function setFractionalOrder(alpha) {
  return alpha;
}

/**
 * Customizes the time parameters for the Two-Scale Population Model.
 * This method allows for specifying custom time parameters.
 * @param {number} timeEnd - The custom end time for the simulation.
 * @param {number} timeSteps - The custom number of time steps.
 * @returns {Object} The custom time parameters.
 */
export function setTimeParams(timeEnd, timeSteps) {
  return { timeEnd, timeSteps };
}

/**
 * Retrieves the available methods for solving the Two-Scale Population Model.
 * This function returns an array of strings representing the names of the available methods.
 * @function
 * @returns {Array<string>} An array of available method names.
 * @since 1.0.0
 */
export function getAvailableMethods() {
    return ['heLaplace', 'rungeKutta'];
}

/**
 * Object containing the various methods for the Two-Scale Population Model.
 * This object provides access to solvers, customization methods, and visualization preparation.
 * @type {Object.<string, Function>}
 */
export const modelMethods = {
  getAvailableMethods: getAvailableMethods,
  heLaplace: solveHeLaplace,
  rungeKutta: solveRungeKutta,
  customizeModelParams: customizeModelParams,
  prepareVisualizationData: prepareVisualizationData,
  setInitialCondition: setInitialCondition,
  setFractionalOrder: setFractionalOrder,
  setTimeParams: setTimeParams
};
