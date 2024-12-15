import { expect } from 'chai';
import { describe, it } from 'mocha';

describe('Mandelbrot Set', () => {
    describe('Point Classification', () => {
        it('should correctly identify points inside the set', () => {
            const insidePoints = [
                { x: 0, y: 0 },       // Origin
                { x: -0.5, y: 0 },    // Main cardioid
                { x: -1, y: 0 }       // Period-2 bulb
            ];

            insidePoints.forEach(point => {
                expect(isPointInMandelbrotSet(point.x, point.y, 1000)).to.be.true;
            });
        });

        it('should correctly identify points outside the set', () => {
            const outsidePoints = [
                { x: 2, y: 2 },       // Far outside
                { x: 0.5, y: 0.5 },   // Near boundary
                { x: 1, y: 1 }        // Outside main set
            ];

            outsidePoints.forEach(point => {
                expect(isPointInMandelbrotSet(point.x, point.y, 1000)).to.be.false;
            });
        });
    });

    describe('Iteration Behavior', () => {
        it('should handle maximum iterations correctly', () => {
            const point = { x: 0.25, y: 0 };
            const result = getMandelbrotIterations(point.x, point.y, 100);
            expect(result).to.equal(100);
        });

        it('should detect early escape efficiently', () => {
            const point = { x: 2, y: 2 };
            const result = getMandelbrotIterations(point.x, point.y, 1000);
            expect(result).to.be.below(10);
        });
    });

    describe('Performance Optimization', () => {
        it('should use optimized cardioid check', () => {
            const startTime = Date.now();
            const point = { x: -0.5, y: 0 };
            
            const result = isPointInMandelbrotSet(point.x, point.y, 1000, true);
            const duration = Date.now() - startTime;
            
            expect(result).to.be.true;
            expect(duration).to.be.below(5);
        });

        it('should handle period-2 bulb optimization', () => {
            const point = { x: -1, y: 0 };
            const result = isPointInMandelbrotSet(point.x, point.y, 1000, true);
            expect(result).to.be.true;
        });
    });

    describe('Boundary Conditions', () => {
        it('should handle points on the boundary', () => {
            const boundaryPoints = [
                { x: -2, y: 0 },    // Leftmost point
                { x: 0.25, y: 0 },  // Rightmost point
                { x: 0, y: 1 }      // Top point
            ];

            boundaryPoints.forEach(point => {
                const iterations = getMandelbrotIterations(point.x, point.y, 1000);
                expect(iterations).to.be.at.least(900);
            });
        });

        it('should handle numerical precision edge cases', () => {
            const edgeCases = [
                { x: Number.EPSILON, y: 0 },
                { x: -2 + Number.EPSILON, y: 0 },
                { x: 0.25 - Number.EPSILON, y: 0 }
            ];

            edgeCases.forEach(point => {
                expect(() => {
                    isPointInMandelbrotSet(point.x, point.y, 1000);
                }).to.not.throw();
            });
        });
    });
}); 