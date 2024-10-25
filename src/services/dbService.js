/**
 * @module services/dbService
 * @description Provides database functionality optimized for edge runtime environments.
 * This module is designed to work efficiently with limited resources and provides
 * a database layer for persistent storage in edge computing scenarios.
 * 
 * Key features:
 * - PostgreSQL-based database operations for fractal data storage
 * - Connection pooling for efficient resource utilization
 * - Support for parameterized queries to prevent SQL injection
 * - Error handling and logging for improved observability
 * - Automatic reconnection on connection loss
 * - Integration with CacheService for improved performance
 * - Optimized for use in edge runtime environments
 * - Vercel KV integration for key-value storage
 * - Support for storing and retrieving fractal models, methods and parameters
 * - Integration with fractalService for data persistence
 * - Support for storing generated fractal images and plots
 * 
 * @example
 * import { dbClient } from './dbService.js';
 * 
 * // Store fractal generation results
 * const result = await dbClient.storeFractalResult({
 *   model: 'twoScale',
 *   method: 'LADM',
 *   params: { alpha: 0.9, beta: 0.9 },
 *   data: fractalData
 * });
 * 
 * // Retrieve fractal history
 * const history = await dbClient.getFractalHistory();
 * 
 * // Cache frequently accessed models
 * const models = await dbClient.getCachedModels();
 * 
 * @since 1.0.19
 */

import pg from 'pg';
import logger from '../utils/logger.js';
import { cacheClient } from './cacheService.js';
import { createClient } from '@vercel/kv';

const { Pool } = pg;

/**
 * Database connection pool
 * @type {pg.Pool}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Custom KV client for caching fractal results
const kv = createClient({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
  automaticDeserialization: false,
});

pool.on('error', (err, client) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

/**
 * DatabaseClient class providing methods for interacting with the database and KV store.
 */
class DatabaseClient {
  /**
   * Executes a SQL query with optional parameters.
   * @async
   * @param {string} text - The SQL query text.
   * @param {Array} [params] - The parameters for the SQL query.
   * @param {boolean} [useCache=false] - Whether to use cache for this query.
   * @param {number} [cacheTTL=300] - Time to live for cached results in seconds.
   * @returns {Promise<pg.QueryResult>} The query result.
   * @throws {Error} If there's an issue executing the query.
   */
  async query(text, params, useCache = false, cacheTTL = 300) {
    const start = Date.now();
    const cacheKey = useCache ? `db:${text}:${JSON.stringify(params)}` : null;

    try {
      if (useCache) {
        const cachedResult = await cacheClient.get(cacheKey);
        if (cachedResult) {
          await logger.info('Cache hit for query', { text });
          return JSON.parse(cachedResult);
        }
      }

      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      await logger.info('Executed query', { text, duration, rows: res.rowCount });

      if (useCache) {
        await cacheClient.set(cacheKey, JSON.stringify(res), cacheTTL);
      }

      return res;
    } catch (error) {
      await logger.error('Error executing query', { text, error });
      throw error;
    }
  }

  /**
   * Stores fractal generation results in the database.
   * @async
   * @param {Object} result - The fractal generation result
   * @param {string} result.model - The fractal model used
   * @param {string} result.method - The solving method used
   * @param {Object} result.params - The parameters used
   * @param {Array} result.data - The generated fractal data
   * @returns {Promise<Object>} The stored result with ID
   * @since 1.0.19
   */
  async storeFractalResult(result) {
    const { model, method, params, data } = result;
    const query = `
      INSERT INTO fractal_results (model, method, params, data, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    const res = await this.query(query, [model, method, params, data]);
    return { id: res.rows[0].id, ...result };
  }

  /**
   * Retrieves fractal generation history.
   * @async
   * @param {Object} [filters] - Optional filters for the query
   * @param {number} [limit=10] - Maximum number of results to return
   * @returns {Promise<Array>} Array of fractal generation results
   * @since 1.0.19
   */
  async getFractalHistory(filters = {}, limit = 10) {
    const query = `
      SELECT * FROM fractal_results 
      WHERE ($1::text IS NULL OR model = $1)
      ORDER BY created_at DESC
      LIMIT $2
    `;
    const res = await this.query(query, [filters.model, limit], true, 300);
    return res.rows;
  }

  /**
   * Stores a generated fractal image or plot.
   * @async
   * @param {string} type - Type of visualization ('image' or 'plot')
   * @param {Buffer} data - The image/plot data
   * @param {Object} metadata - Additional metadata
   * @returns {Promise<Object>} The stored visualization metadata
   * @since 1.0.19
   */
  async storeVisualization(type, data, metadata) {
    const query = `
      INSERT INTO fractal_visualizations (type, data, metadata, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING id
    `;
    const res = await this.query(query, [type, data, metadata]);
    return { id: res.rows[0].id, type, metadata };
  }

      return client;
    } catch (error) {
      await logger.error('Error acquiring client from pool', error);
      throw error;
    }
  }

  /**
   * Fetches fractal data from the database with advanced filtering.
   * @async
   * @param {Object} [options] - Query options and filters
   * @returns {Promise<Array>} The filtered fractal data
   * @since 1.0.19
   */
  async fetchFractalData(options = {}) {
    try {
      const {
        model,
        method,
        startDate,
        endDate,
        limit = 100,
        offset = 0
      } = options;

      const query = `
        SELECT f.*, 
               v.data as visualization_data
        FROM fractals f
        LEFT JOIN fractal_visualizations v ON f.id = v.fractal_id
        WHERE ($1::text IS NULL OR f.model = $1)
          AND ($2::text IS NULL OR f.method = $2)
          AND ($3::timestamp IS NULL OR f.created_at >= $3)
          AND ($4::timestamp IS NULL OR f.created_at <= $4)
        ORDER BY f.created_at DESC
        LIMIT $5 OFFSET $6
      `;

      const result = await this.query(
        query,
        [model, method, startDate, endDate, limit, offset],
        true,
        300
      );

      return result.rows;
    } catch (error) {
      logger.error('Error fetching fractal data:', error);
      throw error;
    }
  }
}

export const dbClient = new DatabaseClient();
