/**
 * @module utils/validation
 * @description Provides utility functions for validating input parameters, numerical solutions, and other data types.
 * This module is crucial for ensuring the integrity and correctness of inputs across various mathematical operations and transformations.
 * It integrates with the Logger module for improved error handling and logging.
 * 
 * Key features:
 * - Validates input parameters for fractal generation and other mathematical operations
 * - Validates numerical solutions against analytical solutions
 * - Validates various data types such as functions, numbers, strings, and arrays
 * - Logs validation errors and successes for better observability
 * - Implements custom error types for more precise error handling
 * 
 * @since 1.1.1
 * 
 * @example
 * import { validateFunction, validateNumber, validateString, validateArray, validateParameters } from './validation.js';
 * import logger from './logger.js';
 * 
 * try {
 *   validateFunction((x) => x * 2, 'Double function');
 *   validateNumber(5, 'Input parameter', 0, 10);
 *   validateString('Sierpinski', 'Fractal Type');
 *   validateArray([1, 2, 3], 'Data points', 2);
 *   validateParameters({
 *     alpha: 0.5,
 *     beta: 0.3,
 *     maxTerms: 50,
 *     fractalType: 'Mandelbrot'
 *   });
 *   logger.info('All validations passed successfully');
 * } catch (error) {
 *   logger.error('Validation error:', error);
 * }
 */

import logger from './logger.js';

/**
 * Validates if the input is a function.
 * @param {*} func - The input to validate as a function.
 * @param {string} [paramName='Function'] - The name of the function being validated.
 * @throws {TypeError} If the input is not a function.
 */
export function validateFunction(func, paramName = 'Function') {
  if (typeof func !== 'function') {
    logger.error('Invalid input: not a function', { paramName, input: func });
    throw new TypeError(`${paramName} must be a function`);
  }
  logger.debug(`${paramName} validated successfully`);
}

/**
 * Validates if the input is a number within a specified range.
 * @param {*} value - The input to validate as a number.
 * @param {string} paramName - The name of the parameter being validated.
 * @param {number} [min=Number.MIN_SAFE_INTEGER] - Minimum allowed value.
 * @param {number} [max=Number.MAX_SAFE_INTEGER] - Maximum allowed value.
 * @throws {ValidationError} If the input is not a valid number or out of range.
 */
export function validateNumber(value, paramName = 'Parameter', min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== 'number' || isNaN(value)) {
    logger.error('Invalid input: not a number', { paramName, value });
    throw new ValidationError(`${paramName} must be a valid number`);
  }
  if (value < min || value > max) {
    logger.error('Invalid input: out of range', { paramName, value, min, max });
    throw new RangeError(`${paramName} must be between ${min} and ${max}`);
  }
  logger.debug('Number validated successfully', { paramName, value });
}

/**
 * Validates a string parameter.
 * @param {string} value - The string to validate.
 * @param {string} paramName - The name of the parameter being validated.
 * @throws {ValidationError} If the input is not a non-empty string.
 */
export function validateString(value, paramName) {
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
export function validateArray(value, paramName, minLength = 0) {
  if (!Array.isArray(value) || value.length < minLength) {
    logger.error('Array validation failed', { paramName, value, minLength });
    throw new ValidationError(`${paramName} must be an array with at least ${minLength} element(s)`);
  }
  logger.debug('Array validated successfully', { paramName, arrayLength: value.length });
}

/**
 * Validates the parameters for fractal generation.
 * @param {Object} params - The parameters to validate.
 * @throws {ValidationError} If any parameter is invalid.
 */
export function validateParameters(params) {
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
 * Custom error class for validation errors.
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * Creates a new ValidationError instance.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export {
  ValidationError,
  // Removed export of built-in RangeError
};

// Added missing exports for functions
export {
  validatePositiveInteger,
  validatePositiveNumber,
  validateObject,
};
