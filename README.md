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

- **Edge Computing Ready**:
  - Optimized for deployment in edge computing environments with minimal resource consumption.

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
