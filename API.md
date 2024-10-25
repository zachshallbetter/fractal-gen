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


