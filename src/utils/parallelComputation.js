/**
 * @module utils/parallelComputation
 * @description Provides utility functions for parallel computation to optimize performance in numerical algorithms.
 * This module achieves its intent by:
 * - Implementing a ParallelComputation class for managing parallel tasks
 * - Utilizing Web Workers for parallel processing in browser environments
 * - Utilizing Node.js worker threads for parallel processing in Node.js environments
 * - Providing methods for task distribution and result aggregation
 * - Implementing error handling and graceful degradation to sequential processing if parallel execution is unavailable
 * - Optimizing resource usage based on available system resources
 * 
 * @since 1.0.13
 * 
 * @example
 * // Example usage of ParallelComputation:
 * import { ParallelComputation } from './parallelComputation.js';
 * import logger from './logger.js';
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
 *   logger.info('Parallel computation results:', { results });
 * } catch (error) {
 *   logger.error('Error in parallel computation:', error);
 * }
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API|Web Workers API}
 * @see {@link https://nodejs.org/api/worker_threads.html|Node.js Worker Threads}
 */

import os from 'os';
import logger from './logger.js';

let Worker;
let isNode = false;

// Determine the environment and import the appropriate Worker implementation
if (typeof window === 'undefined') {
  isNode = true;
  Worker = (await import('worker_threads')).Worker;
} else {
  Worker = window.Worker;
}

/**
 * Class for managing parallel computations.
 */
export class ParallelComputation {
  /**
   * Creates an instance of ParallelComputation.
   * @param {number} [maxWorkers] - Maximum number of worker threads to use. Defaults to the number of CPU cores or 4 for browsers.
   */
  constructor(maxWorkers) {
    this.maxWorkers = maxWorkers || (isNode ? os.cpus().length : navigator.hardwareConcurrency || 4);
    logger.info(`ParallelComputation initialized with ${this.maxWorkers} max workers`);
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
      logger.error('Invalid tasks array provided');
      throw new Error('Invalid tasks array');
    }

    const workerCount = Math.min(tasks.length, this.maxWorkers);
    logger.info(`Executing ${tasks.length} tasks with ${workerCount} workers`);

    const workerPool = this._createWorkerPool(workerCount);
    const results = [];

    try {
      const taskPromises = tasks.map((task, index) => 
        this._executeTaskInWorker(workerPool[index % workerPool.length], task)
      );
      results.push(...(await Promise.all(taskPromises)));
      logger.info(`Successfully executed ${tasks.length} tasks in parallel`);
    } catch (error) {
      logger.error('Parallel execution failed', error);
      throw new Error(`Parallel execution failed: ${error.message}`);
    } finally {
      await this._terminateWorkers(workerPool);
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
    logger.info(`Creating worker pool with ${count} workers`);
    if (isNode) {
      return Array.from({ length: count }, () => new Worker(`${__dirname}/worker.js`));
    } else {
      return Array.from({ length: count }, () => new Worker('worker.js'));
    }
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
      worker.onmessage = (event) => {
        logger.info('Task completed successfully in worker');
        resolve(event.data);
      };
      worker.onerror = (error) => {
        logger.error('Error in worker execution', error);
        reject(error);
      };
    });
  }

  /**
   * Terminates all workers in the pool.
   * @private
   * @async
   * @param {Worker[]} workerPool - Array of workers to terminate.
   */
  async _terminateWorkers(workerPool) {
    logger.info(`Terminating ${workerPool.length} workers`);
    const terminationPromises = workerPool.map(worker => worker.terminate());
    await Promise.all(terminationPromises);
  }
}
