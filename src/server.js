/**
 * @module FractalGeneratorServer
 * @description Sets up an Express server to serve the web interface and handle fractal generation requests.
 * Integrates with the fractalService module to process fractal generation requests.
 * Implements security measures and serves static files for the web interface.
 * @since 1.0.2
 */

import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { processFractalRequest, getModels, getMethods } from './fractalService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initializes and starts the Express server for the Fractal Generator application.
 * @function
 * @throws {Error} If server initialization fails.
 */
function startServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(helmet());

    // Serve static files from the 'public' directory
    app.use(express.static(path.join(__dirname, '..', 'public')));

    // Handle fractal generation requests
    app.post('/generateFractal', async (req, res) => {
        try {
            const result = await processFractalRequest(req.body);
            res.json(result);
        } catch (error) {
            console.error('Error generating fractal:', error);
            res.status(500).json({ success: false, error: 'Failed to generate fractal' });
        }
    });

    // Endpoint to get available models
    app.get('/models', (req, res) => {
        res.json(getModels());
    });

    // Endpoint to get available methods for a specific model
    app.get('/methods/:model', (req, res) => {
        try {
            const methods = getMethods(req.params.model);
            res.json(methods);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Fractal Generator Server is running at http://localhost:${PORT}`);
    });
}

export { startServer };
