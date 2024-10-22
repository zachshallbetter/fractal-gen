/**
 * @module utils/validation
 * @description Provides utility functions for validating input parameters, numerical solutions, and other data types.
 * This module is crucial for ensuring the integrity and correctness of inputs across various mathematical operations and transformations.
 * It integrates with the Logger module for improved error handling and logging.
 * 
 * - Validates input parameters for fractal generation and other mathematical operations
 * - Validates numerical solutions against analytical solutions
 * - Validates various data types such as functions, numbers, strings, and arrays
 * - Logs validation errors and successes for better observability
 * 
 * @since 1.1.0
 * 
 * @example
 * import { validateFunction, validateNumber, validateString, validateArray } from './validation.js';
 * import logger from './logger.js';
 * 
 * try {
 *   validateFunction((x) => x * 2);
 *   validateNumber(5, 'Input parameter', 0, 10);
 *   validateString('Sierpinski', 'Fractal Type');
 *   validateArray([1, 2, 3], 'Data points', 2);
 *   logger.info('All validations passed successfully');
 * } catch (error) {
 *   logger.error('Validation error:', error);
 * }
 */

import logger from './logger.js';

/**
 * Validates if the input is a function.
 * @param {*} func - The input to validate as a function.
 * @throws {TypeError} If the input is not a function.
 */
function validateFunction(func) {
  if (typeof func !== 'function') {
    logger.error('Invalid input: not a function', { input: func });
    throw new TypeError('Input must be a function');
  }
  logger.debug('Function validated successfully');
}

/**
 * Validates if the input is a number within a specified range.
 * @param {*} value - The input to validate as a number.
 * @param {string} paramName - The name of the parameter being validated.
 * @param {number} [min=Number.MIN_SAFE_INTEGER] - Minimum allowed value.
 * @param {number} [max=Number.MAX_SAFE_INTEGER] - Maximum allowed value.
 * @throws {ValidationError} If the input is not a valid number or out of range.
 */
function validateNumber(value, paramName = 'Parameter', min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
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
 * Validates the results of a numerical solution against an analytical solution.
 * @param {Array<{x: number, y: number}>} numericalData - Array of data points from the numerical solution.
 * @param {Function} analyticalSolution - The analytical solution function.
 * @param {Object} params - Parameters used in the analytical solution.
 * @returns {number} The maximum error between numerical and analytical solutions.
 * @throws {TypeError} If numericalData is not a non-empty array.
 */
function validateResults(numericalData, analyticalSolution, params) {
  validateFunction(analyticalSolution);
  
  if (!Array.isArray(numericalData) || numericalData.length === 0) {
    logger.error('Invalid input: numericalData must be a non-empty array', { numericalData });
    throw new TypeError('numericalData must be a non-empty array');
  }

  const errors = numericalData.map((point) => {
    validateNumber(point.x, 'x coordinate');
    validateNumber(point.y, 'y coordinate');
    const analyticalValue = analyticalSolution(point.x, params);
    return Math.abs(point.y - analyticalValue);
  });

  const maxError = Math.max(...errors);
  logger.info(`Maximum error between numerical and analytical solutions: ${maxError}`);
  return maxError;
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

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

export {
  validateFunction,
  validateNumber,
  validateResults,
  validateString,
  validateArray,
  validateParameters,
  ValidationError,
  RangeError
};
