/**
 * @module solvers/fractalFractionalSolver
 * @description Solves fractal–fractional differential equations using Lagrangian polynomial interpolation.
 * 
 * The Fractal-Fractional Solver is a module that solves fractal–fractional differential equations using Lagrangian polynomial interpolation.
 * 
 * - Generates time nodes
 * - Generates Lagrangian polynomials
 * - Evaluates the solution at the time nodes
 * 
 * The implementation is designed to be efficient and suitable for edge computing environments, 
 * utilizing asynchronous operations where possible to ensure non-blocking execution.
 * 
 * @example
 * // Solve a fractal–fractional differential equation
 * const solution = await fractalFractionalSolver({
 *   alpha: 0.5,
 *   gamma: 1.0,
 *   kernel: (t) => Math.exp(-t),
 *   initialCondition: (t) => Math.sin(t),
 *   N: 100,
 *   T: 1.0
 * });
 * 
 * @input {{alpha: number, gamma: number, kernel: (t: number) => number, initialCondition: (t: number) => number, N: number, T: number}}
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 * 
 * @since 1.0.1
 */
/**
 * Solves a fractal–fractional differential equation using Lagrangian polynomial interpolation.
 * @async
 * @param {Object} params - The parameters for the solver.
 * @param {number} params.alpha - The fractional order of the time derivative.
 * @param {number} params.gamma - The fractal dimension.
 * @param {Function} params.kernel - The kernel function.
 * @param {Function} params.initialCondition - The initial condition function.
 * @param {number} params.N - The number of time nodes.
 * @param {number} params.T - The final time.
 * @returns {Promise<Array<{ x: number, y: number }>>} - An array of data points representing the solution.
 * @throws {Error} If input validation fails.
 */
async function fractalFractionalSolver(params) {
  const { alpha, gamma, kernel, initialCondition, N, T } = params;

  // Validate input parameters
  validateNumber(alpha, 'alpha', 0, 1);
  validateNumber(gamma, 'gamma', 0, 1);
  validateFunction(kernel, 'kernel');
  validateFunction(initialCondition, 'initialCondition');
  validatePositiveInteger(N, 'N');
  validatePositiveNumber(T, 'T');

  // Generate time nodes
  const tNodes = Array.from({ length: N + 1 }, (_, i) => (i * T) / N);

  // Generate Lagrangian polynomials
  const lagrangePolynomials = generateLagrangePolynomials(tNodes);

  // Solve the fractal-fractional differential equation
  const yValues = await solveFractalFractionalDE(tNodes, lagrangePolynomials, alpha, gamma, kernel, initialCondition);

  // Prepare data for output
  const data = tNodes.map((t, i) => ({ x: t, y: yValues[i] }));

  return data;
}

/**
 * Generates Lagrangian polynomials for the given time nodes.
 * @param {number[]} tNodes - The time nodes.
 * @returns {Function[]} - An array of Lagrangian polynomial functions.
 */
function generateLagrangePolynomials(tNodes) {
  return tNodes.map((_, i) => 
    (t) => tNodes.reduce((acc, tj, j) => 
      i !== j ? acc * (t - tj) / (tNodes[i] - tj) : acc, 1)
  );
}

/**
 * Solves the fractal-fractional differential equation.
 * @async
 * @param {number[]} tNodes - The time nodes.
 * @param {Function[]} lagrangePolynomials - The Lagrangian polynomials.
 * @param {number} alpha - The fractional order of the time derivative.
 * @param {number} gamma - The fractal dimension.
 * @param {Function} kernel - The kernel function.
 * @param {Function} initialCondition - The initial condition function.
 * @returns {Promise<number[]>} - The solution values at the time nodes.
 */
async function solveFractalFractionalDE(tNodes, lagrangePolynomials, alpha, gamma, kernel, initialCondition) {
  const N = tNodes.length - 1;
  const yValues = new Array(N + 1);
  yValues[0] = initialCondition(0);

  for (let n = 1; n <= N; n++) {
    let sum = 0;
    for (let k = 0; k < n; k++) {
      sum += await evaluateIntegral(0, tNodes[n], (t) => 
        kernel(tNodes[n] - t) * lagrangePolynomials[k](t) * Math.pow(t, gamma - 1)
      );
    }
    yValues[n] = initialCondition(tNodes[n]) + (1 / gamma) * Math.pow(tNodes[n], alpha) * sum;
  }

  return yValues;
}

/**
 * Evaluates a definite integral using numerical integration.
 * @async
 * @param {number} a - The lower bound of integration.
 * @param {number} b - The upper bound of integration.
 * @param {Function} f - The function to integrate.
 * @returns {Promise<number>} - The value of the integral.
 */
async function evaluateIntegral(a, b, f) {
  const numPoints = 1000;
  const dx = (b - a) / numPoints;
  let sum = 0;

  for (let i = 0; i < numPoints; i++) {
    const x = a + i * dx;
    sum += f(x) * dx;
  }

  return sum;
}

module.exports = { fractalFractionalSolver };
