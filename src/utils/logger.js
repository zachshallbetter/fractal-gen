/**
 * @module Logger
 * @description Provides logging functionality optimized for edge runtime environments.
 * This module is designed to work efficiently with limited resources and provides
 * structured logging capabilities for better observability in edge computing scenarios.
 * 
 * - Uses Winston for logging
 * - Logs to console and file
 * - Logs active requests and memory usage
 * - Logs node version and platform
 * 
 * @example
 * import logger from './logger.js';
 * logger.info('This is an info message');
 * logger.warn('This is a warning message');
 * logger.error('This is an error message');
 * 
 * @since 1.0.12
 */

import { createLogger, format, transports } from 'winston';
import { cacheClient } from '../cacheService.js';

const { combine, timestamp, printf, colorize } = format;

/**
 * Custom log format that includes timestamp, log level, and message.
 */
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
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

  return {
    activeRequests,
    memoryUsage: {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed
    },
    nodeVersion: process.version,
    platform: process.platform
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

export default {
  info,
  warn,
  error
};
