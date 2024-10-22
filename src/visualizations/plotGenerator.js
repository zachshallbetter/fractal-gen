/**
 * @module visualizations/plotGenerator
 * @description Generates plots using the Canvas API for fractal data visualization.
 * Integrates with the fractal generation process to provide visual representations of generated fractals.
 * Supports interactive and static plot generation with customizable options.
 * @since 1.0.9
 */

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';
import { validateNumber, validateArray } from '../utils/validation.js';
import logger from '../utils/logger.js';

/**
 * Creates an interactive or static plot of fractal data.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The fractal data points to plot.
 * @param {Object} params - Parameters for plot generation.
 * @param {number} [params.width=800] - Width of the plot in pixels.
 * @param {number} [params.height=600] - Height of the plot in pixels.
 * @param {string} [params.backgroundColor='#ffffff'] - Background color of the plot.
 * @param {string} [params.lineColor='#17BECF'] - Color of the plotted line.
 * @param {number} [params.lineWidth=2] - Width of the plotted line.
 * @param {boolean} [params.interactive=false] - Whether to generate an interactive plot.
 * @returns {Promise<string>} The path to the saved plot image.
 * @throws {Error} If there's an issue creating or saving the plot.
 */
async function createPlot(data, params = {}) {
  validateArray(data, 'Fractal data', 2);
  
  const {
    width = 800,
    height = 600,
    backgroundColor = '#ffffff',
    lineColor = '#17BECF',
    lineWidth = 2,
    interactive = false
  } = params;

  validateNumber(width, 'Width', 100, 4000);
  validateNumber(height, 'Height', 100, 3000);
  validateNumber(lineWidth, 'Line width', 1, 10);

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
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();

    data.forEach((point, index) => {
      const x = (point.x / maxX) * width;
      const y = height - ((point.y - minY) / (maxY - minY)) * height;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Add axes and labels if interactive
    if (interactive) {
      drawAxes(ctx, width, height, maxX, maxY, minY);
    }

    // Save image
    const fileName = interactive ? 'interactiveFractalPlot.png' : 'fractalPlot.png';
    const imagePath = path.join('plots', fileName);
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(imagePath, buffer);
    logger.info(`Plot image saved to ${imagePath}.`);
    return imagePath;
  } catch (error) {
    logger.error('Error creating or saving the plot:', error);
    throw new Error('Failed to create or save the plot');
  }
}

/**
 * Draws axes and labels on the plot.
 * @private
 * @function
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
 * @param {number} width - Width of the canvas.
 * @param {number} height - Height of the canvas.
 * @param {number} maxX - Maximum X value in the data.
 * @param {number} maxY - Maximum Y value in the data.
 * @param {number} minY - Minimum Y value in the data.
 */
function drawAxes(ctx, width, height, maxX, maxY, minY) {
  ctx.strokeStyle = '#000000';
  ctx.fillStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.font = '12px Arial';

  // X-axis
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(width, height);
  ctx.stroke();

  // Y-axis
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, height);
  ctx.stroke();

  // X-axis labels
  for (let i = 0; i <= 10; i++) {
    const x = (i / 10) * width;
    const label = (i / 10 * maxX).toFixed(2);
    ctx.fillText(label, x, height - 10);
  }

  // Y-axis labels
  for (let i = 0; i <= 10; i++) {
    const y = height - (i / 10) * height;
    const label = (minY + (i / 10) * (maxY - minY)).toFixed(2);
    ctx.fillText(label, 5, y);
  }
}

export { createPlot };
