import { expect } from 'chai';
import { describe, it } from 'mocha';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mathjs from 'mathjs';
import {
    validateIterations,
    validateFractalDimension,
    computeLADM,
    computeHesFractionalDerivative,
    computeMHPM,
    computeParallelFractal,
    handleSingularPoint,
    checkConvergence
} from '../utils/test-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('Fractal Generation', () => {
    describe('Parameter Validation', () => {
        it('should validate iteration count parameters', () => {
            const validIterations = 100;
            const invalidIterations = -1;
            
            expect(() => validateIterations(validIterations)).to.not.throw();
            expect(() => validateIterations(invalidIterations)).to.throw('Invalid iteration count');
        });

        it('should validate fractal dimensions', () => {
            const validDimension = 2.5;
            const invalidDimension = 5.1;
            
            expect(() => validateFractalDimension(validDimension)).to.not.throw();
            expect(() => validateFractalDimension(invalidDimension))
                .to.throw('Fractal dimension must be between 1 and 4');
        });
    });

    describe('Fractal Computation Methods', () => {
        it('should compute Laplace-Adomian decomposition correctly', async () => {
            const params = {
                order: 2,
                iterations: 10,
                initialCondition: 1.0
            };
            const result = await computeLADM(params);
            expect(result).to.be.an('object');
            expect(result.series).to.be.an('array');
            expect(result.convergenceError).to.be.below(1e-6);
        });

        it('should handle Hes fractional derivative computation', () => {
            const params = {
                alpha: 0.5,
                x: 1.0,
                terms: 5
            };
            const result = computeHesFractionalDerivative(params);
            expect(result).to.be.a('number');
            expect(result).to.be.finite;
        });
    });

    describe('Performance', () => {
        it('should complete MHPM computation within time limit', async () => {
            const startTime = Date.now();
            const params = {
                order: 2,
                terms: 5,
                domain: [-1, 1]
            };
            await computeMHPM(params);
            const duration = Date.now() - startTime;
            expect(duration).to.be.below(1000); // 1 second timeout
        });

        it('should efficiently handle parallel computations', async () => {
            const points = 1000;
            const startTime = Date.now();
            const results = await computeParallelFractal({
                points,
                workers: 4,
                method: 'sobol'
            });
            const duration = Date.now() - startTime;
            expect(results.length).to.equal(points);
            expect(duration).to.be.below(5000);
        });
    });

    describe('Error Handling', () => {
        it('should handle singular points gracefully', () => {
            const params = {
                x: 0,
                order: 2
            };
            expect(() => handleSingularPoint(params)).to.not.throw();
        });

        it('should detect and handle divergence', async () => {
            const params = {
                iterations: 1000,
                tolerance: 1e-10
            };
            const result = await checkConvergence(params);
            expect(result.diverged).to.be.a('boolean');
            expect(result.iterationsNeeded).to.be.a('number');
        });
    });
}); 