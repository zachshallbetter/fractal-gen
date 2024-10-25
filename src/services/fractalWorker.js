/**
 * @module fractalWorker
 * @description Worker thread for fractal computations.
 * @since 1.0.1
 */

import { parentPort } from 'worker_threads';
import { computeFractal } from './fractalService.js';

parentPort.on('message', (params) => {
  const result = computeFractal(params);
  parentPort.postMessage(result);
});
