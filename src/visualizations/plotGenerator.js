/**
 * @module visualizations/plotGenerator
 * @description Generates interactive plots using Plotly.js.
 * @since 1.0.3
 */

const Plotly = require('plotly.js-dist');
const fs = require('fs');
const path = require('path');

async function createInteractivePlot(data) {
  const trace = {
    x: data.map(point => point.x),
    y: data.map(point => point.y),
    mode: 'lines',
    type: 'scatter',
    line: { color: '#17BECF' },
  };

  const layout = {
    title: 'Fractal Visualization',
    xaxis: { title: 'Time' },
    yaxis: { title: 'Value' },
  };

  const imgOpts = {
    format: 'png',
    width: 800,
    height: 600,
  };

  const graphOptions = { layout: layout, filename: 'fractal-plot', fileopt: 'overwrite' };

  // Generate the plot
  const plotData = [trace];
  const plotHtml = Plotly.newPlot('plot', plotData, layout).then(() => {
    Plotly.toImage('plot', imgOpts).then((imgData) => {
      fs.writeFileSync(path.join('plots', 'fractalPlot.png'), imgData.replace(/^data:image\/\w+;base64,/, ""), 'base64');
    });
  });
}

module.exports = { createInteractivePlot };
