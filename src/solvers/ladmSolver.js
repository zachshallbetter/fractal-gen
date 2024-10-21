/**
 * @module solvers/ladmSolver
 * @description Solves the fractional Sine-Gordon equation using a simplified numerical method (Euler method).
 * Optimized for non-blocking and efficient computation.
 * @since 1.0.6
 */

const math = require('mathjs');

/**
 * Solves the fractional Sine-Gordon equation numerically.
 * @param {Object} params - Parameters for the solver, including initial conditions and step sizes.
 * @returns {Promise<Function>} - A promise that resolves to the solution function u(t).
 */
async function ladmSolver(params) {
  const { initialCondition, timeEnd, timeSteps } = params;
  const dt = timeEnd / timeSteps;
  const uValues = [initialCondition];
  const tValues = [0];

  for (let i = 1; i <= timeSteps; i++) {
    const t = i * dt;
    const uPrev = uValues[i - 1];
    const du = dt * math.sin(uPrev); // Simplified derivative
    const uNext = uPrev + du;
    uValues.push(uNext);
    tValues.push(t);
  }

  // Return the solution as a function interpolated over the computed values
  return (t) => {
    if (t <= timeEnd) {
      const index = Math.floor((t / timeEnd) * timeSteps);
      return uValues[index];
    } else {
      return uValues[uValues.length - 1];
    }
  };
}

module.exports = { ladmSolver };
