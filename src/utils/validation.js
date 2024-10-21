/**
 * @module utils/validation
 * @description Provides functions to validate numerical solutions against analytical solutions.
 * @since 1.0.1
 */

function validateResults(numericalData, analyticalSolution, params) {
  const errors = numericalData.map((point) => {
    const analyticalValue = analyticalSolution(point.x, params);
    return Math.abs(point.y - analyticalValue);
  });

  const maxError = Math.max(...errors);
  console.log(`Maximum error between numerical and analytical solutions: ${maxError}`);
}

module.exports = { validateResults };
