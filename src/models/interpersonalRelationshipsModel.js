/**
 * @module models/interpersonalRelationshipsModel
 * @description Solves the fractal–fractional interpersonal relationships model using Lagrangian polynomial interpolation.
 * 
 * This model solves the fractal-fractional interpersonal relationships model using Lagrangian polynomial interpolation. It achieves its intent by:
 * - Utilizing a fractal-fractional solver for complex dynamics
 * - Setting up model parameters including fractional orders (alpha, gamma) and kernel function
 * - Returning the solution as data points representing relationship dynamics over time
 * - Implementing robust error handling and logging
 * - Validating input parameters
 * - Leveraging parallel computation for improved performance
 * 
 * The implementation leverages fractal-fractional calculus to capture the intricate and potentially chaotic nature
 * of interpersonal relationships, allowing for more nuanced modeling of human interactions.
 * 
 * @example
 * import { solve } from './interpersonalRelationshipsModel.js';
 * 
 * const data = await solve({
 *   alpha: 0.5,
 *   gamma: 0.5,
 *   kernel: (t) => Math.sin(t),
 *   initialCondition: (t) => Math.sin(t),
 *   timeSteps: 100,
 *   timeEnd: 10,
 * });
 * 
 * @since 1.0.5
 */

import { fractalFractionalSolver } from '../solvers/fractalFractionalSolver.js';
import { validateParameters, validateNumber, validateFunction } from '../utils/validation.js';
import logger from '../utils/logger.js';
import { ParallelComputation } from '../utils/parallelComputation.js';
import { createInteractivePlot, generateFractalImage } from '../utils/visualization.js';

/**
 * Solves the interpersonal relationships model using Lagrangian polynomial interpolation.
 * @async
 * @param {Object} params - The parameters for the model.
 * @param {number} params.alpha - Fractional order (typically time-related).
 * @param {number} params.gamma - Additional fractional dimension.
 * @param {Function} params.kernel - Kernel function for the model.
 * @param {Function} params.initialCondition - Initial condition function.
 * @param {number} params.timeSteps - Number of time steps.
 * @param {number} params.timeEnd - End time for the simulation.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 * @throws {Error} If parameter validation fails or if there's an error during solving.
 */
async function solve(params) {
  try {
    validateParameters(params);
    validateNumber(params.alpha, 'Alpha', 0, 1);
    validateNumber(params.gamma, 'Gamma', 0, 1);
    validateFunction(params.kernel, 'Kernel');
    validateFunction(params.initialCondition, 'Initial Condition');
    validateNumber(params.timeSteps, 'Time Steps', 1);
    validateNumber(params.timeEnd, 'Time End', 0);

    const modelParams = {
      alpha: params.alpha,
      gamma: params.gamma,
      kernel: params.kernel,
      initialCondition: params.initialCondition,
      N: params.timeSteps,
      T: params.timeEnd,
    };

    logger.info('Solving interpersonal relationships model', { params: modelParams });

    const parallelComputation = new ParallelComputation();
    const [data] = await parallelComputation.executeTasks([
      () => fractalFractionalSolver(modelParams)
    ]);

    logger.info('Interpersonal relationships model solved successfully');

    // Generate visualizations
    await createInteractivePlot(data, params);
    await generateFractalImage(data, params);

    return data;
  } catch (error) {
    logger.error('Error solving interpersonal relationships model', error, { params });
    throw error;
  }
}

export { solve };
