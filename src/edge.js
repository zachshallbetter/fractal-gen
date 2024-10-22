/**
 * @module EdgeRuntime
 * @description Provides edge-specific optimizations and configurations for running the Fractal Generator on edge devices.
 * This module is designed to work with Vercel's Edge Runtime and Node.js, addressing resource constraints and performance considerations.
 * It includes request throttling, memory optimization, graceful shutdown mechanisms, job management, and statistics reporting.
 * @since 1.0.12
 * 
 * - Optimized for edge devices with limited CPU, memory, and storage.
 * - Implements efficient concurrency handling and robust error management.
 * - Utilizes async programming to prevent blocking the event loop.
 * - Includes logging and monitoring for performance tracking.
 * - Designed for compatibility with various edge device architectures and operating systems.
 * - Integrates with FractalGeneratorService for consistent fractal generation across different application entry points.
 * - Utilizes DatabaseService for efficient data persistence and retrieval in edge environments.
 * - Supports multiple fractal models and methods as defined in ModelSelector.
 */

import { processFractalRequest, getModels, getMethods } from './fractalService.js';
import { cacheClient } from './cacheService.js';
import { dbClient } from './dbService.js';
import { logger } from './utils/logger.js';
import { validateParameters } from './utils/validation.js';

// Constants for resource management
const MAX_CONCURRENT_REQUESTS = 5;
const CHUNK_SIZE = 1024;
const MEMORY_OPTIMIZATION_INTERVAL = 60000; // 1 minute

/**
 * Configures the application for edge runtime, optimizing for performance and resource usage.
 * @function
 * @async
 * @param {Object} req - The incoming request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>}
 * @throws {Error} If there's an issue processing the request or configuring the edge runtime.
 */
export default async function edgeRuntime(req, res) {
  let jobId;
  const startTime = Date.now();

  try {
    // Enable streaming for improved performance
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Implement request throttling to manage concurrency
    if (!await acquireConcurrencySlot()) {
      res.status(429).json({
        error: 'Too many requests. Please try again later.',
        code: 'EDGE_CONCURRENCY_LIMIT_EXCEEDED',
        limit: MAX_CONCURRENT_REQUESTS
      });
      return;
    }

    // Generate a unique job ID
    jobId = generateJobId();
    logger.info(`Starting job ${jobId}`);

    // Process the fractal request
    const params = req.body;
    validateParameters(params);
    const result = await processFractalRequest(params);

    if (!result.success) {
      throw new Error(result.message);
    }

    const data = result.data;

    // Stream the response in chunks to reduce memory usage
    const totalChunks = Math.ceil(data.length / CHUNK_SIZE);
    
    res.write(JSON.stringify({
      jobId: jobId,
      totalChunks: totalChunks,
      chunkSize: CHUNK_SIZE,
      dataLength: data.length
    }));

    for (let i = 0; i < data.length; i += CHUNK_SIZE) {
      const chunk = data.slice(i, i + CHUNK_SIZE);
      res.write(JSON.stringify({
        chunkIndex: Math.floor(i / CHUNK_SIZE),
        data: chunk
      }));

      // Update job progress in cache
      await updateJobProgress(jobId, Math.floor((i + CHUNK_SIZE) / data.length * 100));

      // Yield to event loop to prevent blocking
      await new Promise(resolve => setImmediate(resolve));
    }

    res.end(JSON.stringify({ status: 'complete' }));

    // Mark job as completed
    await completeJob(jobId);
    logger.info(`Completed job ${jobId}`);
  } catch (error) {
    logger.error(`Edge runtime error in job ${jobId}:`, error);
    res.status(500).json({
      error: 'Internal server error in edge runtime',
      code: 'EDGE_INTERNAL_ERROR',
      message: error.message
    });

    // Mark job as failed
    if (jobId) {
      await failJob(jobId, error.message);
    }
  } finally {
    releaseConcurrencySlot();
    const duration = Date.now() - startTime;
    logger.info(`Job ${jobId} took ${duration}ms to process`);
  }
}

/**
 * Attempts to acquire a concurrency slot.
 * @function
 * @async
 * @returns {Promise<boolean>} True if a slot was acquired, false otherwise.
 */
