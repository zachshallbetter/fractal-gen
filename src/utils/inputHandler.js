/**
 * @module utils/inputHandler
 * @description Parses and validates user inputs from command-line arguments using yargs.
 * Ensures comprehensive parameter definition and documentation for all models and methods.
 * Optimized to prevent blocking operations and validate inputs effectively.
 * Integrates with validation, parallel computation, output handling, and model selection modules.
 * 
 * - Handles input parsing and validation for various fractal generation models and methods
 * - Supports command-line arguments for model selection, method choice, and parameter configuration
 * - Integrates with other utility modules for comprehensive input processing and error handling
 * - Provides extensible architecture for adding new models and methods in the future
 * 
 * @example
 * const { parseInputs } = require('./inputHandler');
 * const inputs = await parseInputs();
 * 
 * @since 1.0.6
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { validateNumber, validateRange, validatePositiveInteger } from './validators.js';
import { ParallelComputation } from './parallelComputation.js';
import { outputResults } from './outputHandler.js';
import { generateFractalData, getAvailableModels, getAvailableMethods } from '../models/modelSelector.js';

/**
 * Parses and validates command-line arguments.
 * @returns {Promise<Object>} Parsed and validated arguments.
 * @throws {Error} If input validation fails.
 */
function parseInputs() {
  const availableModels = getAvailableModels();
  const availableMethods = getAvailableMethods();

  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 [options]')
    .option('model', {
      alias: 'm',
      describe: 'Select the mathematical model to use',
      choices: availableModels,
      default: 'twoScale',
    })
    .option('method', {
      alias: 'M',
      describe: 'Select the method for solving the equation (applicable to specific models)',
      choices: availableMethods,
    })
    .option('alpha', {
      alias: 'a',
      describe: 'Fractional order in time (α)',
      type: 'number',
      default: 0.9,
    })
    .option('beta', {
      alias: 'b',
      describe: 'Fractional order in space (β)',
      type: 'number',
      default: 0.9,
    })
    .option('gamma', {
      alias: 'g',
      describe: 'Fractal dimension (γ)',
      type: 'number',
      default: 0.9,
    })
    .option('maxTerms', {
      alias: 'mt',
      describe: 'Maximum number of terms in the series solution',
      type: 'number',
      default: 10,
    })
    .option('kernel', {
      alias: 'k',
      describe: 'Kernel function for fractional derivatives',
      choices: ['power', 'exponential', 'mittagLeffler'],
      default: 'power',
    })
    .option('initialCondition', {
      alias: 'i',
      describe: 'Initial condition for the differential equations',
      type: 'number',
      default: 1.0,
    })
    .option('timeEnd', {
      alias: 't',
      describe: 'End time for simulations',
      type: 'number',
      default: 10,
    })
    .option('timeSteps', {
      alias: 's',
      describe: 'Number of time steps',
      type: 'number',
      default: 1000,
    })
    .option('reverseEngineer', {
      alias: 'r',
      describe: 'Enable reverse engineering of fractals',
      type: 'boolean',
      default: false,
    })
    .option('parallelComputation', {
      alias: 'p',
      describe: 'Enable parallel computation',
      type: 'boolean',
      default: false,
    })
    .check((argv) => {
      // Input validation using validators
      try {
        validateRange(argv.alpha, 0, 1, 'Alpha');
        validateRange(argv.beta, 0, 1, 'Beta');
        validateRange(argv.gamma, 0, 1, 'Gamma');
        validatePositiveInteger(argv.maxTerms, 'Max Terms');
        validateNumber(argv.initialCondition, 'Initial Condition');
        validatePositiveInteger(argv.timeEnd, 'Time End');
        validatePositiveInteger(argv.timeSteps, 'Time Steps');
      } catch (error) {
        throw new Error(`Input validation failed: ${error.message}`);
      }
      return true;
    })
    .help()
    .alias('help', 'h')
    .parse();

  return argv;
}

/**
 * Processes inputs and generates fractal data.
 * @param {Object} inputs - Parsed command-line arguments.
 * @returns {Promise<Object>} Generated fractal data.
 */
async function processInputs(inputs) {
  let data;
  if (inputs.parallelComputation) {
    const parallelComputation = new ParallelComputation();
    [data] = await parallelComputation.executeTasks([() => generateFractalData(inputs)]);
  } else {
    data = await generateFractalData(inputs);
  }
  await outputResults(data, inputs);
  return data;
}

export { parseInputs, processInputs };
