/**
 * @module visualizations/plotGenerator
 * @description Generates plots using the Canvas API for fractal data visualization.
 * Integrates with the fractal generation process to provide visual representations of generated fractals.
 * @since 1.0.7
 */

import { createCanvas } from 'canvas';
import fs from 'fs/promises';
import path from 'path';

/**
 * Creates an interactive plot of fractal data.
 * @async
 * @function
 * @param {Array<{x: number, y: number}>} data - The fractal data points to plot.
 * @throws {Error} If there's an issue creating or saving the plot.
 */
async function createInteractivePlot(data) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  try {
    // Draw background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Scale data
    const maxX = Math.max(...data.map(point => point.x));
    const maxY = Math.max(...data.map(point => point.y));
    const minY = Math.min(...data.map(point => point.y));

    // Draw fractal data points
    ctx.strokeStyle = '#17BECF';
    ctx.lineWidth = 2;
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

    // Save image
    const imagePath = path.join('plots', 'fractalPlot.png');
    const buffer = canvas.toBuffer('image/png');
    await fs.writeFile(imagePath, buffer);
    console.log(`Plot image saved to ${imagePath}.`);
  } catch (error) {
    console.error('Error creating or saving the plot:', error);
    throw new Error('Failed to create or save the plot');
  }
}

export { createInteractivePlot };
