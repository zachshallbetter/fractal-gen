/**
 * @module utils/validators
 * @description Provides utility functions for validating input parameters and functions.
 * This module is crucial for ensuring the integrity and correctness of inputs across various mathematical operations and transformations.
 * 
 * @since 1.0.6
 * 
 * @example
 * // Example usage of validateFunction:
 * const myFunction = (x) => x * 2;
 * try {
 *   validateFunction(myFunction);
 *   console.log('Function is valid');
 * } catch (error) {
 *   console.error('Validation error:', error.message);
 * }
 * 
 * @example
 * // Example usage of validateNumber:
 * try {
 *   validateNumber(5, 'Input parameter');
 *   console.log('Number is valid');
 * } catch (error) {
 *   console.error('Validation error:', error.message);
 * }
 */

/**
 * Validates if the input is a function.
 * @param {*} func - The input to validate as a function.
 * @throws {TypeError} If the input is not a function.
 */
function validateFunction(func) {
  if (typeof func !== 'function') {
    throw new TypeError('Input must be a function');
  }
}

/**
 * Validates if the input is a number.
 * @param {*} value - The input to validate as a number.
 * @param {string} paramName - The name of the parameter being validated.
 * @param {number} [min=Number.MIN_SAFE_INTEGER] - Minimum allowed value.
 * @param {number} [max=Number.MAX_SAFE_INTEGER] - Maximum allowed value.
 * @throws {ValidationError} If the input is not a valid number or out of range.
 */
function validateNumber(value, paramName = 'Parameter', min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError(`${paramName} must be a valid number`);
  }
  if (value < min || value > max) {
    throw new RangeError(`${paramName} must be between ${min} and ${max}`);
  }
}

/**
 * Validates the results of a numerical solution against an analytical solution.
 * @param {Array<{x: number, y: number}>} numericalData - Array of data points from the numerical solution.
 * @param {Function} analyticalSolution - The analytical solution function.
 * @param {Object} params - Parameters used in the analytical solution.
 * @returns {number} The maximum error between numerical and analytical solutions.
 */
function validateResults(numericalData, analyticalSolution, params) {
  validateFunction(analyticalSolution);
  
  if (!Array.isArray(numericalData) || numericalData.length === 0) {
    throw new TypeError('numericalData must be a non-empty array');
  }

  const errors = numericalData.map((point) => {
    validateNumber(point.x, 'x coordinate');
    validateNumber(point.y, 'y coordinate');
    const analyticalValue = analyticalSolution(point.x, params);
    return Math.abs(point.y - analyticalValue);
  });

  const maxError = Math.max(...errors);
  console.log(`Maximum error between numerical and analytical solutions: ${maxError}`);
  return maxError;
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class RangeError extends ValidationError {
  constructor(message) {
    super(message);
    this.name = 'RangeError';
  }
}

export { validateFunction, validateNumber, validateResults, ValidationError, RangeError };
