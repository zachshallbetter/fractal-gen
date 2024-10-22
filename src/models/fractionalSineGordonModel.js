/**
 * @module models/fractionalSineGordonModel
 * @description Implements the Fractional Order Sine-Gordon Equation using a simplified numerical method.
 * Optimized for non-blocking execution.
 * @since 1.0.6
 */

const { ladmSolver } = require('../solvers/ladmSolver');

async function solve(params) {
  const solution = await ladmSolver(params);

  // Generate data points for visualization
  const data = [];
  const dt = params.timeEnd / params.timeSteps;
  for (let i = 0; i <= params.timeSteps; i++) {
    const t = i * dt;
    const y = solution(t);
    data.push({ x: t, y: y });
  }

  return data;
}

module.exports = { solve };
