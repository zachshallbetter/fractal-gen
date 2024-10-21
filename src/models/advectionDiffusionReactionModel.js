/**
 * @module models/advectionDiffusionReactionModel
 * @description Implements the fractal–fractional ADR equation using Bernstein polynomials and operational matrices.
 * @since 1.0.1
 */

const { bernsteinPolynomials } = require('../solvers/bernsteinPolynomials');
const { generateOperationalMatrices } = require('../solvers/operationalMatrices');
const { mhpmSolver } = require('../solvers/mhpmSolver');

async function solve(params) {
  // Problem-specific parameters
  const n = params.polynomialDegree || 5;
  const T = params.timeEnd;
  const X = params.spaceEnd || 1;

  // Generate Bernstein polynomials and operational matrices
  const B_t = bernsteinPolynomials(n, T);
  const B_x = bernsteinPolynomials(n, X);
  const D_t = generateOperationalMatrices('time', params.alpha, params.gamma, n);
  const D_x = generateOperationalMatrices('space', params.beta || params.alpha, params.gamma, n);

  // Set up and solve the system using MHPM
  const solution = mhpmSolver(B_t, B_x, D_t, D_x, params);

  // Generate data points
  const data = solution.map((value, index) => ({
    x: index * (T / params.timeSteps),
    y: value,
  }));

  return data;
}

module.exports = { solve };
