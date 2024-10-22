/**
 * @module solvers/rungeKuttaSolver
 * @description Solves differential equations using the 4th-order Runge-Kutta method.
 * This module achieves its intent by:
 * - Implementing the rungeKuttaSolver function
 * - Providing an efficient and accurate numerical solution for ordinary differential equations
 * - Optimizing for non-blocking and efficient computation
 * 
 * The Runge-Kutta method is a widely used numerical technique for solving ordinary differential equations (ODEs).
 * This implementation uses the classical 4th-order Runge-Kutta method, which provides a good balance between
 * accuracy and computational efficiency.
 * 
 * @since 1.0.8
 * 
 * @example
 * // Example usage of the rungeKuttaSolver function:
 * const f = (t, y) => -y; // Simple ODE: dy/dt = -y
 * const y0 = 1; // Initial condition
 * const t0 = 0; // Start time
 * const tEnd = 5; // End time
 * const steps = 100; // Number of steps
 * const solution = rungeKuttaSolver(f, y0, t0, tEnd, steps);
 * 
 * @see {@link https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods|Runge-Kutta methods}
 * for more information on the numerical method used.
 */

const math = require('mathjs');

/**
 * Solves a differential equation using the 4th-order Runge-Kutta method.
 * @param {Function} f - The derivative function f(t, y).
 * @param {number} y0 - Initial condition.
 * @param {number} t0 - Initial time.
 * @param {number} tEnd - End time.
 * @param {number} steps - Number of steps.
 * @returns {Array<{ x: number, y: number }>} - Array of data points.
 */
function rungeKuttaSolver(f, y0, t0, tEnd, steps) {
  const dt = (tEnd - t0) / steps;
  let t = t0;
  let y = y0;
  const data = [{ x: t, y: y }];

  for (let i = 0; i < steps; i++) {
    const k1 = dt * f(t, y);
    const k2 = dt * f(t + dt / 2, y + k1 / 2);
    const k3 = dt * f(t + dt / 2, y + k2 / 2);
    const k4 = dt * f(t + dt, y + k3);

    y += (k1 + 2 * k2 + 2 * k3 + k4) / 6;
    t += dt;
    data.push({ x: t, y: y });
  }

  return data;
}

module.exports = { rungeKuttaSolver };
