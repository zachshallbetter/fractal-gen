/**
 * @module FractalGeneratorServer
 * @description Sets up an Express server with WebSocket support to serve the web interface and handle real-time fractal generation requests.
 * @since 1.0.7
 */

import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { processFractalRequest, getAvailableMethods } from './services/fractalService.js';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static('public'));

wss.on('connection', (ws) => {
  ws.on('message', async (message) => {
    const params = JSON.parse(message);
    if (params.action === 'getMethods') {
      try {
        const methods = getAvailableMethods(params.model);
        ws.send(JSON.stringify({ methods }));
      } catch (error) {
        ws.send(JSON.stringify({ success: false, error: error.message }));
      }
    } else {
      try {
        const result = await processFractalRequest(params);
        ws.send(JSON.stringify(result));
      } catch (error) {
        ws.send(JSON.stringify({ success: false, error: error.message }));
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
