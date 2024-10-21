/**
 * @module solvers/hesFractionalDerivative
 * @description Computes He’s fractional derivative using numerical approximation.
 * @since 1.0.1
 */

const math = require('mathjs');

function hesFractionalDerivative(yFunc, alpha, t) {
  const h = 0.01; // Step size
  const n = Math.floor(t / h);
  let sum = 0;
  for (let k = 0; k <= n; k++) {
    const coeff = math.combinations(alpha, k) * Math.pow(-1, k);
    sum += coeff * yFunc(t - k * h);
  }
  return sum / Math.pow(h, alpha);
}

module.exports = { hesFractionalDerivative };
