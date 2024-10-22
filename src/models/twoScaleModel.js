/**
 * @module models/twoScaleModel
 * @description Implements the Two-Scale Population Model using He-Laplace Method and Fractional Complex Transform.
 * @since 1.0.2
 * 
 * The Two-Scale Population Model is a mathematical model that describes the dynamics of a population that is divided into two distinct scales.
 * 
 * This model implements the Two-Scale Population Model using the He-Laplace Method and Fractional Complex Transform. It achieves its intent by:
 * - Defining the fractional differential equation using He's fractional derivative
 * - Applying the He-Laplace Method to solve the ODE
 * - Generating data points from the solution
 * 
 * The implementation is suitable for solving the two-scale population model with fractional derivatives, providing a robust approach to modeling complex population dynamics.
 */

const { hesFractionalDerivative } = require('../solvers/hesFractionalDerivative');
const { heLaplaceMethod } = require('../solvers/heLaplaceMethod');

/**
 * Solves the two-scale population model using the He-Laplace Method and Fractional Complex Transform.
 * @param {Object} params - The parameters parsed from user inputs.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 */
async function solve(params) {
  // Define the fractional differential equation
  const fractionalDE = (t, y) => hesFractionalDerivative(y, params.alpha, t) + y(t);

  // Apply He-Laplace Method to solve the ODE
  const solution = heLaplaceMethod(fractionalDE, params.initialCondition);

  // Generate data points
  const data = [];
  const dt = params.timeEnd / params.timeSteps;
  for (let i = 0; i <= params.timeSteps; i++) {
    const t = i * dt;
    data.push({ x: t, y: solution(t) });
  }

  return data;
}

module.exports = { solve };
