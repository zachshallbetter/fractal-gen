/**
 * @module solvers/solverSelector
 * @description Selects and executes the appropriate numerical solver based on user inputs.
 * Supports multiple solvers for various fractional differential equation models.
 * Ensures solvers are executed in a non-blocking manner suitable for edge environments.
 * 
 * This module achieves its intent by:
 * - Supporting multiple solvers (LADM, STADM, MHPM, Runge-Kutta, etc.)
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
 * @since 1.1.0
 */

import { ladmSolver } from './ladmSolver.js';
import { stadmSolver } from './stadmSolver.js';
import { mhpmSolver } from './mhpmSolver.js';
import { rungeKuttaSolver } from './rungeKuttaSolver.js';
import { validateParameters, validateString } from '../utils/validation.js';
import logger from '../utils/logger.js';

/**
 * Map of solvers to their implementations.
 */
const solverImplementations = {
  LADM: ladmSolver,
  STADM: stadmSolver,
  MHPM: mhpmSolver,
  RungeKutta: rungeKuttaSolver,
  // ... other solvers ...
};

/**
 * Solves a fractional differential equation using the selected solver.
 * @async
 * @param {Object} params - The parameters for solving the equation.
 * @param {string} params.solver - The numerical solver to use.
 * @param {string} params.model - The fractional differential equation model.
 * @param {number} params.alpha - Fractional order (typically time-related).
 * @param {number} [params.beta] - Fractional order (typically space-related, if applicable).
 * @param {Function} params.initialCondition - Initial condition function.
 * @param {number} params.timeSteps - Number of time steps.
 * @param {number} params.timeEnd - End time for the solution.
 * @returns {Promise<Array<{ t: number, u: number }>>} - An array of solution points.
 * @throws {Error} If the solver is not recognized or if parameter validation fails.
 */
async function solveFractionalDE(params) {
  try {
    validateParameters(params);
    validateString(params.solver, 'Solver');
    validateString(params.model, 'Model');

    const { solver } = params;

    if (!solverImplementations[solver]) {
      throw new Error(`Solver "${solver}" is not supported.`);
    }

    const solverFunction = solverImplementations[solver];

    logger.info(`Solving fractional DE using ${solver} solver for ${params.model} model`, { params });
    const solution = await solverFunction(params);
    logger.info(`Fractional DE solution completed successfully`, { solver, model: params.model });
    return solution;
  } catch (error) {
    logger.error('Error solving fractional DE', error, { params });
    throw error;
  }
}

/**
 * Returns an array of available solver names.
 * @returns {string[]} Array of solver names.
 */
function getAvailableSolvers() {
  const solvers = Object.keys(solverImplementations);
  logger.debug('Retrieved available solvers', { solvers });
  return solvers;
}

export { solveFractionalDE, getAvailableSolvers };
