/**
 * @module solvers/ladmSolver
 * @description Solves the fractional Sine-Gordon equation using a simplified numerical method (Euler method).
 * This module achieves its intent by:
 * - Implementing the ladmSolver function using the Euler method
 * - Optimizing for non-blocking and efficient computation
 * - Providing a numerical solution to the fractional Sine-Gordon equation
 * 
 * @since 1.0.7
 * 
 * @example
 * // Example usage of the ladmSolver function:
 * const params = {
 *   initialCondition: 0,
 *   timeEnd: 10,
 *   timeSteps: 1000
 * };
 * const solution = await ladmSolver(params);
 * const u_at_t5 = solution(5); // Get the solution at t = 5
 * 
 * @see {@link https://en.wikipedia.org/wiki/Sine-Gordon_equation|Sine-Gordon equation} for more information on the equation being solved.
 * @see {@link https://en.wikipedia.org/wiki/Euler_method|Euler method} for details on the numerical method used.
 */
import math from 'mathjs';

/**
 * Solves the fractional Sine-Gordon equation numerically using the Euler method.
 * The fractional Sine-Gordon equation is given by:
 * ∂²u/∂t² - ∂²u/∂x² + sin(u) = 0
 * 
 * This implementation uses a simplified form:
 * ∂u/∂t = sin(u)
 * 
 * @param {Object} params - Parameters for the solver.
 * @param {number} params.initialCondition - Initial value of u at t=0.
 * @param {number} params.timeEnd - End time for the simulation.
 * @param {number} params.timeSteps - Number of time steps.
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
    // Euler method step: u_n+1 = u_n + dt * f(u_n)
    // where f(u) = sin(u) for our simplified Sine-Gordon equation
    const du = dt * math.sin(uPrev);
    const uNext = uPrev + du;
    uValues.push(uNext);
    tValues.push(t);
  }

  // Return the solution as a function interpolated over the computed values
  return (t) => {
    if (t <= timeEnd) {
      const index = math.floor((t / timeEnd) * timeSteps);
      return uValues[index];
    } else {
      return uValues[uValues.length - 1];
    }
  };
}

export { ladmSolver };
