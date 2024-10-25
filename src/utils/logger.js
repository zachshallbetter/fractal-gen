/**
 * @module logger
 * @description Provides a logging utility.
 * @since 1.0.1
 */

import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
