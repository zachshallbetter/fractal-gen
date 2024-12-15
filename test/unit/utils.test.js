import { expect } from 'chai';
import { describe, it } from 'mocha';
import * as mathjs from 'mathjs';
import {
    generateSobolSequence,
    numericalIntegration,
    formatOutputData,
    cleanInputData,
    parallelProcess,
    parallelProcessWithRetry,
    generateColorMap,
    createCanvas,
    validateNumerical,
    validateComplexParameters,
    formatLogMessage,
    log
} from '../utils/test-utils.js';

describe('Utilities', () => {
    describe('Math Utilities', () => {
        it('should compute Sobol sequences correctly', () => {
            const dimension = 2;
            const points = 1000;
            const sequence = generateSobolSequence(dimension, points);
            
            expect(sequence).to.be.an('array');
            expect(sequence.length).to.equal(points);
            sequence.forEach(point => {
                expect(point).to.be.an('array');
                expect(point.length).to.equal(dimension);
                point.forEach(coord => {
                    expect(coord).to.be.within(0, 1);
                });
            });
        });

        it('should perform numerical integration accurately', () => {
            const func = x => Math.sin(x);
            const a = 0;
            const b = Math.PI;
            const result = numericalIntegration(func, a, b);
            expect(result).to.be.closeTo(2.0, 1e-6);
        });
    });

    describe('Data Utilities', () => {
        it('should properly format output data', () => {
            const data = {
                points: [[0, 0], [1, 1]],
                parameters: { iterations: 100 }
            };
            const formatted = formatOutputData(data);
            expect(formatted).to.have.property('points');
            expect(formatted).to.have.property('metadata');
            expect(formatted.points).to.be.an('array');
        });

        it('should validate and clean input data', () => {
            const input = {
                iterations: '100',
                dimension: '2.5',
                method: 'ladm'
            };
            const cleaned = cleanInputData(input);
            expect(cleaned.iterations).to.be.a('number');
            expect(cleaned.dimension).to.be.a('number');
            expect(cleaned.method).to.be.a('string');
        });
    });

    describe('Parallel Computation', () => {
        it('should distribute work across workers', async () => {
            const data = Array(1000).fill(1);
            const result = await parallelProcess(data, 4);
            expect(result).to.be.an('array');
            expect(result.length).to.equal(data.length);
        });

        it('should handle worker failures gracefully', async () => {
            const failingData = [null, undefined, 1, 2];
            const result = await parallelProcessWithRetry(failingData);
            expect(result.successful).to.be.an('array');
            expect(result.failed).to.be.an('array');
        });
    });

    describe('Visualization', () => {
        it('should generate correct color mappings', () => {
            const value = 0.5;
            const colorMap = generateColorMap(value);
            expect(colorMap).to.have.property('r');
            expect(colorMap).to.have.property('g');
            expect(colorMap).to.have.property('b');
            Object.values(colorMap).forEach(component => {
                expect(component).to.be.within(0, 255);
            });
        });

        it('should handle canvas operations', () => {
            const width = 100;
            const height = 100;
            const canvas = createCanvas(width, height);
            expect(canvas.width).to.equal(width);
            expect(canvas.height).to.equal(height);
        });
    });

    describe('Error Handling', () => {
        it('should validate numerical parameters', () => {
            expect(() => validateNumerical('not a number')).to.throw();
            expect(() => validateNumerical(42)).to.not.throw();
            expect(() => validateNumerical(-Infinity)).to.throw();
        });

        it('should provide detailed error messages', () => {
            try {
                validateComplexParameters({ real: 'invalid' });
            } catch (error) {
                expect(error.message).to.include('real');
                expect(error.code).to.be.a('string');
            }
        });
    });

    describe('Logging', () => {
        it('should format log messages correctly', () => {
            const message = 'Test message';
            const formatted = formatLogMessage(message, 'error');
            expect(formatted).to.include(message);
            expect(formatted).to.include(new Date().getFullYear());
        });

        it('should handle different log levels', () => {
            const levels = ['info', 'warn', 'error', 'debug'];
            levels.forEach(level => {
                expect(() => log(level, 'test')).to.not.throw();
            });
        });
    });
}); 