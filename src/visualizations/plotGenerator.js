/**
 * @module visualizations/plotGenerator
 * @description Generates plots using the Canvas API.
 * @since 1.0.6
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

async function createInteractivePlot(data) {
  const width = 800; // Width of the image
  const height = 600; // Height of the image
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

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
  fs.writeFileSync(imagePath, buffer);

  console.log(`Plot image saved to ${imagePath}.`);
}

module.exports = { createInteractivePlot };
