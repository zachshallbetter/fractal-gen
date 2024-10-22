/**
 * @module utils/inputHandler
 * @description Parses and validates user inputs from command-line arguments using yargs.
 * Ensures comprehensive parameter definition and documentation for all models and methods.
 * Integrates with the Logger module for improved error handling and logging.
 * 
 * This module achieves its intent by:
 * - Parsing and validating command-line arguments
 * - Validating input parameters
 * - Integrating with parallel computation for efficient processing
 * - Integrating with output handler for result processing
 * - Integrating with reverse engineering for parameter inference
 * 
 * @example
 * import { parseInputs, processInputs } from './inputHandler.js';
 * import logger from './logger.js';
 * 
 * const inputs = parseInputs();
 * const results = await processInputs(inputs);
 * logger.info('Processing completed', { results });
 * 
 * @since 1.0.14
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { validateNumber, ValidationError } from './validators.js';
import { generateFractalData } from '../models/modelSelector.js';
import { ParallelComputation } from './parallelComputation.js';
import { outputResults } from './outputHandler.js';
import { reverseEngineer } from './reverseEngineering.js';
import logger from './logger.js';

/**
 * Parses and validates command-line arguments.
 * @returns {Object} Parsed and validated arguments.
 * @throws {ValidationError} If input validation fails.
 */
function parseInputs() {
  const availableModels = ['twoScale', 'interpersonal', 'advectionDiffusion', 'fractionalSineGordon'];
  const availableMethods = ['LADM', 'STADM', 'MHPM', 'HeLaplace', 'RungeKutta'];

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
      default: 'RungeKutta',
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
    .option('startServer', {
      alias: 'S',
      describe: 'Start the web server',
      type: 'boolean',
      default: false,
    })
    .check((argv) => {
      try {
        validateNumber(argv.alpha, 'Alpha', 0, 1);
        validateNumber(argv.beta, 'Beta', 0, 1);
        validateNumber(argv.gamma, 'Gamma', 0, 2);
        validateNumber(argv.maxTerms, 'Max Terms', 1);
        validateNumber(argv.initialCondition, 'Initial Condition');
        validateNumber(argv.timeEnd, 'Time End', 0);
        validateNumber(argv.timeSteps, 'Time Steps', 1);
      } catch (error) {
        logger.error('Input validation failed', error);
        throw new ValidationError(error.message);
      }
      return true;
    })
    .help()
    .alias('help', 'h')
    .parse();

  logger.info('Input parameters parsed successfully', { params: argv });
  return argv;
}

/**
 * Processes inputs and generates fractal data.
 * @async
 * @param {Object} inputs - Parsed command-line arguments.
 * @returns {Promise<Object>} Generated fractal data.
 */
async function processInputs(inputs) {
  let data;
  if (inputs.parallelComputation) {
    const parallelComputation = new ParallelComputation();
    try {
      logger.info('Starting parallel computation');
      [data] = await parallelComputation.executeTasks([() => generateFractalData(inputs)]);
      logger.info('Parallel computation completed successfully');
    } catch (error) {
      logger.error('Error in parallel computation', error);
      throw error;
    }
  } else {
    logger.info('Starting sequential computation');
    data = await generateFractalData(inputs);
    logger.info('Sequential computation completed successfully');
  }

  // Output results
  try {
    logger.info('Outputting results');
    await outputResults(data, inputs);
    logger.info('Results output successfully');
  } catch (error) {
    logger.error('Error in outputting results', error);
    throw error;
  }

  // Reverse engineering (if enabled)
  if (inputs.reverseEngineer) {
    try {
      logger.info('Starting reverse engineering process');
      const inferredParams = await reverseEngineer(data, inputs);
      logger.info('Reverse engineering completed', { inferredParams });
      console.log('Inferred Parameters:', inferredParams);
    } catch (error) {
      logger.error('Error in reverse engineering', error);
      throw error;
    }
  }

  return data;
}

export { parseInputs, processInputs };
