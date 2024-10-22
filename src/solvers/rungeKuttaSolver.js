/**
 * @module solvers/rungeKuttaSolver
 * @description Solves differential equations using the Runge-Kutta method.
 * This module achieves its intent by:
 * - Implementing asynchronous operations to prevent blocking
 * - Utilizing the 4th-order Runge-Kutta method for numerical integration
 * - Optimizing for efficient computation of solution points
 * - Integrating with mathUtils and validation modules for enhanced functionality
 * 
 * The 4th-order Runge-Kutta method is defined as:
 * 
 * y(n+1) = y(n) + (1/6)(k1 + 2k2 + 2k3 + k4)
 * 
 * Where:
 * k1 = h * f(t(n), y(n))
 * k2 = h * f(t(n) + h/2, y(n) + k1/2)
 * k3 = h * f(t(n) + h/2, y(n) + k2/2)
 * k4 = h * f(t(n) + h, y(n) + k3)
 * 
 * @since 1.0.8
 * 
 * @example
 * // Example usage of rungeKuttaSolver:
 * import { rungeKuttaSolver } from './solvers/rungeKuttaSolver.js';
 * import logger from '../utils/logger.js';
 * 
 * const f = (t, y) => -2 * t * y; // dy/dt = -2ty
 * const y0 = 1;
 * const t0 = 0;
 * const tEnd = 2;
 * const steps = 100;
 * 
 * try {
 *   const solution = await rungeKuttaSolver(f, y0, t0, tEnd, steps);
 *   logger.info('Runge-Kutta solution computed successfully', { solution });
 * } catch (error) {
 *   logger.error('Error in Runge-Kutta solver:', error);
 * }
 * 
 * @see {@link https://en.wikipedia.org/wiki/Runge%E2%80%93Kutta_methods|Runge-Kutta methods}
 * for more information on Runge-Kutta methods and their applications in solving differential equations.
 */

import { create, all } from 'mathjs';
import { validateFunction, validateNumber, validatePositiveInteger } from '../utils/validation.js';
import logger from '../utils/logger.js';

const math = create(all);

/**
 * Solves a differential equation using the 4th-order Runge-Kutta method asynchronously.
 * @async
 * @param {Function} f - The derivative function f(t, y).
 * @param {number} y0 - Initial condition.
 * @param {number} t0 - Initial time.
 * @param {number} tEnd - End time.
 * @param {number} steps - Number of steps.
 * @returns {Promise<Array<{ x: number, y: number }>>} - A promise that resolves to an array of data points.
 * @throws {Error} If the input parameters are invalid or computation fails.
 */
export async function rungeKuttaSolver(f, y0, t0, tEnd, steps) {
  try {
    validateFunction(f, 'Derivative function');
    validateNumber(y0, 'Initial condition');
    validateNumber(t0, 'Initial time');
    validateNumber(tEnd, 'End time');
    validatePositiveInteger(steps, 'Number of steps');

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

      // Introduce asynchronous behavior to prevent blocking
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }

    logger.info('Runge-Kutta solution computed successfully');
    return data;
  } catch (error) {
    logger.error('Error in Runge-Kutta solver:', error);
    throw error;
  }
}
