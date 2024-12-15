import { expect } from 'chai';
import { describe, it } from 'mocha';
import { createCanvas } from 'canvas';
import { generateColorMap } from '../utils/test-utils.js';

describe('Visualization Integration Tests', () => {
    describe('Canvas Rendering', () => {
        it('should render fractal to canvas', () => {
            const width = 800;
            const height = 600;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            // Generate test data
            const points = Array(100).fill(0).map((_, i) => ({
                x: Math.random() * width,
                y: Math.random() * height,
                value: Math.random()
            }));
            
            // Render points
            points.forEach(point => {
                const color = generateColorMap(point.value);
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 2, 0, Math.PI * 2);
                ctx.fill();
            });
            
            // Get image data
            const imageData = ctx.getImageData(0, 0, width, height);
            expect(imageData.data.length).to.equal(width * height * 4);
            expect(imageData.width).to.equal(width);
            expect(imageData.height).to.equal(height);
        });

        it('should handle large datasets efficiently', () => {
            const width = 1920;
            const height = 1080;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            const startTime = Date.now();
            
            // Generate large dataset
            const points = Array(10000).fill(0).map((_, i) => ({
                x: Math.random() * width,
                y: Math.random() * height,
                value: Math.random()
            }));
            
            // Render points
            points.forEach(point => {
                const color = generateColorMap(point.value);
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.beginPath();
                ctx.arc(point.x, point.y, 1, 0, Math.PI * 2);
                ctx.fill();
            });
            
            const duration = Date.now() - startTime;
            expect(duration).to.be.below(1000); // Should render in under 1 second
        });
    });

    describe('Color Mapping', () => {
        it('should generate consistent colors for same values', () => {
            const testValue = 0.5;
            const color1 = generateColorMap(testValue);
            const color2 = generateColorMap(testValue);
            
            expect(color1.r).to.equal(color2.r);
            expect(color1.g).to.equal(color2.g);
            expect(color1.b).to.equal(color2.b);
        });

        it('should handle edge cases in color mapping', () => {
            const edgeCases = [0, 1, 0.5, -0.1, 1.1];
            
            edgeCases.forEach(value => {
                const color = generateColorMap(value);
                expect(color.r).to.be.within(0, 255);
                expect(color.g).to.be.within(0, 255);
                expect(color.b).to.be.within(0, 255);
            });
        });
    });

    describe('Animation Performance', () => {
        it('should handle animation frames efficiently', (done) => {
            const width = 400;
            const height = 300;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            let frameCount = 0;
            const maxFrames = 60;
            const startTime = Date.now();
            
            function animate() {
                // Clear canvas
                ctx.clearRect(0, 0, width, height);
                
                // Draw random points
                for (let i = 0; i < 100; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const value = Math.random();
                    
                    const color = generateColorMap(value);
                    ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }
                
                frameCount++;
                
                if (frameCount < maxFrames) {
                    setImmediate(animate);
                } else {
                    const duration = Date.now() - startTime;
                    const fps = (frameCount / duration) * 1000;
                    expect(fps).to.be.above(30); // Should maintain at least 30 FPS
                    done();
                }
            }
            
            animate();
        });
    });

    describe('Memory Management', () => {
        it('should handle memory efficiently during rendering', () => {
            const initialMemory = process.memoryUsage().heapUsed;
            const width = 1920;
            const height = 1080;
            const canvas = createCanvas(width, height);
            const ctx = canvas.getContext('2d');
            
            // Render large dataset
            for (let i = 0; i < 50000; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                const value = Math.random();
                
                const color = generateColorMap(value);
                ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
                ctx.beginPath();
                ctx.arc(x, y, 1, 0, Math.PI * 2);
                ctx.fill();
            }
            
            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = (finalMemory - initialMemory) / 1024 / 1024; // MB
            
            expect(memoryIncrease).to.be.below(100); // Should use less than 100MB additional memory
        });
    });
}); 