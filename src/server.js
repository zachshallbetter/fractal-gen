/**
 * @module FractalGeneratorServer
 * @description Sets up an Express server to serve the web interface and handle fractal generation requests.
 * @since 1.0.5
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFractalRequest, getModels, getMethods } from './fractalService.js';

function startServer() {
  const app = express();
  app.use(express.json());

  // Determine directory name in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Serve static files from the 'public' directory
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // Handle fractal generation requests
  app.post('/generateFractal', async (req, res, next) => {
    try {
      const params = req.body;
      const result = await processFractalRequest(params);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Handle API requests for available models and methods
  app.get('/api/models', (req, res, next) => {
    try {
      const models = getModels();
      const methods = {};
      models.forEach(model => {
        methods[model] = getMethods(model);
      });
      res.json({ models, methods });
    } catch (error) {
      next(error);
    }
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export { startServer };
