/**
 * @module utils/validators
 * @description Provides validation functions for fractal generation parameters.
 * @since 1.0.2
 */

import { getAvailableModels, getAvailableMethods } from '../models/modelSelector.js';

/**
 * Validates parameters for fractal generation.
 * @param {Object} params - The parameters to validate.
 * @returns {{ isValid: boolean, errors: Array<string> }} Validation result.
 */
export function validateFractalParams(params) {
  const errors = [];

  // Validate model
  const availableModels = getAvailableModels();
  if (!params.model || !availableModels.includes(params.model)) {
    errors.push(`Invalid model parameter. Available models: ${availableModels.join(', ')}`);
  }

  // Validate method
  if (params.model) {
    const availableMethods = getAvailableMethods(params.model);
    if (!params.method || !availableMethods.includes(params.method)) {
      errors.push(`Invalid method parameter for model "${params.model}". Available methods: ${availableMethods.join(', ')}`);
    }
  }

  // Validate alpha
  if (typeof params.alpha !== 'number' || params.alpha <= 0 || params.alpha > 1) {
    errors.push('Alpha must be a number between 0 (exclusive) and 1 (inclusive).');
  }

  // Validate beta
  if (typeof params.beta !== 'number' || params.beta <= 0 || params.beta > 1) {
    errors.push('Beta must be a number between 0 (exclusive) and 1 (inclusive).');
  }

  // Validate maxTerms
  if (!Number.isInteger(params.maxTerms) || params.maxTerms <= 0) {
    errors.push('Max Terms must be a positive integer.');
  }

  // Validate timeSteps
  if (!Number.isInteger(params.timeSteps) || params.timeSteps <= 0) {
    errors.push('Time Steps must be a positive integer.');
  }

  // Validate timeEnd
  if (typeof params.timeEnd !== 'number' || params.timeEnd <= 0) {
    errors.push('Time End must be a positive number.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
