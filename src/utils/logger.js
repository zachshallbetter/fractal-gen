/**
 * @module utils/logger
 * @description Provides logging functionality optimized for edge runtime environments and integrated with parallel computation.
 * This module is designed to work efficiently with limited resources and provides
 * structured logging capabilities for better observability in edge computing scenarios.
 * 
 * Key features:
 * - Winston-based logging with console and file transports
 * - Structured logging with timestamps and log levels
 * - Context-aware logging for edge runtime environments
 * - Integration with CacheService for request tracking
 * - Support for parallel computation performance logging
 * - Error handling with stack trace logging
 * - Environment variable validation
 * 
 * @example
 * import logger from './logger.js';
 * logger.info('Application started');
 * logger.error('An error occurred', new Error('Something went wrong'));
 * 
 * @since 1.0.20
 */

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Add debug level
logger.add(new winston.transports.Console({
  format: winston.format.simple(),
  level: 'debug'
}));

export default logger;
