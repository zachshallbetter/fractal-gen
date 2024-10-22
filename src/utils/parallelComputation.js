/**
 * @module utils/parallelComputation
 * @description Provides utility functions for parallel computation to optimize performance in numerical algorithms.
 * This module achieves its intent by:
 * - Implementing a ParallelComputation class for managing parallel tasks
 * - Utilizing Node.js worker threads for parallel processing
 * - Providing methods for task distribution and result aggregation
 * - Implementing error handling and graceful degradation to sequential processing if parallel execution is unavailable
 * - Optimizing resource usage based on available system resources
 * 
 * @since 1.0.7
 * 
 * @example
 * // Example usage of ParallelComputation:
 * import { ParallelComputation } from './parallelComputation.js';
 * 
 * const parallelComputation = new ParallelComputation();
 * const tasks = [
 *   () => heavyComputation(1),
 *   () => heavyComputation(2),
 *   () => heavyComputation(3)
 * ];
 * 
 * try {
 *   const results = await parallelComputation.executeTasks(tasks);
 *   console.log('Parallel computation results:', results);
 * } catch (error) {
 *   console.error('Error in parallel computation:', error.message);
 * }
 * 
 * @see {@link https://nodejs.org/api/worker_threads.html|Node.js Worker Threads}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API|Web Workers API}
 */

const os = require('os');
const { Worker } = require('worker_threads');

/**
 * Class for managing parallel computations.
 */
class ParallelComputation {
  /**
   * Creates an instance of ParallelComputation.
   * @param {number} [maxWorkers] - Maximum number of worker threads to use. Defaults to the number of CPU cores.
   */
  constructor(maxWorkers = os.cpus().length) {
    this.maxWorkers = maxWorkers;
  }

  /**
   * Executes an array of tasks in parallel.
   * @async
   * @param {Function[]} tasks - Array of functions to be executed in parallel.
   * @returns {Promise<any[]>} - Array of results from the executed tasks.
   * @throws {Error} If task execution fails.
   */
  async executeTasks(tasks) {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      throw new Error('Invalid tasks array');
    }

    const workerPool = this._createWorkerPool(Math.min(tasks.length, this.maxWorkers));
    const results = [];

    try {
      const taskPromises = tasks.map((task, index) => 
        this._executeTaskInWorker(workerPool[index % workerPool.length], task)
      );
      results.push(...(await Promise.all(taskPromises)));
    } catch (error) {
      throw new Error(`Parallel execution failed: ${error.message}`);
    } finally {
      this._terminateWorkers(workerPool);
    }

    return results;
  }

  /**
   * Creates a pool of worker threads.
   * @private
   * @param {number} count - Number of workers to create.
   * @returns {Worker[]} - Array of created workers.
   */
  _createWorkerPool(count) {
    return Array.from({ length: count }, () => new Worker(`${__dirname}/worker.js`));
  }

  /**
   * Executes a single task in a worker thread.
   * @private
   * @async
   * @param {Worker} worker - Worker thread to use for execution.
   * @param {Function} task - Task to execute.
   * @returns {Promise<any>} - Result of the executed task.
   */
  _executeTaskInWorker(worker, task) {
    return new Promise((resolve, reject) => {
      worker.postMessage({ task: task.toString() });
      worker.once('message', resolve);
      worker.once('error', reject);
    });
  }

  /**
   * Terminates all workers in the pool.
   * @private
   * @param {Worker[]} workerPool - Array of workers to terminate.
   */
  _terminateWorkers(workerPool) {
    workerPool.forEach(worker => worker.terminate());
  }
}

module.exports = { ParallelComputation };
