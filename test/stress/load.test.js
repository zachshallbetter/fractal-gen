import { expect } from 'chai';
import { describe, it } from 'mocha';
import WebSocket from 'ws';
import fetch from 'node-fetch';

describe('Stress Tests', () => {
    const API_URL = process.env.API_URL || 'http://localhost:3000';
    const WS_URL = process.env.WS_URL || 'ws://localhost:3000';
    const CONCURRENT_USERS = 100;
    const TEST_DURATION = 60000; // 1 minute

    describe('WebSocket Load Testing', () => {
        it('should handle multiple concurrent connections', async () => {
            const connections = Array(CONCURRENT_USERS).fill(0).map(() => 
                new Promise((resolve) => {
                    const ws = new WebSocket(WS_URL);
                    ws.on('open', () => {
                        ws.close();
                        resolve(true);
                    });
                })
            );
            
            const results = await Promise.all(connections);
            expect(results.every(r => r === true)).to.be.true;
        });

        it('should maintain performance under continuous load', async () => {
            const clients = Array(CONCURRENT_USERS).fill(0).map(() => new WebSocket(WS_URL));
            const startTime = Date.now();
            const responseTimes = [];
            
            while (Date.now() - startTime < TEST_DURATION) {
                const requests = clients.map(client => 
                    new Promise((resolve) => {
                        const start = Date.now();
                        client.send(JSON.stringify({
                            type: 'generateFractal',
                            params: {
                                model: 'mandelbrot',
                                iterations: 100
                            }
                        }));
                        
                        client.once('message', () => {
                            responseTimes.push(Date.now() - start);
                            resolve();
                        });
                    })
                );
                
                await Promise.all(requests);
            }
            
            const avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
            expect(avgResponseTime).to.be.below(1000); // Average response under 1 second
            
            clients.forEach(client => client.close());
        });
    });

    describe('HTTP Load Testing', () => {
        it('should handle burst requests', async () => {
            const requests = Array(1000).fill(0).map(() => 
                fetch(`${API_URL}/api/health`)
            );
            
            const responses = await Promise.all(requests);
            expect(responses.every(r => r.status === 200)).to.be.true;
        });

        it('should maintain API performance under load', async () => {
            const startTime = Date.now();
            const responseTimes = [];
            
            while (Date.now() - startTime < TEST_DURATION) {
                const requestStart = Date.now();
                await fetch(`${API_URL}/api/validate`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: 'mandelbrot',
                        parameters: { iterations: 100 }
                    })
                });
                responseTimes.push(Date.now() - requestStart);
            }
            
            const avgResponseTime = responseTimes.reduce((a, b) => a + b) / responseTimes.length;
            expect(avgResponseTime).to.be.below(500);
        });
    });

    describe('Resource Usage', () => {
        it('should handle memory pressure', async () => {
            const initialMemory = process.memoryUsage().heapUsed;
            const requests = [];
            
            // Generate large number of requests
            for (let i = 0; i < 1000; i++) {
                requests.push(fetch(`${API_URL}/api/mock-data/fractal`));
                
                if (i % 100 === 0) {
                    const currentMemory = process.memoryUsage().heapUsed;
                    const memoryIncrease = (currentMemory - initialMemory) / 1024 / 1024;
                    expect(memoryIncrease).to.be.below(500); // Less than 500MB increase
                }
            }
            
            await Promise.all(requests);
        });

        it('should handle CPU intensive operations', async () => {
            const workers = 4;
            const iterations = 10;
            const startTime = Date.now();
            
            const requests = Array(workers).fill(0).map(() => 
                Array(iterations).fill(0).map(() => 
                    fetch(`${API_URL}/api/performance-test`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            model: 'mandelbrot',
                            parameters: {
                                width: 2000,
                                height: 2000,
                                iterations: 1000
                            }
                        })
                    })
                )
            ).flat();
            
            await Promise.all(requests);
            const duration = Date.now() - startTime;
            
            // Should complete all requests within reasonable time
            expect(duration).to.be.below(TEST_DURATION);
        });
    });

    describe('Error Resilience', () => {
        it('should handle malformed requests gracefully', async () => {
            const malformedRequests = [
                { type: null },
                { type: 'invalid' },
                { type: 'generateFractal', params: null },
                { type: 'generateFractal', params: { iterations: 'invalid' } }
            ];
            
            const clients = Array(10).fill(0).map(() => new WebSocket(WS_URL));
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const requests = clients.map(client => 
                malformedRequests.map(req => 
                    new Promise((resolve) => {
                        client.send(JSON.stringify(req));
                        client.once('message', (data) => {
                            const response = JSON.parse(data.toString());
                            expect(response.status).to.equal('error');
                            resolve();
                        });
                    })
                )
            ).flat();
            
            await Promise.all(requests);
            clients.forEach(client => client.close());
        });

        it('should recover from connection drops', async () => {
            const client = new WebSocket(WS_URL);
            const reconnections = 10;
            let successfulReconnects = 0;
            
            for (let i = 0; i < reconnections; i++) {
                await new Promise(resolve => {
                    client.once('open', () => {
                        successfulReconnects++;
                        client.close();
                        resolve();
                    });
                });
                
                if (i < reconnections - 1) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    client.url = WS_URL;
                }
            }
            
            expect(successfulReconnects).to.equal(reconnections);
        });
    });
}); 