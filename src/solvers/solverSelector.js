/**
 * @module solvers/solverSelector
 * @description Selects and executes the appropriate numerical solver based on user inputs.
 * Supports multiple solvers for various fractional differential equation models.
 * Ensures solvers are executed in a non-blocking manner suitable for edge environments.
 * 
 * This module achieves its intent by:
 * - Supporting multiple solvers (LADM, STADM, MHPM, Runge-Kutta, Adomian Decomposition, etc.)
 * - Providing a unified interface for solving fractional differential equations
 * - Validating solver and method selection
 * - Delegating execution to specific solver implementations
 * - Implementing robust error handling and logging
 * 
 * The implementation acts as a central hub for solver selection and execution,
 * allowing for easy integration of new solvers and maintaining a consistent API for numerical solutions.
 * 
 * @example
 * const solution = await solveFractionalDE({
 *   solver: 'LADM',
 *   model: 'fractionalSineGordon',
 *   alpha: 0.5,
 *   beta: 0.5,
 *   initialCondition: (t) => Math.sin(t),
 *   timeSteps: 100,
 *   timeEnd: 10,
 * });
 * 
 * @since 1.1.4
 */

import { ladmSolver } from './ladmSolver.js';
import { stadmSolver } from './stadmSolver.js';
import { rungeKuttaSolver } from './rungeKuttaSolver.js';
import { grunwaldLetnikovSolver } from './grunwaldLetnikovSolver.js';
import { mhpmSolver } from './mhpmSolver.js';
import logger from '../utils/logger.js';

const solverMap = {
  LADM: ladmSolver,
  STADM: stadmSolver,
  RungeKutta: rungeKuttaSolver,
  GrunwaldLetnikov: grunwaldLetnikovSolver,
  MHPM: mhpmSolver,
};

/**
 * Selects the appropriate solver based on the given method.
 * @param {string} method - The solver method to use.
 * @returns {Function} The selected solver function.
 * @throws {Error} If the solver for the specified method is not found.
 */
export function selectSolver(method) {
  const solver = solverMap[method];
  if (!solver) {
    logger.error(`Solver for method "${method}" not found.`);
    throw new Error(`Solver for method "${method}" not found.`);
  }
  logger.info(`Selected solver: ${method}`);
  return solver;
}

/**
 * Solves a fractional differential equation using the specified solver and parameters.
 * @async
 * @param {Object} params - The parameters for solving the equation.
 * @param {string} params.solver - The solver method to use.
 * @param {string} params.model - The fractional differential equation model.
 * @param {number} params.alpha - The fractional order.
 * @param {number} params.beta - The second fractional order (if applicable).
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.timeSteps - The number of time steps.
 * @param {number} params.timeEnd - The end time for the solution.
 * @param {Object} [params.options] - Additional solver-specific options.
 * @returns {Promise<Object>} The solution to the fractional differential equation.
 * @throws {Error} If there's an error during the solving process or if parameters are invalid.
 */
export async function solveFractionalDE(params) {
  try {
    // Validate input parameters
    validateSolverParams(params);

    const solver = selectSolver(params.solver);
    logger.info(`Starting solution computation using ${params.solver} for model ${params.model}`);

    const startTime = performance.now();
    const solution = await solver(params);
    const endTime = performance.now();

    const computationTime = endTime - startTime;
    logger.info(`Solution computed successfully using ${params.solver}. Computation time: ${computationTime.toFixed(2)}ms`);

    return {
      ...solution,
      metadata: {
        solver: params.solver,
        model: params.model,
        computationTime,
        params: { ...params, initialCondition: params.initialCondition.toString() }
      }
    };
  } catch (error) {
    logger.error(`Error solving fractional DE with ${params.solver}:`, error);
    throw new Error(`Failed to solve fractional DE: ${error.message}`);
  }
}

/**
 * Validates the input parameters for the fractional DE solver.
 * @param {Object} params - The parameters to validate.
 * @throws {Error} If any parameter is invalid.
 */
function validateSolverParams(params) {
  if (!params.solver || !solverMap[params.solver]) {
    throw new Error(`Invalid solver: ${params.solver}`);
  }
  if (!params.model) {
    throw new Error('Model must be specified');
  }
  if (typeof params.alpha !== 'number' || params.alpha <= 0 || params.alpha > 1) {
    throw new Error('Alpha must be a number between 0 and 1');
  }
  if (params.beta !== undefined && (typeof params.beta !== 'number' || params.beta <= 0)) {
    throw new Error('Beta, if provided, must be a positive number');
  }
  if (typeof params.initialCondition !== 'function') {
    throw new Error('Initial condition must be a function');
  }
  if (!Number.isInteger(params.timeSteps) || params.timeSteps <= 0) {
    throw new Error('Time steps must be a positive integer');
  }
  if (typeof params.timeEnd !== 'number' || params.timeEnd <= 0) {
    throw new Error('End time must be a positive number');
  }
}
