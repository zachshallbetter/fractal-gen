import * as mathjs from 'mathjs';

// Validation helpers
export const validateIterations = (iterations) => {
    if (iterations < 1) throw new Error('Invalid iteration count');
    return true;
};

export const validateFractalDimension = (dimension) => {
    if (dimension < 1 || dimension > 4) {
        throw new Error('Fractal dimension must be between 1 and 4');
    }
    return true;
};

// Computation helpers
export const computeLADM = async (params) => {
    const { order, iterations, initialCondition } = params;
    // Simulate LADM computation
    const series = Array(iterations).fill(0).map((_, i) => 
        initialCondition * Math.pow(order, i));
    return {
        series,
        convergenceError: 1e-7
    };
};

export const computeHesFractionalDerivative = (params) => {
    const { alpha, x, terms } = params;
    // Simulate Hes fractional derivative
    return mathjs.gamma(alpha + 1) * Math.pow(x, alpha);
};

export const computeMHPM = async (params) => {
    const { order, terms, domain } = params;
    // Simulate MHPM computation
    return Array(terms).fill(0).map((_, i) => 
        Math.pow(domain[1], i) - Math.pow(domain[0], i));
};

// Parallel computation helpers
export const computeParallelFractal = async (params) => {
    const { points, workers, method } = params;
    // Simulate parallel computation
    return Array(points).fill(0).map(() => Math.random());
};

// Error handling helpers
export const handleSingularPoint = (params) => {
    const { x, order } = params;
    if (x === 0) return order;
    return x * order;
};

export const checkConvergence = async (params) => {
    const { iterations, tolerance } = params;
    // Simulate convergence check
    const converged = Math.random() > 0.1;
    return {
        diverged: !converged,
        iterationsNeeded: converged ? 
            Math.floor(iterations * Math.random()) : 
            iterations
    };
};

// Data utilities
export const formatOutputData = (data) => {
    return {
        points: data.points,
        metadata: {
            timestamp: Date.now(),
            parameters: data.parameters
        }
    };
};

export const cleanInputData = (input) => {
    return {
        iterations: parseInt(input.iterations),
        dimension: parseFloat(input.dimension),
        method: input.method
    };
};

// Parallel processing
export const parallelProcess = async (data, workers) => {
    return data.map(x => x * 2);
};

export const parallelProcessWithRetry = async (data) => {
    const successful = data.filter(x => x != null);
    const failed = data.filter(x => x == null);
    return { successful, failed };
};

// Visualization helpers
export const generateColorMap = (value) => {
    return {
        r: Math.floor(value * 255),
        g: Math.floor((1 - value) * 255),
        b: Math.floor(Math.sin(value * Math.PI) * 255)
    };
};

export const createCanvas = (width, height) => {
    return { width, height };
};

// Validation utilities
export const validateNumerical = (value) => {
    if (typeof value !== 'number') throw new Error('Must be a number');
    if (!isFinite(value)) throw new Error('Must be finite');
    return true;
};

export const validateComplexParameters = (params) => {
    if (typeof params.real !== 'number') {
        const error = new Error('Invalid real component');
        error.code = 'INVALID_REAL';
        throw error;
    }
};

// Logging utilities
export const formatLogMessage = (message, level) => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
};

export const log = (level, message) => {
    console.log(formatLogMessage(message, level));
}; 