/**
 * @module utils/inputHandler
 * @description Parses and validates user inputs from command-line arguments using yargs.
 * Ensures comprehensive parameter definition and documentation for all models and methods.
 * Optimized to prevent blocking operations and validate inputs effectively.
 * @since 1.0.3
 */

const yargs = require('yargs');

function parseInputs() {
  const argv = yargs
    .usage('Usage: $0 [options]')
    .option('model', {
      alias: 'm',
      describe: 'Select the mathematical model to use',
      choices: ['twoScale', 'interpersonal', 'advectionDiffusion', 'fractionalSineGordon'],
      default: 'twoScale',
    })
    .option('method', {
      alias: 'M',
      describe: 'Select the method for solving the equation (applicable to specific models)',
      choices: ['LADM', 'STADM'],
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
    .check((argv) => {
      // Input validation
      if (argv.alpha <= 0 || argv.alpha > 1) {
        throw new Error('Alpha must be between 0 and 1.');
      }
      if (argv.beta <= 0 || argv.beta > 1) {
        throw new Error('Beta must be between 0 and 1.');
      }
      if (argv.timeSteps <= 0) {
        throw new Error('Time steps must be a positive integer.');
      }
      return true;
    })
    .help()
    .alias('help', 'h')
    .argv;

  return argv;
}

module.exports = { parseInputs };
