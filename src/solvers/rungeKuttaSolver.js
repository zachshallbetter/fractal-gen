/**
 * @module solvers/rungeKuttaSolver
 * @description Solves differential equations using the Runge-Kutta method.
 * Optimized for non-blocking and efficient computation.
 * @since 1.0.7
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
