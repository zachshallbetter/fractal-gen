/**
 * @module solvers/inverseAdomianDecomposition
 * @description Implements the Inverse Adomian Decomposition Method for reconstructing nonlinear differential equations from their solutions.
 * Optimized for non-blocking computation in edge environments.
 * 
 * The Inverse Adomian Decomposition Method (IADM) is a technique for reconstructing nonlinear differential equations
 * from their known solutions. It reverses the process of the Adomian Decomposition Method, allowing for the inference
 * of the original equation given a set of solution data.
 * 
 * This module provides the following key functionalities:
 * - Reconstructs nonlinear terms in differential equations from solution data.
 * - Implements the Inverse Laplace-Adomian Decomposition Method (ILADM) for fractional differential equations.
 * - Offers utility functions for mathematical operations and validation.
 * - Generates reconstructed equation data for analysis purposes.
 * 
 * The implementation is designed to be efficient and suitable for edge computing environments, 
 * utilizing asynchronous operations and parallel computation where possible to ensure non-blocking execution.
 * 
 * @example
 * // Reconstruct a nonlinear term from solution data
 * const reconstructedTerm = await reconstructNonlinearTerm(solutionData, 5);
 * 
 * @example
 * // Solve the inverse problem for a fractional differential equation using ILADM
 * const reconstructedEquation = await solveILADM({
 *   alpha: 0.5,
 *   beta: 1.0,
 *   solutionData: [...],
 *   maxTerms: 10,
 *   timeEnd: 1,
 *   spaceEnd: 1,
 *   timeSteps: 100,
 *   spaceSteps: 100
 * });
 * 
 * @since 1.1.0
 */

import { math, gammaFunction, max } from '../utils/mathUtils.js';
import { validateFunction, validateNumber, validateArray, validatePositiveInteger } from '../utils/validation.js';
import { reverseEngineer } from '../utils/reverseEngineering.js';
import logger from '../utils/logger.js';
import { inverseLaplaceTransform } from './inverseLaplaceTransform.js';
import { inverseShehuTransform } from './inverseShehuTransform.js';

/**
 * Reconstructs the nonlinear term of a differential equation from solution data.
 * @async
 * @param {Array<{x: number, y: number, value: number}>} solutionData - The solution data points.
 * @param {number} n - The number of terms to use in the reconstruction.
 * @returns {Promise<Function>} - The reconstructed nonlinear term as a function.
 * @throws {Error} If input validation fails.
 */
async function reconstructNonlinearTerm(solutionData, n) {
  try {
    validateArray(solutionData, 'solutionData');
    validatePositiveInteger(n, 'n');
    
    const reconstructedTerms = [];
    
    for (let i = 0; i < n; i++) {
      const term = await reverseEngineer(solutionData, { a: 1, b: 1 });
      reconstructedTerms.push(term.inferredParams);
    }
    
    logger.info(`Reconstructed ${n} terms of the nonlinear function successfully`);
    
    return function(u) {
      return reconstructedTerms.reduce((sum, term, index) => {
        return sum + term.a * Math.pow(u, index) + term.b;
      }, 0);
    };
  } catch (error) {
    logger.error('Error in reconstructing nonlinear term', error);
    throw error;
  }
}

/**
 * Solves the inverse problem for a fractional differential equation using ILADM.
 * @async
 * @param {Object} params - Solver parameters
 * @param {number} params.alpha - Fractional order of time derivative
 * @param {number} params.beta - Fractional order of space derivative
 * @param {Array<{x: number, y: number, value: number}>} params.solutionData - Solution data points
 * @param {number} params.maxTerms - Maximum number of terms in the reconstruction
 * @param {number} params.timeEnd - End time for the solution
 * @param {number} params.spaceEnd - End point in space for the solution
 * @param {number} params.timeSteps - Number of time steps
 * @param {number} params.spaceSteps - Number of space steps
 * @returns {Promise<Object>} - Reconstructed equation data
 */
async function solveILADM(params) {
  try {
    validateNumber(params.alpha, 'alpha', 0, 1);
    validateNumber(params.beta, 'beta', 0, 2);
    validateArray(params.solutionData, 'solutionData');
    validatePositiveInteger(params.maxTerms, 'maxTerms');
    validateNumber(params.timeEnd, 'timeEnd', 0);
    validateNumber(params.spaceEnd, 'spaceEnd', 0);
    validatePositiveInteger(params.timeSteps, 'timeSteps');
    validatePositiveInteger(params.spaceSteps, 'spaceSteps');

    logger.info('Starting ILADM solver', { params });

    const reconstructedTerm = await reconstructNonlinearTerm(params.solutionData, params.maxTerms);
    
    // Perform inverse Laplace transform
    const inverseL = await inverseLaplaceTransform(reconstructedTerm);
    
    // Perform inverse Shehu transform
    const inverseS = await inverseShehuTransform(inverseL);
    
    const reconstructedEquation = {
      timeFractionalOrder: params.alpha,
      spaceFractionalOrder: params.beta,
      nonlinearTerm: reconstructedTerm,
      inverseLaplace: inverseL,
      inverseShehu: inverseS
    };

    logger.info('ILADM reconstruction completed successfully');
    return {
      success: true,
      data: reconstructedEquation,
      message: 'ILADM reconstruction completed successfully.'
    };
  } catch (error) {
    logger.error('Error in ILADM solver', error);
    return {
      success: false,
      data: null,
      message: `Error in ILADM solver: ${error.message}`
    };
  }
}

export { reconstructNonlinearTerm, solveILADM };
