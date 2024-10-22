/**
 * @module models/twoScaleModel
 * @description Implements the Two-Scale Population Model using various numerical methods.
 * @since 1.0.14
 */

import { rungeKuttaSolver } from '../solvers/rungeKuttaSolver.js';
import { validateParameters } from '../utils/validation.js';

/**
 * Defines the ODE for the Two-Scale Population Model.
 * @param {number} t - Time variable.
 * @param {number} y - Population at time t.
 * @param {Object} params - Model parameters.
 * @returns {number} The derivative dy/dt.
 */
function twoScalePopulationModel(t, y, params) {
  const { growthRate, carryingCapacity } = params;
  return growthRate * y * (1 - y / carryingCapacity);
}

/**
 * Solves the Two-Scale Population Model using the specified numerical method.
 * @async
 * @param {Object} params - Parameters for the solver.
 * @returns {Promise<Array<{ t: number, y: number }>>} - Solution data points.
 * @since 1.0.14
 */
async function solveTwoScaleModel(params) {
  validateParameters(params);

  const solverParams = {
    f: twoScalePopulationModel,
    t0: params.t0 || 0,
    y0: params.y0 || 10,
    h: params.h || 0.1,
    steps: params.steps || 100,
    params,
  };

  const solution = await rungeKuttaSolver(solverParams);
  return solution;
}

export { solveTwoScaleModel };
