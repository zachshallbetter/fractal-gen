# Interactive Fractal Generator

## Overview

This pure JavaScript application generates fractals using advanced mathematical models and numerical methods. It's built entirely in JavaScript/Node.js without relying on other programming languages, making it highly portable and easy to deploy. The application provides both a command-line interface ([see COMMANDS.md](COMMANDS.md)) and an interactive web-based interface ([see API.md](API.md)) for generating and visualizing complex fractal–fractional equations efficiently.

### It is built using the following technologies

- **Node.js**: The runtime environment for JavaScript
- **JavaScript**: The programming language used for the application
- **Redis**: The key-value database used for caching and storing fractal data
- **HTML5 Canvas**: The library used for rendering the fractals
- **D3.js**: The library used for rendering the fractals

### Why Pure JavaScript?

- **Native JavaScript Implementations**: All mathematical computations, including complex numerical methods and fractal generation algorithms, are implemented in pure JavaScript without dependencies on external computational libraries or languages like Python, C++, or FORTRAN.

- **Full Stack JavaScript**: Both frontend and backend use JavaScript, enabling seamless data flow and code sharing between client and server.

- **Node.js Ecosystem**: Leverages the rich Node.js ecosystem for all functionality:
  - Mathematical computations using native JavaScript
  - Web server using Node.js built-in modules and Express
  - Database interactions through JavaScript clients
  - Visualization using JavaScript-based libraries (Canvas, D3.js)

### Key Features

- **Advanced Mathematical Models**:
  - Nonlinear space–time fractal–fractional advection–diffusion–reaction equations
  - Interpersonal Relationships Model
  - Two-Scale Population Model
  - Fractional Sine-Gordon Model
  - Fractional Schrödinger Equation
  - Fractional Heat Equation
  - *Additional models can be integrated easily using JavaScript*

- **Diverse Numerical Methods**:
  - Laplace-Adomian Decomposition Method (LADM)
  - Shehu Transform-Adomian Decomposition Method (STADM)
  - He's Fractional Derivative Method
  - Fractional Complex Transform
  - He-Laplace Method: Implemented in native JavaScript
  - Fractal–Fractional Derivatives (Arbitrary Order)
  - Bernstein Polynomials and Operational Matrices
  - Modified Homotopy Perturbation Method (MHPM)
  - Lagrangian Polynomial Interpolation
  - Runge-Kutta Solver: Pure JavaScript implementation
  - *Methods are extensible via JavaScript modules*

- **Reverse Engineering**:
  - Infers original parameters using JavaScript-based optimization algorithms.

- **Interactive Web Interface**:
  - Built with vanilla JavaScript and modern web APIs
  - Dynamic model and method selection with immediate visual feedback
  - Supports both static and interactive plots using JavaScript visualization libraries

- **Visualizations**:
  - Uses pure JavaScript rendering via HTML5 Canvas and D3.js
  - No external visualization dependencies required

- **Key-Value Database**:
  - Utilizes Redis with Node.js client libraries
  - Pure JavaScript interface for all database operations
  - Connect to Redis using the following command:

    ```bash
    redis-cli --tls -u [redis://location of your redis instance]
    ```

  - *Note: The redis instance must be accessible from the location of the application*

- **Parallel Computation**:
  - Uses Node.js Worker Threads for parallel processing
  - Pure JavaScript implementation of parallel algorithms

- **Logging and Monitoring**:
  - JavaScript-based logging infrastructure
  - Compatible with JavaScript monitoring tools

- **Input Validation**:
  - Pure JavaScript validation logic for all inputs

## Installation

Ensure you have Node.js version 14.0.0 or higher installed. This application uses ES modules.

### Clone the Repository

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/interactive-fractal-generator.git
   cd interactive-fractal-generator
   ```

2. Install Dependencies:

   ```bash
   npm install
   ```

   Note: The `canvas` package might require additional native libraries. Refer to the [node-canvas installation guide](https://github.com/Automattic/node-canvas#installation) if needed.

3. Verify Installation:

   Run the test suite:

   ```bash
   npm test
   ```

## Testing

The project includes a comprehensive testing framework using Mocha and Chai. The test suite covers:

### Test Categories

- **Fractal Generation Tests**:
  - Parameter validation
  - Fractal computation methods (LADM, STADM, etc.)
  - Performance benchmarks
  - Error handling

- **Utility Tests**:
  - Mathematical utilities
  - Data processing
  - Parallel computation
  - Visualization helpers
  - Input/Output handling
  - Logging system

### Running Tests
