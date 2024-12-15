import { expect } from 'chai';
import { describe, it, before, after } from 'mocha';
import WebSocket from 'ws';
import fetch from 'node-fetch';

describe('API Integration Tests', () => {
    let wsClient;
    const API_URL = process.env.API_URL || 'http://localhost:3000';
    const WS_URL = process.env.WS_URL || 'ws://localhost:3000';

    before(async () => {
        // Setup: Create WebSocket connection
        wsClient = new WebSocket(WS_URL);
        await new Promise(resolve => wsClient.on('open', resolve));
    });

    after(() => {
        // Cleanup: Close WebSocket connection
        if (wsClient) wsClient.close();
    });

    describe('WebSocket API', () => {
        it('should retrieve available models and methods', (done) => {
            wsClient.send(JSON.stringify({
                type: 'getModelsAndMethods'
            }));

            wsClient.once('message', (data) => {
                const response = JSON.parse(data.toString());
                expect(response).to.have.property('action', 'modelsAndMethods');
                expect(response.models).to.be.an('array');
                expect(response.methods).to.be.an('object');
                done();
            });
        });

        it('should generate a fractal using LADM method', (done) => {
            wsClient.send(JSON.stringify({
                type: 'generateFractal',
                params: {
                    model: 'twoScale',
                    method: 'LADM',
                    alpha: 0.9,
                    beta: 0.9,
                    maxTerms: 10
                }
            }));

            wsClient.once('message', (data) => {
                const response = JSON.parse(data.toString());
                expect(response).to.have.property('action', 'generateFractal');
                expect(response).to.have.property('status', 'success');
                expect(response.data).to.have.property('x').that.is.an('array');
                expect(response.data).to.have.property('y').that.is.an('array');
                done();
            });
        });
    });

    describe('REST API', () => {
        it('should check health status', async () => {
            const response = await fetch(`${API_URL}/api/health`);
            const data = await response.json();
            
            expect(response.status).to.equal(200);
            expect(data).to.have.property('status', 'healthy');
            expect(data).to.have.property('version');
            expect(data).to.have.property('uptime');
        });

        it('should enable test mode', async () => {
            const response = await fetch(`${API_URL}/api/test-mode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: true,
                    mockData: {
                        computationTime: 100,
                        errorRate: 0.01
                    }
                })
            });
            const data = await response.json();
            
            expect(response.status).to.equal(200);
            expect(data).to.have.property('status', 'success');
            expect(data).to.have.property('mode', 'test');
        });

        it('should validate parameters', async () => {
            const response = await fetch(`${API_URL}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'twoScale',
                    method: 'LADM',
                    parameters: {
                        iterations: 100,
                        dimension: 2.5,
                        alpha: 0.9
                    }
                })
            });
            const data = await response.json();
            
            expect(response.status).to.equal(200);
            expect(data).to.have.property('valid');
            expect(data).to.have.property('warnings').that.is.an('array');
        });

        it('should run performance tests', async () => {
            const response = await fetch(`${API_URL}/api/performance-test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'twoScale',
                    method: 'LADM',
                    parameters: {
                        iterations: 100,
                        dimension: 2.5
                    },
                    testConfig: {
                        runs: 5,
                        parallel: true
                    }
                })
            });
            const data = await response.json();
            
            expect(response.status).to.equal(200);
            expect(data).to.have.property('results');
            expect(data.results).to.have.property('averageTime');
            expect(data.results).to.have.property('memoryUsage');
        });

        it('should generate mock data', async () => {
            const response = await fetch(`${API_URL}/api/mock-data/fractal`);
            const data = await response.json();
            
            expect(response.status).to.equal(200);
            expect(data).to.have.property('data');
            expect(data).to.have.property('metadata');
            expect(data.metadata).to.have.property('type', 'fractal');
        });
    });

    describe('Error Handling', () => {
        it('should handle invalid WebSocket messages', (done) => {
            wsClient.send(JSON.stringify({
                type: 'invalidType',
                params: {}
            }));

            wsClient.once('message', (data) => {
                const response = JSON.parse(data.toString());
                expect(response).to.have.property('status', 'error');
                expect(response).to.have.property('message');
                done();
            });
        });

        it('should handle invalid REST API requests', async () => {
            const response = await fetch(`${API_URL}/api/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'invalidModel',
                    method: 'invalidMethod'
                })
            });
            const data = await response.json();
            
            expect(response.status).to.equal(400);
            expect(data).to.have.property('error');
            expect(data).to.have.property('details');
        });
    });
}); 