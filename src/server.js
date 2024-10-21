/**
 * Fractal Generator Web Server
 * Sets up an Express server to serve the web interface and handle fractal generation requests.
 *
 * @module FractalGeneratorServer
 * @since 1.0.1
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { generateFractalData } = require('./fractalService');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Handle fractal generation requests
app.post('/generateFractal', (req, res) => {
  const params = req.body;

  generateFractalData(params)
    .then(data => res.json(data))
    .catch(error => {
      console.error('Error generating fractal:', error);
      res.status(500).json({ error: 'Failed to generate fractal' });
    });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
