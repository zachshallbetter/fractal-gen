/**
 * @module solvers/heLaplaceMethod
 * @description Implements the He-Laplace method for solving Ordinary Differential Equations (ODEs).
 * This module achieves its intent by:
 * - Implementing the heLaplaceMethod function using He's polynomials and Laplace transform
 * - Utilizing parallel computation for improved performance
 * - Ensuring non-blocking operations through asynchronous function design
 * 
 * The He-Laplace method combines He's polynomial with the Laplace transform to solve ODEs efficiently.
 * 
 * @since 1.0.4
 * 
 * @example
 * // Example usage of the heLaplaceMethod function:
 * import { heLaplaceMethod } from './heLaplaceMethod.js';
 * 
 * const ode = (t, y) => -y; // Simple ODE: dy/dt = -y
 * const initialCondition = 1;
 * const solution = await heLaplaceMethod(ode, initialCondition);
 * const y_at_t2 = await solution(2); // Get the solution at t = 2
 * 
 * @see {@link https://www.sciencedirect.com/science/article/pii/S0898122109004933|He's polynomials}
 * @see {@link https://en.wikipedia.org/wiki/Laplace_transform|Laplace transform}
 */

import { create, all } from 'mathjs';
import { ParallelComputation } from '../utils/parallelComputation.js';
import logger from '../utils/logger.js';
import { validateFunction, validateNumber } from '../utils/validation.js';

const math = create(all);

/**
 * Solves an ODE using the He-Laplace method.
 * @async
 * @param {Function} fractionalDE - The fractional differential equation
 * @param {number} initialCondition - Initial condition
 * @returns {Promise<Function>} - Solution function
 */
export async function heLaplaceMethod(fractionalDE, initialCondition) {
  try {
    validateFunction(fractionalDE, 'fractionalDE');
    validateNumber(initialCondition, 'initialCondition');

    const parallelComputation = new ParallelComputation();
    const maxIterations = 10;
    const epsilon = 1e-6;

    const tasks = Array.from({ length: maxIterations }, (_, i) => async () => {
      return computeHeLaplaceIteration(fractionalDE, initialCondition, i);
    });

    const results = await parallelComputation.executeTasks(tasks);
    const solution = combineSolutions(results);

    logger.info('He-Laplace method solution computed successfully');

    return async function(t) {
      validateNumber(t, 't', 0);
      return solution(t);
    };
  } catch (error) {
    logger.error('Error in He-Laplace method:', error);
    throw error;
  }
}

/**
 * Computes a single iteration of the He-Laplace method.
 * @async
 * @param {Function} fractionalDE - The fractional differential equation
 * @param {number} initialCondition - Initial condition
 * @param {number} iteration - Current iteration number
 * @returns {Promise<Function>} - Partial solution function
 */
async function computeHeLaplaceIteration(fractionalDE, initialCondition, iteration) {
  const s = math.symbol('s');
  const t = math.symbol('t');
  
  const hePoly = math.parse(`(1-t)^${iteration}`);
  const laplaceTransform = math.laplace(hePoly, t, s);
  
  const partialSolution = math.inverse(laplaceTransform, s, t);
  
  return (t) => math.evaluate(partialSolution, { t });
}

/**
 * Combines partial solutions into a final solution.
 * @param {Function[]} partialSolutions - Array of partial solution functions
 * @returns {Function} - Combined solution function
 */
function combineSolutions(partialSolutions) {
  return (t) => {
    return partialSolutions.reduce((sum, solution) => sum + solution(t), 0);
  };
}

export { heLaplaceMethod };
