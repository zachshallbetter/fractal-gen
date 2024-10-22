/**
 * @module FractalGeneratorServer
 * @description Sets up an Express server to serve the web interface and handle fractal generation requests.
 * @since 1.0.4
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { processFractalRequest } from './fractalService.js';

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
      const data = await processFractalRequest(params);
      res.json(data);
    } catch (error) {
      next(error);
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export { startServer };
