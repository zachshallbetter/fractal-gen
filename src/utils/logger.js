/**
 * @module utils/logger
 * @description Provides logging functionality optimized for edge runtime environments and integrated with parallel computation.
 * This module is designed to work efficiently with limited resources and provides
 * structured logging capabilities for better observability in edge computing scenarios.
 * 
 * This module achieves its intent by:
 * - Using Winston for logging
 * - Logging to console and file
 * - Tracking active requests and memory usage
 * - Logging node version and platform
 * - Integrating with parallel computation for performance logging
 * - Supporting input and output handling operations
 * - Providing integration with CacheService for request tracking
 * - Offering compatibility with EdgeRuntime and server environments
 * 
 * @example
 * import logger from './logger.js';
 * logger.info('This is an info message');
 * logger.warn('This is a warning message');
 * logger.error('This is an error message');
 * 
 * @since 1.0.18
 */

import { createLogger, format, transports } from 'winston';
import { cacheClient } from '../cacheService.js';
import { ParallelComputation } from './parallelComputation.js';

const { combine, timestamp, printf, colorize } = format;

/**
 * Custom log format that includes timestamp, log level, and message.
 */
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

/**
 * Creates a Winston logger instance configured for edge runtime.
 * @type {import('winston').Logger}
 */
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    timestamp(),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'edge-runtime.log', maxsize: 5242880, maxFiles: 5 }) // 5MB file size limit
  ]
});

/**
 * Logs a message with additional context for edge runtime.
 * @async
 * @function
 * @param {string} level - The log level ('info', 'warn', 'error', etc.).
 * @param {string} message - The log message.
 * @param {Object} [context={}] - Additional context for the log entry.
 */
export async function log(level, message, context = {}) {
  const edgeContext = await getEdgeContext();
  logger.log(level, message, { ...context, ...edgeContext });
}

/**
 * Retrieves additional context information for edge runtime logging.
 * @async
 * @function
 * @returns {Promise<Object>} An object containing edge-specific context information.
 */
async function getEdgeContext() {
  const activeRequests = await cacheClient.get('activeRequests') || 0;
  const memoryUsage = process.memoryUsage();
  const parallelComputation = new ParallelComputation();

  return {
    activeRequests,
    memoryUsage: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed
    },
    nodeVersion: process.version,
    platform: process.platform,
    parallelWorkers: parallelComputation.maxWorkers
  };
}

/**
 * Logs an info message.
 * @async
 * @function
 * @param {string} message - The info message to log.
 * @param {Object} [context={}] - Additional context for the log entry.
 */
export async function info(message, context = {}) {
  await log('info', message, context);
}

/**
 * Logs a warning message.
 * @async
 * @function
 * @param {string} message - The warning message to log.
 * @param {Object} [context={}] - Additional context for the log entry.
 */
export async function warn(message, context = {}) {
  await log('warn', message, context);
}

/**
 * Logs an error message.
 * @async
 * @function
 * @param {string} message - The error message to log.
 * @param {Error|Object} [error] - The error object or additional error context.
 * @param {Object} [context={}] - Additional context for the log entry.
 */
export async function error(message, error, context = {}) {
  const errorContext = error instanceof Error ? { 
    errorMessage: error.message,
    stack: error.stack
  } : error;

  await log('error', message, { ...errorContext, ...context });
}

/**
 * Logs input parameters for debugging and tracing.
 * @async
 * @function
 * @param {Object} params - Input parameters to log.
 */
export async function logInputParams(params) {
  await info('Input parameters received', { params });
}

/**
 * Logs output results for debugging and tracing.
 * @async
 * @function
 * @param {Object} results - Output results to log.
 */
export async function logOutputResults(results) {
  await info('Output results generated', { results: JSON.stringify(results).substring(0, 200) + '...' });
}

/**
 * Logs the start of a job in edge runtime.
 * @async
 * @function
 * @param {string} jobId - The unique identifier for the job.
 */
export async function logJobStart(jobId) {
  await info(`Starting job ${jobId}`, { jobId });
}

/**
 * Logs the completion of a job in edge runtime.
 * @async
 * @function
 * @param {string} jobId - The unique identifier for the job.
 * @param {number} duration - The duration of the job in milliseconds.
 */
export async function logJobCompletion(jobId, duration) {
  await info(`Completed job ${jobId}`, { jobId, duration });
}

/**
 * Logs cache operations for better visibility into cache usage.
 * @async
 * @function
 * @param {string} operation - The cache operation (e.g., 'set', 'get', 'del').
 * @param {string} key - The cache key involved in the operation.
 * @param {*} [value] - The value involved in the operation (for 'set' operations).
 */
export async function logCacheOperation(operation, key, value) {
  const context = { operation, key };
  if (value !== undefined) {
    context.value = typeof value === 'object' ? JSON.stringify(value) : value;
  }
  await info(`Cache operation: ${operation}`, context);
}

export default {
  info,
  warn,
  error,
  logInputParams,
  logOutputResults,
  logJobStart,
  logJobCompletion,
  logCacheOperation
};
