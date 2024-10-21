/**
 * @module visualizations/imageGenerator
 * @description Creates static images of the fractal data using the Canvas API.
 * @since 1.0.1
 * 
 * This module generates static images of fractal data using the Canvas API. It achieves its intent by:
 * - Creating a canvas with specified dimensions
 * - Drawing the background in black
 * - Scaling the data points based on their maximum values
 * - Drawing the fractal data points on the canvas
 * - Saving the generated image as a PNG file
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function createFractalImage(data) {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Draw background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);

  // Scale data
  const maxX = Math.max(...data.map(point => point.x));
  const maxY = Math.max(...data.map(point => point.y));

  // Draw fractal data points
  ctx.fillStyle = 'white';
  data.forEach(point => {
    const x = (point.x / maxX) * width;
    const y = height - (point.y / maxY) * height;
    ctx.fillRect(x, y, 2, 2);
  });

  // Save image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join('images', 'fractal.png'), buffer);
}

module.exports = { createFractalImage };