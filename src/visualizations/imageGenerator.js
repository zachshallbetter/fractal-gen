/**
 * @module visualizations/imageGenerator
 * @description Creates static images of fractal data using the Canvas API.
 * Integrates with the fractal generation process to provide visual representations of generated fractals.
 * @since 1.0.8
 */

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

/**
 * Creates a static image of fractal data.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The fractal data points to visualize.
 * @param {Object} [options] - Optional parameters for image generation.
 * @param {number} [options.width=800] - The width of the image in pixels.
 * @param {number} [options.height=600] - The height of the image in pixels.
 * @param {string} [options.backgroundColor='#000000'] - The background color of the image.
 * @param {string} [options.pointColor='#FFFFFF'] - The color of the fractal data points.
 * @param {number} [options.pointSize=2] - The size of each data point in pixels.
 * @throws {Error} If there's an issue creating or saving the image.
 */
async function createFractalImage(data, options = {}) {
  const {
    width = 800,
    height = 600,
    backgroundColor = '#000000',
    pointColor = '#FFFFFF',
    pointSize = 2
  } = options;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  try {
    // Draw background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Scale data
    const maxX = Math.max(...data.map(point => point.x));
    const maxY = Math.max(...data.map(point => point.y));
    const minY = Math.min(...data.map(point => point.y));

    // Draw fractal data points
    ctx.fillStyle = pointColor;
    data.forEach(point => {
      const x = (point.x / maxX) * width;
      const y = height - ((point.y - minY) / (maxY - minY)) * height;
      ctx.fillRect(x, y, pointSize, pointSize);
    });

    // Save image
    const imagePath = path.join('visualizations', 'fractalImage.png');
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(imagePath, buffer);
    console.log(`Fractal image saved to ${imagePath}.`);
  } catch (error) {
    console.error('Error creating or saving the fractal image:', error);
    throw new Error('Failed to create or save the fractal image');
  }
}

export { createFractalImage };
