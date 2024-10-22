/**
 * @module utils/inputHandler
 * @description Parses and validates user inputs from command-line arguments using yargs.
 * Ensures comprehensive parameter definition and documentation for all models and methods.
 * 
 * @since 1.0.7
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { validateNumber, validateFunction, ValidationError } from './validators.js';
import { generateFractalData, getAvailableModels, getAvailableMethods } from '../models/modelSelector.js';

/**
 * Parses and validates command-line arguments.
 * @returns {Object} Parsed and validated arguments.
 * @throws {ValidationError} If input validation fails.
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
      try {
        validateNumber(argv.alpha, 'Alpha', 0, 1);
        validateNumber(argv.beta, 'Beta', 0, 1);
        validateNumber(argv.maxTerms, 'Max Terms', 1);
        // Add additional validations as needed
      } catch (error) {
        throw new ValidationError(error.message);
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
