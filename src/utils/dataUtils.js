/**
 * @module utils/dataUtils
 * @description Utility functions for data processing and manipulation used by fractalService and edgeService.
 * This module achieves its intent by:
 * - Processing and validating input parameters from command line arguments
 * - Managing data output and storage with proper validation
 * - Optimizing data structures for edge runtime environments
 * - Providing statistical analysis of fractal computations
 * - Integrating with database services for persistent storage
 * - Supporting parallel computation through data chunking
 * 
 * @example
 * import { validateFractalParams, storeFractalResult } from './dataUtils.js';
 * 
 * const params = validateFractalParams(inputParams);
 * const result = await storeFractalResult(computationResult, metadata);
 * 
 * @since 1.0.1
 */

import { dbClient } from '../services/dbService.js';
import logger from './logger.js';
import { validateArray, validateObject } from './validation.js';
import { ParallelComputation } from './parallelComputation.js';

/**
 * Chunks data into smaller pieces for efficient parallel processing in edge environments.
 * @param {Array} data - The data array to chunk
 * @param {number} size - Size of each chunk
 * @returns {Array<Array>} Array of data chunks
 * @since 1.0.2
 */
export function chunkData(data, size = 1024) {
  validateArray(data, 'Input data');
  const chunks = [];
  for (let i = 0; i < data.length; i += size) {
    chunks.push(data.slice(i, i + size));
  }
  return chunks;
}

/**
 * Stores fractal computation results with metadata and generates output files.
 * @async
 * @param {Object} result - The computation result
 * @param {Object} metadata - Additional metadata about the computation
 * @returns {Promise<Object>} Stored result with ID and file paths
 * @throws {Error} If storage or file operations fail
 * @since 1.0.2
 */
export async function storeFractalResult(result, metadata) {
  try {
    validateObject(result, 'Computation result');
    validateObject(metadata, 'Result metadata');

    const parallelComputation = new ParallelComputation();
    
    // Store result in database
    const storedResult = await dbClient.storeFractalResult({
      ...result,
      metadata,
      timestamp: new Date()
    });

    // Generate output files in parallel
    const outputTasks = [
      () => generateDataFile(result, metadata),
      () => generateVisualization(result, metadata)
    ];
    const [dataPath, visualPath] = await parallelComputation.executeTasks(outputTasks);

    logger.info('Stored fractal result and generated outputs', { 
      id: storedResult.id,
      dataPath,
      visualPath
    });

    return {
      ...storedResult,
      dataPath,
      visualPath
    };
  } catch (error) {
    logger.error('Failed to store fractal result:', error);
    throw error;
  }
}

/**
 * Retrieves and validates fractal computation history.
 * @async
 * @param {Object} filters - Query filters
 * @param {number} limit - Maximum results to return
 * @returns {Promise<Array>} Filtered computation history
 * @since 1.0.2
 */
export async function getFractalHistory(filters = {}, limit = 10) {
  try {
    validateObject(filters, 'History filters');
    const history = await dbClient.getFractalHistory(filters, limit);
    validateArray(history, 'Computation history');
    
    logger.info('Retrieved fractal history', { count: history.length });
    return history;
  } catch (error) {
    logger.error('Failed to retrieve fractal history:', error);
    throw error;
  }
}

/**
 * Validates and processes fractal parameters based on command line arguments.
 * @param {Object} params - The parameters to validate
 * @returns {Object} Processed parameters
 * @throws {Error} If validation fails
 * @since 1.0.2
 */
export function validateFractalParams(params) {
  validateObject(params, 'Input parameters');

  const processed = { ...params };
  
  // Validate required fields from input handler
  const required = ['model', 'method', 'alpha', 'beta', 'maxTerms'];
  for (const field of required) {
    if (!processed[field]) {
      throw new Error(`Missing required parameter: ${field}`);
    }
  }

  // Validate numerical parameters
  if (processed.alpha <= 0 || processed.alpha > 1) {
    throw new Error('Alpha must be between 0 and 1');
  }
  if (processed.beta <= 0 || processed.beta > 1) {
    throw new Error('Beta must be between 0 and 1');
  }
  if (processed.maxTerms < 1) {
    throw new Error('maxTerms must be positive');
  }

  return processed;
}

/**
 * Optimizes data structures for edge runtime processing.
 * @param {Array|Object} data - Data to optimize
 * @returns {Array|Object} Optimized data
 * @since 1.0.2
 */
export function optimizeForEdge(data) {
  if (Array.isArray(data)) {
    validateArray(data, 'Input data');
    return data.map(item => 
      typeof item === 'number' ? Number(item.toFixed(6)) : item
    );
  } else if (typeof data === 'object') {
    validateObject(data, 'Input data');
    const optimized = {};
    for (const [key, value] of Object.entries(data)) {
      optimized[key] = typeof value === 'number' ? 
        Number(value.toFixed(6)) : value;
    }
    return optimized;
  }
  return data;
}

/**
 * Aggregates and validates fractal computation statistics.
 * @async
 * @param {string} model - Fractal model name
 * @param {string} method - Computation method
 * @returns {Promise<Object>} Computation statistics
 * @since 1.0.2
 */
export async function getFractalStats(model, method) {
  try {
    if (!model || !method) {
      throw new Error('Model and method are required');
    }

    const stats = await dbClient.query(`
      SELECT 
        COUNT(*) as total_computations,
        AVG(EXTRACT(EPOCH FROM (completed_at - created_at))) as avg_duration,
        MAX(EXTRACT(EPOCH FROM (completed_at - created_at))) as max_duration,
        MIN(EXTRACT(EPOCH FROM (completed_at - created_at))) as min_duration
      FROM fractal_results 
      WHERE model = $1 AND method = $2 AND completed_at IS NOT NULL
    `, [model, method], true, 300);
    
    validateObject(stats.rows[0], 'Computation statistics');
    return stats.rows[0];
  } catch (error) {
    logger.error('Failed to retrieve fractal statistics:', error);
    throw error;
  }
}