async function acquireConcurrencySlot() {
  const activeRequests = await cacheClient.incr('activeRequests');
  if (activeRequests > MAX_CONCURRENT_REQUESTS) {
    await cacheClient.decr('activeRequests');
    return false;
  }
  return true;
}

/**
 * Releases a concurrency slot.
 * @function
 * @async
 */
async function releaseConcurrencySlot() {
  await cacheClient.decr('activeRequests');
}

/**
 * Generates a unique job ID.
 * @function
 * @returns {string} A unique job ID.
 */
function generateJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Updates the progress of a job in the cache.
 * @function
 * @async
 * @param {string} jobId - The ID of the job.
 * @param {number} progress - The progress percentage of the job.
 */
async function updateJobProgress(jobId, progress) {
  await cacheClient.set(`job:${jobId}:progress`, progress);
}

/**
 * Marks a job as completed in both cache and database.
 * @function
 * @async
 * @param {string} jobId - The ID of the job to mark as completed.
 */
async function completeJob(jobId) {
  await cacheClient.set(`job:${jobId}:status`, 'completed');
  await dbClient.query('UPDATE jobs SET status = $1, completed_at = NOW() WHERE job_id = $2', ['completed', jobId]);
}

/**
 * Marks a job as failed in both cache and database.
 * @function
 * @async
 * @param {string} jobId - The ID of the job to mark as failed.
 * @param {string} errorMessage - The error message describing the failure.
 */
async function failJob(jobId, errorMessage) {
  await cacheClient.set(`job:${jobId}:status`, 'failed');
  await cacheClient.set(`job:${jobId}:error`, errorMessage);
  await dbClient.query('UPDATE jobs SET status = $1, error_message = $2, failed_at = NOW() WHERE job_id = $3', ['failed', errorMessage, jobId]);
}

/**
 * Optimizes memory usage by implementing a simple garbage collection trigger.
 * @function
 */
function optimizeMemoryUsage() {
  if (global.gc) {
    global.gc();
  }
  logger.info('Memory optimization performed');
}

// Trigger memory optimization periodically
setInterval(optimizeMemoryUsage, MEMORY_OPTIMIZATION_INTERVAL);

/**
 * Implements graceful shutdown for the edge runtime.
 * @function
 * @async
 */
async function gracefulShutdown() {
  logger.info('Shutting down edge runtime gracefully...');
  
  // Complete or restart in-process jobs
  const inProcessJobs = await cacheClient.keys('job:*:status');
  for (const jobKey of inProcessJobs) {
    const jobId = jobKey.split(':')[1];
    const status = await cacheClient.get(jobKey);
    if (status === 'in_progress') {
      await failJob(jobId, 'Job interrupted due to server shutdown');
    }
  }

  // Close database and cache connections
  await dbClient.end();
  await cacheClient.quit();

  logger.info('Edge runtime shut down successfully');
  process.exit(0);
}

// Handle termination signals
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Error handling for uncaught exceptions
process.on('uncaughtException', async (error) => {
  logger.error('Uncaught Exception:', error);
  await reportError('uncaughtException', error);
});

// Error handling for unhandled promise rejections
process.on('unhandledRejection', async (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  await reportError('unhandledRejection', reason);
});

/**
 * Reports an error to the database for logging and analysis.
 * @function
 * @async
 * @param {string} type - The type of error (e.g., 'uncaughtException', 'unhandledRejection').
 * @param {Error|any} error - The error object or reason for the error.
 */
async function reportError(type, error) {
  try {
    await dbClient.query('INSERT INTO error_logs (error_type, error_message, stack_trace) VALUES ($1, $2, $3)', 
      [type, error.message || String(error), error.stack || '']);
    logger.error(`Reported ${type} error to database`);
  } catch (dbError) {
    logger.error('Failed to log error to database:', dbError);
  }
}

/**
 * Retrieves available fractal models.
 * @function
 * @returns {string[]} Array of available model names.
 */
export function getAvailableModels() {
  return getModels();
}

/**
 * Retrieves available methods for a given fractal model.
 * @function
 * @param {string} model - The name of the fractal model.
 * @returns {string[]} Array of available method names for the specified model.
 * @throws {Error} If the model is not recognized.
 */
export function getAvailableMethods(model) {
  return getMethods(model);
}
