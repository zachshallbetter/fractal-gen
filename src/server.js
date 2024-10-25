/**
 * @module server
 * @description WebSocket server for handling fractal generation requests.
 * @since 1.1.8
 */

import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import express from 'express';
import { processFractalRequest, fetchFractalModelsAndMethods } from './services/fractalService.js';
import logger from './utils/logger.js';
import { createClient } from 'redis';
import { validateFractalParams } from './utils/validators.js';

const app = express();
const server = createServer(app);

// Serve static files from the public directory
app.use(express.static('public'));

// Create WebSocket server
const wss = new WebSocketServer({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  logger.info('Client connected via WebSocket');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      logger.debug('Received message', { data });

      switch (data.action) {
        case 'getModelsAndMethods':
          sendModelsAndMethods(ws);
          break;
        case 'generateFractal':
          await handleGenerateFractal(ws, data.params);
          break;
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      logger.error('Error processing message:', error);
      ws.send(JSON.stringify({ success: false, error: error.message }));
    }
  });

  ws.on('close', () => {
    logger.info('Client disconnected');
  });
});

/**
 * Sends available models and methods to the client
 * @param {WebSocket} ws - The WebSocket connection
 */
function sendModelsAndMethods(ws) {
  const { models, methods } = fetchFractalModelsAndMethods();
  ws.send(JSON.stringify({ action: 'modelsAndMethods', models, methods }));
}

/**
 * Handles fractal generation requests
 * @param {WebSocket} ws - The WebSocket connection
 * @param {Object} params - The parameters for fractal generation
 */
async function handleGenerateFractal(ws, params) {
  try {
    logger.info('Processing fractal generation request via WebSocket', { params });

    // Validate parameters
    const validation = validateFractalParams(params);
    if (!validation.isValid) {
      ws.send(JSON.stringify({ success: false, error: validation.errors.join('; ') }));
      return;
    }

    const result = await processFractalRequest(params);

    if (result.success) {
      ws.send(JSON.stringify({ action: 'fractalData', data: result.data }));
    } else {
      ws.send(JSON.stringify({ success: false, error: result.message }));
    }
  } catch (error) {
    logger.error('Error handling fractal generation request:', error);
    ws.send(JSON.stringify({ success: false, error: error.message }));
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});

const redisClient = createClient({
  url: 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

await redisClient.connect();

// Use redisClient in server logic

export default server;
