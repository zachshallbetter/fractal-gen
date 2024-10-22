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
const helmet = require('helmet');  // Security middleware

const { generateFractalData } = require('./fractalService');

function startServer() {
    const app = express();
    app.use(bodyParser.json());
    app.use(helmet());  // Enhance security

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

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running at http://localhost:${PORT}`);
    });
}

module.exports = { startServer };
