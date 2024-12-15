# Fractal Generator API Documentation

## Overview

The Fractal Generator provides both WebSocket and HTTP APIs for generating and manipulating fractals. This document details the available endpoints, their parameters, and expected responses.

## WebSocket API

### Connection

Connect to the WebSocket server at `ws://${window.location.host}`. The WebSocket API supports the following message types:

#### Get Available Models and Methods

**Request:**

```json
{
    "type": "getModelsAndMethods"
}
```

**Response:**

```json
{
    "action": "modelsAndMethods",
    "models": ["twoScale", "interpersonal", "advectionDiffusion", "fractionalSineGordon"],
    "methods": {
        "twoScale": ["LADM", "STADM"],
        "interpersonal": ["MHPM", "LADM"],
        "advectionDiffusion": ["STADM", "RungeKutta"],
        "fractionalSineGordon": ["HeLaplace", "BernsteinPolynomials"]
    }
}
```

#### Generate Fractal

**Request:**

```json
{
    "type": "generateFractal",
    "params": {
        "model": "twoScale",
        "method": "LADM",
        "alpha": 0.9,
        "beta": 0.9,
        "maxTerms": 10,
        "timeSteps": 100,
        "timeEnd": 10
    }
}
```

**Response:**

```json
{
    "action": "generateFractal",
    "status": "success",
    "data": {
        "x": [0, 1, 2, 3, 4, 5],
        "y": [0, 1, 4, 9, 16, 25]
    }
}
```

## Testing API

## Overview

The Testing API provides endpoints for testing, validation, and performance monitoring of the fractal generation system.

## Test Mode Endpoints

### Enable Test Mode

**Endpoint:** `POST /api/test/enable`

**Description:** Enables test mode for development and testing purposes.

**Request:**
```json
{
    "mode": "test",
    "options": {
        "mockData": true,
        "fastComputation": true,
        "logLevel": "debug"
    }
}
```

**Response:**
```json
{
    "status": "success",
    "mode": "test",
    "config": {
        "mockData": true,
        "fastComputation": true,
        "logLevel": "debug"
    }
}
```

### Disable Test Mode

**Endpoint:** `POST /api/test/disable`

**Description:** Disables test mode and returns to production settings.

**Response:**
```json
{
    "status": "success",
    "mode": "production"
}
```

## Validation Endpoints

### Validate Parameters

**Endpoint:** `POST /api/test/validate`

**Description:** Validates fractal generation parameters without computation.

**Request:**
```json
{
    "type": "mandelbrot",
    "params": {
        "width": 800,
        "height": 600,
        "maxIterations": 1000,
        "colorScheme": "spectrum"
    }
}
```

**Response:**
```json
{
    "valid": true,
    "warnings": [
        "High iteration count may impact performance"
    ],
    "suggestions": {
        "recommendedIterations": 500
    }
}
```

## Performance Testing

### Run Performance Test

**Endpoint:** `POST /api/test/performance`

**Description:** Executes performance tests for specific configurations.

**Request:**
```json
{
    "type": "benchmark",
    "config": {
        "iterations": 5,
        "resolution": {
            "width": 1920,
            "height": 1080
        },
        "parallel": true
    }
}
```

**Response:**
```json
{
    "results": {
        "averageTime": 245.6,
        "minTime": 220.3,
        "maxTime": 280.1,
        "memoryUsage": {
            "initial": "156MB",
            "peak": "312MB",
            "final": "178MB"
        },
        "cpuUtilization": 85.4
    },
    "recommendations": {
        "optimalThreads": 4,
        "suggestedChunkSize": 200
    }
}
```

### Memory Profile

**Endpoint:** `GET /api/test/memory-profile`

**Description:** Retrieves memory usage statistics.

**Response:**
```json
{
    "heapUsed": "156MB",
    "heapTotal": "512MB",
    "external": "12MB",
    "arrayBuffers": "45MB",
    "gc": {
        "collections": 12,
        "totalTime": "156ms"
    }
}
```

## Load Testing

### Generate Load

**Endpoint:** `POST /api/test/generate-load`

**Description:** Generates synthetic load for stress testing.

**Request:**
```json
{
    "users": 100,
    "duration": 60,
    "requestType": "fractal",
    "distribution": "gaussian"
}
```

**Response:**
```json
{
    "status": "running",
    "metrics": {
        "activeUsers": 100,
        "requestsPerSecond": 250,
        "errorRate": 0.01,
        "averageLatency": 120
    }
}
```

### Monitor Load Test

**Endpoint:** `GET /api/test/load-status`

**Description:** Retrieves current load test status and metrics.

**Response:**
```json
{
    "status": "running",
    "progress": 45,
    "metrics": {
        "throughput": 245.6,
        "errorCount": 12,
        "p95Latency": 180,
        "activeConnections": 98
    }
}
```

## Mock Data

### Generate Mock Data

**Endpoint:** `GET /api/test/mock/:type`

**Description:** Generates mock data for testing.

**Parameters:**
- `type`: Type of mock data (fractal, timeseries, parameters)

**Response:**
```json
{
    "data": [...],
    "metadata": {
        "type": "fractal",
        "timestamp": "2024-01-15T12:00:00Z",
        "parameters": {
            "seed": 12345,
            "complexity": "medium"
        }
    }
}
```

## WebSocket Test Events

### Test Connection

**Event:** `test:connect`

**Description:** Tests WebSocket connection stability.

**Message:**
```json
{
    "type": "test:connect",
    "data": {
        "clientId": "test-123",
        "timestamp": 1642234567890
    }
}
```

### Echo Test

**Event:** `test:echo`

**Description:** Echoes received data for latency testing.

**Message:**
```json
{
    "type": "test:echo",
    "data": "test-payload",
    "timestamp": 1642234567890
}
```

## Error Simulation

### Simulate Error

**Endpoint:** `POST /api/test/simulate-error`

**Description:** Simulates various error conditions for testing.

**Request:**
```json
{
    "type": "memory-overflow",
    "delay": 100,
    "recovery": true
}
```

**Response:**
```json
{
    "status": "error",
    "error": {
        "type": "memory-overflow",
        "message": "Simulated memory overflow error",
        "handled": true
    }
}
```


