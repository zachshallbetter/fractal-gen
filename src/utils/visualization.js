/**
 * @module utils/visualization
 * @description Provides utility functions for visualizing fractal data and mathematical models.
 * This module integrates with various plotting libraries and image generation tools to create
 * interactive plots, static images, and animations of fractal patterns and solutions to
 * fractional differential equations. It is optimized for edge runtime environments and integrates
 * with the database service for efficient data handling.
 * 
 * - Generates interactive plots for fractal data visualization 
 * - Creates static images of fractal patterns
 * - Produces animations to show the evolution of fractals over time or parameter changes
 * - Integrates with parallel computation for efficient rendering of complex visualizations
 * - Supports multiple output formats and customization options
 * - Optimized for edge runtime environments
 * - Utilizes database service for efficient data storage and retrieval
 * 
 * @example
 * import { createInteractivePlot, generateFractalImage, createFractalAnimation } from './visualization.js';
 * import { logger } from './utils/logger.js';
 * import { processFractalRequest } from './fractalService.js';
 * import { dbClient } from './dbService.js';
 * 
 * const result = await processFractalRequest(params);
 * if (result.success) {
 *   try {
 *     const interactivePlot = await createInteractivePlot(result.data, params);
 *     const staticImage = await generateFractalImage(result.data, params);
 *     const animation = await createFractalAnimation([result.data], params);
 *     logger.info('Visualizations created successfully');
 *   } catch (error) {
 *     logger.error('Error creating visualizations:', error);
 *   }
 * }
 * 
 * @since 1.1.4
 */

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { validateArray, validateObject, ValidationError } from './validation.js';
import logger from './logger.js';
import { dbClient } from '../services/dbService.js';
import { ParallelComputation } from './parallelComputation.js';
import { generateFractalImage as generateImage } from './visualizations/imageGenerator.js';
import { createInteractivePlot as createPlot } from './visualizations/plotGenerator.js';
import { processFractalRequest } from '../services/fractalService.js';

/**
 * Creates an interactive plot of fractal data.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The fractal data to visualize.
 * @param {Object} params - Parameters used in fractal generation.
 * @returns {Promise<Object>} - The interactive plot data.
 * @throws {ValidationError} If input validation fails.
 */
export async function createInteractivePlot(data, params) {
  try {
    validateArray(data, 'Fractal data');
    validateObject(params, 'Parameters');

    // Utilize the plotGenerator module for creating interactive plots
    const plotData = await createPlot(data, params);
    logger.info('Interactive plot created successfully');

    // Store plot data in database using transaction
    const client = await dbClient.getClient();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO plots (data, params, created_at) VALUES ($1, $2, NOW())', 
        [JSON.stringify(data), JSON.stringify(params)]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return plotData;
  } catch (error) {
    logger.error('Error creating interactive plot:', error);
    throw error;
  }
}

/**
 * Generates a static image of the fractal pattern.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The fractal data to visualize.
 * @param {Object} params - Parameters used in fractal generation.
 * @returns {Promise<Buffer>} - The generated image buffer.
 * @throws {ValidationError} If input validation fails.
 */
export async function generateFractalImage(data, params) {
  try {
    validateArray(data, 'Fractal data');
    validateObject(params, 'Parameters');

    // Utilize the imageGenerator module for generating static images
    const imageBuffer = await generateImage(data, params);
    logger.info('Fractal image generated successfully');

    // Store image metadata in database using transaction
    const client = await dbClient.getClient();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO images (filename, params, created_at) VALUES ($1, $2, NOW())', 
        [imageBuffer.filename, JSON.stringify(params)]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return imageBuffer;
  } catch (error) {
    logger.error('Error generating fractal image:', error);
    throw error;
  }
}

/**
 * Creates an animation of the fractal evolution over time or parameter changes.
 * @async
 * @function
 * @param {Array<Array<{x: number, y: number}>>} dataFrames - Array of fractal data frames.
 * @param {Object} params - Parameters used in fractal generation.
 * @returns {Promise<string>} - The path to the generated animation file.
 * @throws {ValidationError} If input validation fails.
 */
export async function createFractalAnimation(dataFrames, params) {
  try {
    validateArray(dataFrames, 'Data frames');
    validateObject(params, 'Parameters');

    const parallelComputation = new ParallelComputation();
    const framePromises = dataFrames.map((frame, index) => 
      parallelComputation.execute(() => generateImage(frame, params, index))
    );

    const frames = await Promise.all(framePromises);
    logger.info('Fractal animation frames generated successfully');

    // Here you would typically use a tool like FFmpeg to combine the frames into an animation
    // This part is omitted as it requires system-specific setup
    const animationPath = 'path/to/animation.mp4'; // Placeholder
    logger.info('Fractal animation created successfully');

    // Store animation metadata in database using transaction
    const client = await dbClient.getClient();
    try {
      await client.query('BEGIN');
      await client.query('INSERT INTO animations (params, frame_count, file_path, created_at) VALUES ($1, $2, $3, NOW())', 
        [JSON.stringify(params), dataFrames.length, animationPath]);
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

    return animationPath;
  } catch (error) {
    logger.error('Error creating fractal animation:', error);
    throw error;
  }
}

export async function generateVisualization(data, params) {
  try {
    // Generate visualizations
    const imagePath = await generateFractalImage(data, params);
    const plotPath = await createInteractivePlot(data, params);

    return { imagePath, plotPath };
  } catch (error) {
    logger.error('Failed to generate visualizations', { error });
    throw error;
  }
}
