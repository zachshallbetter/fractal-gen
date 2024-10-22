/**
 * @module utils/validation
 * @description Provides functions to validate numerical solutions against analytical solutions.
 * This module re-exports validation functions from the validators module for consistency and ease of use.
 * 
 * @since 1.0.3
 */

import { validateFunction, validateNumber, validateResults, ValidationError, RangeError } from './validators.js';

/**
 * Validates the parameters for fractal generation.
 * @param {Object} params - The parameters to validate.
 * @throws {ValidationError} If any parameter is invalid.
 */
function validateParameters(params) {
  validateNumber(params.alpha, 'Alpha', 0, 1);
  validateNumber(params.beta, 'Beta', 0, 1);
  validateNumber(params.maxTerms, 'Max Terms', 1, 100);
  // Add more parameter validations as needed
}

/**
 * Validates a string parameter.
 * @param {string} value - The string to validate.
 * @param {string} paramName - The name of the parameter being validated.
 * @throws {ValidationError} If the input is not a non-empty string.
 */
function validateString(value, paramName) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new ValidationError(`${paramName} must be a non-empty string`);
  }
}

export { validateFunction, validateNumber, validateResults, validateParameters, validateString, ValidationError, RangeError };
