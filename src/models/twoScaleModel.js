/**
 * @module models/twoScaleModel
 * @description Implements the Two-Scale Population Model using He-Laplace Method and Fractional Complex Transform.
 * @since 1.0.1
 */

const { hesFractionalDerivative } = require('../solvers/hesFractionalDerivative');
const { heLaplaceMethod } = require('../solvers/heLaplaceMethod');

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
