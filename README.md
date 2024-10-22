# Interactive Fractal Generator

## Overview

This Node.js application generates fractals using advanced mathematical models and numerical methods. It provides both a command-line interface and an interactive web-based interface for generating and visualizing complex fractal–fractional equations efficiently.

### Key Features

- **Advanced Mathematical Models**:
  - Nonlinear space–time fractal–fractional advection–diffusion–reaction equations
  - Interpersonal Relationships Model
  - Two-Scale Population Model
  - Fractional Sine-Gordon Model
  - Fractional Schrödinger Equation
  - Fractional Heat Equation
  - *Additional models can be integrated easily*

- **Diverse Numerical Methods**:
  - Laplace-Adomian Decomposition Method (**LADM**)
  - Shehu Transform-Adomian Decomposition Method (**STADM**)
  - He's Fractional Derivative Method
  - Fractional Complex Transform
  - **He-Laplace Method**: Implemented with proper handling of fractional derivatives
  - Fractal–Fractional Derivatives (Arbitrary Order)
  - **Bernstein Polynomials and Operational Matrices**: Fully implemented with accurate polynomial approximations
  - **Modified Homotopy Perturbation Method (MHPM)**: Correctly applies perturbation techniques for fractional equations
  - Lagrangian Polynomial Interpolation
  - **Runge-Kutta Solver**: Implemented with adaptive step size for improved accuracy
  - *Methods are extensible via the solvers module*

- **Reverse Engineering**:
  - Infers original parameters from generated fractal data using optimization techniques and analytical approximations.

- **Interactive Web Interface**:
  - User-friendly interface for real-time fractal generation and visualization.
  - Dynamic model and method selection with immediate visual feedback.
  - Supports both **static** and **interactive** plots.

- **Visualizations**:
  - Generates high-quality images and interactive plots.
  - Utilizes **HTML5 Canvas** and **D3.js** for efficient rendering.

- **Key-Value Database**:
  - Utilizes **Redis** as a high-performance, in-memory key-value data store.
  - Enables fast data retrieval and caching for improved application performance.
  - Supports persistence for data durability across application restarts.
  - Facilitates efficient storage and retrieval of fractal generation parameters and results.
  - Connect to Redis using the following command:

    ```bash
    redis-cli --tls -u [redis://location of your redis instance]
    ```

  - *Note: The redis instance must be accessible from the location of the application*

- **Parallel Computation**:
  - Leverages worker threads for efficient processing of complex calculations.

- **Logging and Monitoring**:
  - Implements structured logging for enhanced observability.
  - Compatible with various monitoring tools.

- **Input Validation**:
  - Comprehensive parameter validation for all models and methods to ensure accurate results.

## Installation

Ensure you have Node.js version **14.0.0 or higher** installed. This application uses ES modules.

### Clone the Repository

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/interactive-fractal-generator.git
   cd interactive-fractal-generator
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   Note: The `canvas` package might require additional native libraries. Refer to the [node-canvas installation guide](https://github.com/Automattic/node-canvas#installation) if needed.

3. **Verify Installation:**

   Run the test suite:

   ```bash
   npm test
   ```

## Usage

### Command-Line Interface

To generate fractals using the command-line interface, run:
