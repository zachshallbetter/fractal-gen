/**
 * @module utils/outputHandler
 * @description Handles the output of results, including saving data files and generating visualizations.
 * @since 1.0.1
 */

const fs = require('fs');
const path = require('path');
const { createInteractivePlot } = require('../visualizations/plotGenerator');
const { createFractalImage } = require('../visualizations/imageGenerator');

async function outputResults(data, params) {
  // Ensure directories exist
  fs.mkdirSync('data', { recursive: true });
  fs.mkdirSync('plots', { recursive: true });
  fs.mkdirSync('images', { recursive: true });

  // Save data to file
  fs.writeFileSync(path.join('data', 'fractalData.json'), JSON.stringify(data, null, 2));

  // Generate visualizations
  await createInteractivePlot(data);
  createFractalImage(data);
}

module.exports = { outputResults };
