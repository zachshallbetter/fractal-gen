/**
 * @module utils/sobolSequence
 * @description Generates Sobol sequences for variance reduction in Monte Carlo methods.
 * This module implements:
 * - Generation of Sobol sequences
 * - Scrambling of Sobol sequences for improved uniformity
 * - Utility functions for working with low-discrepancy sequences
 * 
 * Sobol sequences are a type of low-discrepancy sequence used to generate
 * quasi-random numbers. They are particularly useful for variance reduction
 * in Monte Carlo simulations and numerical integration.
 * 
 * The implementation of the Sobol sequence generation is based on the paper:
 * "On the construction of sequences of low-discrepancy numbers" by Antonov and Saleev.
 * 
 * @example
 * import { generateSobolSequence, scrambleSobolSequence } from './utils/sobolSequence.js';
 * 
 * // Generate a Sobol sequence
 * const dimension = 2;
 * const numPoints = 1000;
 * const sobolSequence = generateSobolSequence(dimension, numPoints);
 * 
 * // Scramble the Sobol sequence
 * const scrambledSequence = scrambleSobolSequence(sobolSequence);
 * 
 * @see {@link https://www.mdpi.com/2227-7390/8/4/522|Variance Reduction of Sequential Monte Carlo Approach}
 * for more information on using Sobol sequences for variance reduction.
 * 
 * @since 1.2.1
 */

import { validatePositiveInteger } from './validation.js';
import logger from './logger.js';
import { math, mod, max } from './mathUtils.js';

const DIRECTION_NUMBERS = [
  // Direction numbers for dimensions 1-6 (add more as needed)
  [1],
  [1, 3],
  [1, 3, 5],
  [1, 1, 7],
  [1, 3, 1, 15],
  [1, 1, 5, 5, 21]
];

/**
 * Generates a Sobol sequence.
 * @param {number} dimension - The dimension of the Sobol sequence.
 * @param {number} numPoints - The number of points to generate.
 * @returns {number[][]} - The generated Sobol sequence.
 * @throws {Error} If inputs are invalid or generation fails.
 */
export function generateSobolSequence(dimension, numPoints) {
  validatePositiveInteger(dimension, 'Dimension');
  validatePositiveInteger(numPoints, 'Number of points');

  try {
    logger.info('Generating Sobol sequence', { dimension, numPoints });
    const sequence = [];
    const directionVectors = DIRECTION_NUMBERS.slice(0, dimension).map(computeDirectionVector);

    for (let i = 0; i < numPoints; i++) {
      const point = generateSobolPoint(i, directionVectors);
      sequence.push(point);
    }

    logger.info('Sobol sequence generated successfully');
    return sequence;
  } catch (error) {
    logger.error('Sobol sequence generation failed:', error);
    throw new Error(`Sobol sequence generation failed: ${error.message}`);
  }
}

/**
 * Computes direction vectors for Sobol sequence generation.
 * @param {number[]} directionNumbers - Direction numbers for a dimension.
 * @returns {number[]} - Computed direction vector.
 */
function computeDirectionVector(directionNumbers) {
  return directionNumbers.map((num, i) => num / (1 << (i + 1)));
}

/**
 * Generates a single point in the Sobol sequence.
 * @param {number} index - The index of the point in the sequence.
 * @param {number[][]} directionVectors - Direction vectors for each dimension.
 * @returns {number[]} - A single point in the Sobol sequence.
 */
function generateSobolPoint(index, directionVectors) {
  return directionVectors.map(vector => {
    let x = 0;
    for (let i = 0; i < 32; i++) {
      if ((index & (1 << i)) !== 0) {
        x ^= vector[i];
      }
    }
    return x;
  });
}

/**
 * Scrambles a Sobol sequence for improved uniformity.
 * @param {number[][]} sequence - The Sobol sequence to scramble.
 * @returns {number[][]} - The scrambled Sobol sequence.
 * @throws {Error} If scrambling fails.
 */
export function scrambleSobolSequence(sequence) {
  try {
    logger.info('Scrambling Sobol sequence', { sequenceLength: sequence.length });
    const scrambledSequence = sequence.map(point => 
      point.map(value => mod(value + math.random(), 1))
    );
    logger.info('Sobol sequence scrambled successfully');
    return scrambledSequence;
  } catch (error) {
    logger.error('Sobol sequence scrambling failed:', error);
    throw new Error(`Sobol sequence scrambling failed: ${error.message}`);
  }
}

/**
 * Computes the discrepancy of a given sequence.
 * @param {number[][]} sequence - The sequence to evaluate.
 * @returns {number} - The computed discrepancy.
 * @throws {Error} If computation fails.
 */
export function computeDiscrepancy(sequence) {
  try {
    logger.info('Computing discrepancy of sequence', { sequenceLength: sequence.length });
    const n = sequence.length;
    const d = sequence[0].length;
    
    let sum = 0;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        let prod = 1;
        for (let k = 0; k < d; k++) {
          prod *= (1 - max(sequence[i][k], sequence[j][k]));
        }
        sum += prod;
      }
    }
    
    const discrepancy = math.sqrt((13/12)**d - (2/n) * sum + 1/n);
    logger.info('Discrepancy computed successfully', { discrepancy });
    return discrepancy;
  } catch (error) {
    logger.error('Discrepancy computation failed:', error);
    throw new Error(`Discrepancy computation failed: ${error.message}`);
  }
}

export { generateSobolSequence, scrambleSobolSequence, computeDiscrepancy };
