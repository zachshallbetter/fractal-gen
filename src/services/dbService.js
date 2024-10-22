/**
 * @module DatabaseService
 * @description Provides database functionality optimized for edge runtime environments.
 * This module is designed to work efficiently with limited resources and provides
 * a database layer for persistent storage in edge computing scenarios.
 * 
 * Key features:
 * - PostgreSQL-based database operations
 * - Connection pooling for efficient resource utilization
 * - Support for parameterized queries to prevent SQL injection
 * - Error handling and logging for improved observability
 * - Automatic reconnection on connection loss
 * - Integration with CacheService for improved performance
 * - Optimized for use in edge runtime environments
 * - Vercel KV integration for key-value storage
 * 
 * @example
 * import { dbClient } from './dbService.js';
 * 
 * // Execute a query
 * const result = await dbClient.query('SELECT * FROM users WHERE id = $1', [userId]);
 * 
 * // Use caching
 * const cachedResult = await dbClient.query('SELECT * FROM products', [], true, 600);
 * 
 * // Perform a health check
 * const isHealthy = await dbClient.healthCheck();
 * 
 * // Use Vercel KV
 * await dbClient.setKV('user_1_session', 'session_token_value');
 * const session = await dbClient.getKV('user_1_session');
 * 
 * @since 1.0.18
 */

import pg from 'pg';
import logger from '../utils/logger.js';
import { cacheClient } from './cacheService.js';
import { kv } from "@vercel/kv";

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
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait when connecting a new client
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
   * Sets a value in the Vercel KV store.
   * @async
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue setting the value.
   */
  async setKV(key, value) {
    try {
      await kv.set(key, value);
      await logger.info('Set value in KV store', { key });
    } catch (error) {
      await logger.error('Error setting value in KV store', { key, error });
      throw error;
    }
  }

  /**
   * Gets a value from the Vercel KV store.
   * @async
   * @param {string} key - The key to get.
   * @returns {Promise<string|null>} The value from the KV store, or null if not found.
   * @throws {Error} If there's an issue getting the value.
   */
  async getKV(key) {
    try {
      const value = await kv.get(key);
      await logger.info('Got value from KV store', { key });
      return value;
    } catch (error) {
      await logger.error('Error getting value from KV store', { key, error });
      throw error;
    }
  }

  /**
   * Acquires a new database client from the pool.
   * @async
   * @returns {Promise<pg.PoolClient>} A database client.
   * @throws {Error} If there's an issue acquiring a client.
   */
  async getClient() {
    try {
      const client = await pool.connect();
      const query = client.query;
      const release = client.release;

      // Set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(async () => {
        await logger.error('A client has been checked out for more than 5 seconds!');
        await logger.error(`The last executed query on this client was: ${client.lastQuery}`);
      }, 5000);

      // Monkey patch the query method to keep track of the last query executed
      client.query = (...args) => {
        client.lastQuery = args;
        return query.apply(client, args);
      };

      client.release = () => {
        clearTimeout(timeout);
        client.query = query;
        client.release = release;
        return release.apply(client);
      };

      return client;
    } catch (error) {
      await logger.error('Error acquiring client from pool', error);
      throw error;
    }
  }

  /**
   * Ends the database connection pool.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue ending the pool.
   */
  async end() {
    try {
      await pool.end();
      await logger.info('Database connection pool has ended');
    } catch (error) {
      await logger.error('Error ending database connection pool', error);
      throw error;
    }
  }

  /**
   * Performs a health check on the database connection.
   * @async
   * @returns {Promise<boolean>} True if the database is healthy, false otherwise.
   */
  async healthCheck() {
    try {
      await this.query('SELECT 1');
      return true;
    } catch (error) {
      await logger.error('Database health check failed', error);
      return false;
    }
  }
}

export const dbClient = new DatabaseClient();

/**
 * Fetches data from the database.
 *
 * @returns {Promise<any>} The data from the database.
 * @since 1.0.1
 */
async function fetchData() {
    try {
        const data = await dbClient.query('SELECT * FROM fractals');
        return data;
    } catch (error) {
        logger.error(error);
        throw error;
    }
}
