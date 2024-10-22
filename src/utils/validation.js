/**
 * @module utils/validation
 * @description Provides functions to validate input parameters, numerical solutions, and other data types.
 * This module combines custom validation functions with re-exports from the validators module
 * for consistency and ease of use throughout the application.
 * 
 * - Validates input parameters for fractal generation
 * - Validates numerical solutions against analytical solutions
 * - Validates other data types such as strings and arrays
 * - Logs validation errors and successes for better observability
 * 
 * @example
 * import { validateParameters } from './validation.js';
 * import logger from './logger.js';
 * 
 * const params = { alpha: 0.5, beta: 0.3, maxTerms: 10, fractalType: 'Sierpinski' };
 * validateParameters(params);
 * logger.info('Parameters validated successfully');
 * 
 * @since 1.0.4
 */

import { validateFunction, validateNumber, validateResults, ValidationError, RangeError } from './validators.js';
import logger from './logger.js';

/**
 * Validates the parameters for fractal generation.
 * @param {Object} params - The parameters to validate.
 * @throws {ValidationError} If any parameter is invalid.
 */
function validateParameters(params) {
  try {
    validateNumber(params.alpha, 'Alpha', 0, 1);
    validateNumber(params.beta, 'Beta', 0, 1);
    validateNumber(params.maxTerms, 'Max Terms', 1, 100);
    validateString(params.fractalType, 'Fractal Type');
    // Add more parameter validations as needed
    logger.debug('Parameters validated successfully', { params });
  } catch (error) {
    logger.error('Parameter validation failed', { error, params });
    throw error;
  }
}

/**
 * Validates a string parameter.
 * @param {string} value - The string to validate.
 * @param {string} paramName - The name of the parameter being validated.
 * @throws {ValidationError} If the input is not a non-empty string.
 */
function validateString(value, paramName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    logger.error('String validation failed', { paramName, value });
    throw new ValidationError(`${paramName} must be a non-empty string`);
  }
  logger.debug('String validated successfully', { paramName, value });
}

/**
 * Validates an array parameter.
 * @param {Array} value - The array to validate.
 * @param {string} paramName - The name of the parameter being validated.
 * @param {number} [minLength=0] - The minimum allowed length of the array.
 * @throws {ValidationError} If the input is not an array or doesn't meet the minimum length requirement.
 */
function validateArray(value, paramName, minLength = 0) {
  if (!Array.isArray(value) || value.length < minLength) {
    logger.error('Array validation failed', { paramName, value, minLength });
    throw new ValidationError(`${paramName} must be an array with at least ${minLength} element(s)`);
  }
  logger.debug('Array validated successfully', { paramName, arrayLength: value.length });
}

export {
  validateFunction,
  validateNumber,
  validateResults,
  validateParameters,
  validateString,
  validateArray,
  ValidationError,
  RangeError
};
