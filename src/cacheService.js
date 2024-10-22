/**
 * @module CacheService
 * @description Provides caching functionality optimized for edge runtime environments.
 * This module is designed to work efficiently with limited resources and provides
 * a caching layer for improved performance in edge computing scenarios.
 * 
 * Key features:
 * - KV-based caching for fast data retrieval and storage
 * - Support for key-value operations with optional expiration
 * - Increment and decrement operations for numeric values
 * - Pattern-based key retrieval
 * - Error handling and logging for improved observability
 * 
 * @since 1.0.15
 */

import { kv } from '@vercel/kv';
import { logger } from './utils/logger.js';

/**
 * CacheClient class providing methods for interacting with the cache.
 */
class CacheClient {
  /**
   * Sets a value in the cache.
   * @async
   * @param {string} key - The key to set.
   * @param {string} value - The value to set.
   * @param {number} [expiration] - Optional expiration time in seconds.
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue setting the cache.
   */
  async set(key, value, expiration) {
    try {
      if (expiration) {
        await kv.set(key, value, { ex: expiration });
      } else {
        await kv.set(key, value);
      }
      logger.info(`Cache set: ${key}`);
    } catch (error) {
      logger.error('Error setting cache:', error);
      throw error;
    }
  }

  /**
   * Gets a value from the cache.
   * @async
   * @param {string} key - The key to get.
   * @returns {Promise<string|null>} The value from the cache, or null if not found.
   * @throws {Error} If there's an issue retrieving from the cache.
   */
  async get(key) {
    try {
      const value = await kv.get(key);
      logger.info(`Cache ${value ? 'hit' : 'miss'}: ${key}`);
      return value;
    } catch (error) {
      logger.error('Error getting from cache:', error);
      throw error;
    }
  }

  /**
   * Deletes a value from the cache.
   * @async
   * @param {string} key - The key to delete.
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue deleting from the cache.
   */
  async del(key) {
    try {
      await kv.del(key);
      logger.info(`Cache delete: ${key}`);
    } catch (error) {
      logger.error('Error deleting from cache:', error);
      throw error;
    }
  }

  /**
   * Increments a numeric value in the cache.
   * @async
   * @param {string} key - The key to increment.
   * @returns {Promise<number>} The new value after incrementing.
   * @throws {Error} If there's an issue incrementing the cache value.
   */
  async incr(key) {
    try {
      const newValue = await kv.incr(key);
      logger.info(`Cache increment: ${key}, new value: ${newValue}`);
      return newValue;
    } catch (error) {
      logger.error('Error incrementing cache:', error);
      throw error;
    }
  }

  /**
   * Decrements a numeric value in the cache.
   * @async
   * @param {string} key - The key to decrement.
   * @returns {Promise<number>} The new value after decrementing.
   * @throws {Error} If there's an issue decrementing the cache value.
   */
  async decr(key) {
    try {
      const newValue = await kv.decr(key);
      logger.info(`Cache decrement: ${key}, new value: ${newValue}`);
      return newValue;
    } catch (error) {
      logger.error('Error decrementing cache:', error);
      throw error;
    }
  }

  /**
   * Retrieves all keys matching a pattern.
   * @async
   * @param {string} pattern - The pattern to match keys against.
   * @returns {Promise<string[]>} An array of matching keys.
   * @throws {Error} If there's an issue retrieving cache keys.
   */
  async keys(pattern) {
    try {
      const keys = await kv.keys(pattern);
      logger.info(`Cache keys retrieved for pattern: ${pattern}`);
      return keys;
    } catch (error) {
      logger.error('Error retrieving cache keys:', error);
      throw error;
    }
  }

  /**
   * Closes the KV connection.
   * @async
   * @returns {Promise<void>}
   * @throws {Error} If there's an issue closing the KV connection.
   */
  async quit() {
    try {
      // Note: @vercel/kv doesn't require an explicit connection close
      logger.info('KV connection closed');
    } catch (error) {
      logger.error('Error closing KV connection:', error);
      throw error;
    }
  }
}

export const cacheClient = new CacheClient();
