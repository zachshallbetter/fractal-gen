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

The following endpoints are available for testing and validation purposes:

### Health Check

**Endpoint:** `GET /api/health`

**Description:** Checks the health status of the service.

**Response:**
```json
{
    "status": "healthy",
    "version": "1.0.10",
    "uptime": "2d 3h 45m",
    "memory": {
        "used": "156MB",
        "total": "512MB"
    }
}
```

### Test Mode

**Endpoint:** `POST /api/test-mode`

**Description:** Enables test mode for the service, which uses mock data and faster computation methods.

**Request:**
```json
{
    "enabled": true,
    "mockData": {
        "computationTime": 100,
        "errorRate": 0.01
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
        "computationTime": 100,
        "errorRate": 0.01
    }
}
```

### Validation Test

**Endpoint:** `POST /api/validate`

**Description:** Validates input parameters without performing actual computations.

**Request:**
```json
{
    "model": "twoScale",
    "method": "LADM",
    "parameters": {
        "iterations": 100,
        "dimension": 2.5,
        "alpha": 0.9
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
        "recommended_iterations": 50
    }
}
```

### Performance Test

**Endpoint:** `POST /api/performance-test`

**Description:** Runs a performance test for specific fractal generation parameters.

**Request:**
```json
{
    "model": "twoScale",
    "method": "LADM",
    "parameters": {
        "iterations": 100,
        "dimension": 2.5
    },
    "testConfig": {
        "runs": 5,
        "parallel": true
    }
}
```

**Response:**
```json
{
    "results": {
        "averageTime": 234.5,
        "minTime": 220.1,
        "maxTime": 245.3,
        "memoryUsage": {
            "before": "156MB",
            "after": "178MB",
            "peak": "189MB"
        }
    },
    "recommendations": {
        "optimal_batch_size": 50,
        "suggested_worker_count": 4
    }
}
```

### Mock Data Generation

**Endpoint:** `GET /api/mock-data/:type`

**Description:** Generates mock data for testing purposes.

**Parameters:**
- `type`: Type of mock data to generate (e.g., "fractal", "timeseries", "parameters")

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


