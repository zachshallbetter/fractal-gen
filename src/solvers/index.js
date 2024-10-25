/**
 * @module solvers
 * @description This module exports various solvers for mathematical models and fractional differential equations.
 * It provides a unified interface for accessing different solving methods and utilities.
 * @since 1.0.5
 */

export { rungeKuttaSolver } from './rungeKuttaSolver.js';
export { ladmSolver } from './ladmSolver.js';
export { stadmSolver } from './stadmSolver.js';
export { hesFractionalDerivative } from './hesFractionalDerivative.js';
export { bernsteinPolynomials } from './bernsteinPolynomials.js';
export { generateOperationalMatrices } from './operationalMatrices.js';
export { mhpmSolver } from './mhpmSolver.js';
export { adomianDecomposition } from './adomianDecomposition.js';
export { fractalFractionalSolver } from './fractalFractionalSolver.js';
export { fractionalSolver } from './fractionalSolver.js';
export { heLaplaceMethod } from './heLaplaceMethod.js';
export { inverseAdomianDecomposition } from './inverseAdomianDecomposition.js';
export { inverseBernsteinPolynomials } from './inverseBernsteinPolynomials.js';
export { inverseLaplaceTransform } from './inverseLaplaceTransform.js';
export { inverseShehuTransform } from './inverseShehuTransform.js';
export { laplaceTransform } from './laplaceTransform.js';
export { shehuTransform } from './shehuTransform.js';
export { solveFractionalDE, getAvailableSolvers } from './solverSelector.js';
export { grunwaldLetnikovSolver } from './fractionalSolver.js';
export { generateAdomianPolynomials } from './adomianDecomposition.js';

/**
 * @typedef {Object} Solver
 * @property {Function} solve - The solver function
 * @property {string} name - The name of the solver
 * @property {string} description - A brief description of the solver
 */

/**
 * Object containing all available solvers
 * @type {Object.<string, Solver>}
 */
export const solvers = {
  rungeKutta: {
    solve: rungeKuttaSolver,
    name: 'Runge-Kutta',
    description: 'Fourth-order Runge-Kutta method for solving ordinary differential equations'
  },
  ladm: {
    solve: ladmSolver,
    name: 'LADM',
    description: 'Laplace Adomian Decomposition Method for solving fractional differential equations'
  },
  stadm: {
    solve: stadmSolver,
    name: 'STADM',
    description: 'Shifted Truncated Adomian Decomposition Method for solving fractional differential equations'
  },
  mhpm: {
    solve: mhpmSolver,
    name: 'MHPM',
    description: 'Modified Homotopy Perturbation Method for solving fractional differential equations'
  },
  adomianDecomposition: {
    solve: adomianDecomposition,
    name: 'Adomian Decomposition',
    description: 'Adomian Decomposition Method for solving nonlinear differential equations'
  },
  fractalFractional: {
    solve: fractalFractionalSolver,
    name: 'Fractal Fractional',
    description: 'Solver for fractal fractional differential equations'
  },
  fractional: {
    solve: fractionalSolver,
    name: 'Fractional',
    description: 'General solver for fractional differential equations'
  },
  heLaplace: {
    solve: heLaplaceMethod,
    name: 'He-Laplace',
    description: 'He-Laplace Method for solving nonlinear differential equations'
  },
  bernsteinPolynomials: {
    solve: bernsteinPolynomials,
    name: 'Bernstein Polynomials',
    description: 'Bernstein polynomials for approximating functions'
  },
  operationalMatrices: {
    solve: generateOperationalMatrices,
    name: 'Operational Matrices',
    description: 'Generation of operational matrices for solving differential equations'
  },
  hesFractionalDerivative: {
    solve: hesFractionalDerivative,
    name: 'He\'s Fractional Derivative',
    description: 'He\'s fractional derivative method for solving fractional differential equations'
  },
  inverseAdomianDecomposition: {
    solve: inverseAdomianDecomposition,
    name: 'Inverse Adomian Decomposition',
    description: 'Inverse Adomian Decomposition Method for solving inverse problems'
  }
};

/**
 * Get a solver by name
 * @param {string} name - The name of the solver
 * @returns {Solver|undefined} The solver object or undefined if not found
 */
export function getSolver(name) {
  return solvers[name];
}

/**
 * @typedef {Object} Transform
 * @property {Function} transform - The transform function
 * @property {Function} inverse - The inverse transform function
 * @property {string} name - The name of the transform
 * @property {string} description - A brief description of the transform
 */

/**
 * Object containing all available transforms
 * @type {Object.<string, Transform>}
 */
export const transforms = {
  laplace: {
    transform: laplaceTransform,
    inverse: inverseLaplaceTransform,
    name: 'Laplace Transform',
    description: 'Laplace transform and its inverse for solving differential equations'
  },
  shehu: {
    transform: shehuTransform,
    inverse: inverseShehuTransform,
    name: 'Shehu Transform',
    description: 'Shehu transform and its inverse for solving fractional differential equations'
  },
  bernstein: {
    transform: bernsteinPolynomials,
    inverse: inverseBernsteinPolynomials,
    name: 'Bernstein Polynomials',
    description: 'Bernstein polynomials and their inverse for approximating functions'
  }
};

/**
 * Get a list of available transforms
 * @returns {string[]} Array of transform names
 */
export function getAvailableTransforms() {
  return Object.keys(transforms);
}

/**
 * Get a transform by name
 * @param {string} name - The name of the transform
 * @returns {Transform|undefined} The transform object or undefined if not found
 */
export function getTransform(name) {
  return transforms[name];
}
/**
 * Generate Adomian polynomials
 * @param {Function} f - The function to generate polynomials for
 * @param {number} n - The number of polynomials to generate
 * @returns {Function[]} Array of Adomian polynomial functions
 */
export function generateAdomianPolynomials(f, n) {
  // Implementation of Adomian polynomial generation
  // This is a placeholder and should be replaced with the actual implementation
  return Array(n).fill(() => {});
}

/**
 * Selects the appropriate solver based on the given method.
 * @param {string} method - The solver method to use.
 * @returns {Function} The selected solver function.
 * @throws {Error} If the solver for the specified method is not found.
 */
export function selectSolver(method) {
  const solver = solvers[method]?.solve;
  if (!solver) {
    throw new Error(`Solver for method "${method}" not found.`);
  }
  return solver;
}

/**
 * Validates the input parameters for a solver
 * @param {Object} params - The parameters to validate
 * @param {string} solverName - The name of the solver
 * @throws {Error} If the parameters are invalid
 */
export function validateSolverParams(params, solverName) {
  // Implementation of parameter validation
  // This is a placeholder and should be replaced with actual validation logic
  if (!params || typeof params !== 'object') {
    throw new Error(`Invalid parameters for solver "${solverName}"`);
  }
}

/**
 * Applies a transform to a function
 * @param {Function} f - The function to transform
 * @param {string} transformName - The name of the transform to apply
 * @returns {Function} The transformed function
 * @throws {Error} If the transform is not found
 */
export function applyTransform(f, transformName) {
  const transform = transforms[transformName]?.transform;
  if (!transform) {
    throw new Error(`Transform "${transformName}" not found`);
  }
  return (x) => transform(f)(x);
}
