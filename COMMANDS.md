# Fractal Generation Commands and Results

This document provides a comprehensive overview of the various commands used to generate fractals using our system, along with their corresponding results, important notes, and advanced usage instructions.

## Table of Contents

- [Basic Commands](#basic-commands)
  - [Start the Server](#start-the-server)
  - [Generate a Fractal Using the Advection-Diffusion Model](#generate-a-fractal-using-the-advection-diffusion-model)
  - [Generate a Fractal Using the Interpersonal Relationships Model](#generate-a-fractal-using-the-interpersonal-relationships-model)
  - [Generate a Fractal Using the Two-Scale Model](#generate-a-fractal-using-the-two-scale-model)
  - [Generate a Fractal Using the Fractional Sine-Gordon Model](#generate-a-fractal-using-the-fractional-sine-gordon-model)
  - [Generate a Fractal Using the Fractional Schrödinger Equation](#generate-a-fractal-using-the-fractional-schrödinger-equation)
- [Advanced Usage](#advanced-usage)
  - [Customizing Time Steps and Simulation End Time](#customizing-time-steps-and-simulation-end-time)
  - [Exploring Additional Models](#exploring-additional-models)
  - [Reverse Engineering to Infer Parameters](#reverse-engineering-to-infer-parameters)
- [New Features](#new-features)
  - [Edge Computing Deployment](#edge-computing-deployment)
  - [Additional Numerical Methods](#additional-numerical-methods)
  - [Interactive Visualizations](#interactive-visualizations)
- [Notes and Warnings](#notes-and-warnings)

---

### Corrected Command Examples

#### Generate a Fractal Using the Fractional Heat Equation

**Command:**

```bash
node src/index.js --model fractionalHeat --method bernsteinPolynomials --alpha 0.7 --maxTerms 10
```

**Description:**

Utilizes **Bernstein Polynomials** to solve the **Fractional Heat Equation**, demonstrating the application of fractional calculus in heat transfer phenomena.

---

## Basic Commands

### Start the Server

**Command:**

```bash
node src/server.js
```

**Description:**

Starts the web server for the interactive fractal generator interface.

---

### Generate a Fractal Using the Advection-Diffusion Model

**Command:**

```bash
node src/index.js --model advectionDiffusion --method STADM --alpha 0.7 --beta 0.7 --maxTerms 15
```

**Description:**

Generates a fractal using the **Shehu Transform-Adomian Decomposition Method (STADM)** applied to the **Advection-Diffusion** model with specified fractional orders in time (α) and space (β).

---

### Generate a Fractal Using the Interpersonal Relationships Model

**Command:**

```bash
node src/index.js --model interpersonal --method MHPM --alpha 0.5 --gamma 0.3 --timeSteps 200 --timeEnd 50
```

**Description:**

Models the dynamics of interpersonal relationships using the **Modified Homotopy Perturbation Method (MHPM)**.

---

### Generate a Fractal Using the Two-Scale Model

**Command:**

```bash
node src/index.js --model twoScale --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

**Description:**

Applies the **Laplace-Adomian Decomposition Method (LADM)** to the **Two-Scale Population** model.

---

### Generate a Fractal Using the Fractional Sine-Gordon Model

**Command:**

```bash
node src/index.js --model fractionalSineGordon --method HeLaplace --alpha 0.8 --beta 0.8 --maxTerms 12
```

**Description:**

Generates a fractal using the **He-Laplace Method** applied to the **Fractional Sine-Gordon** model.

---

### Generate a Fractal Using the Fractional Schrödinger Equation

**Command:**

```bash
node src/index.js --model fractionalSchrodinger --method RungeKutta --alpha 0.6 --beta 0.6 --timeSteps 300 --timeEnd 30
```

**Description:**

Solves the **Fractional Schrödinger Equation** using the **Runge-Kutta Solver**, providing insights into quantum mechanical systems with fractional dynamics.

---

## Advanced Usage

### Customizing Time Steps and Simulation End Time

**Command:**

```bash
node src/index.js --model twoScale --method RungeKutta --timeSteps 500 --timeEnd 20
```

**Description:**

Uses the **Runge-Kutta Solver** to generate fractals with a higher number of time steps and extended simulation time for more detailed results.

---

### Exploring Additional Models

**Command:**

```bash
node src/index.js --model fractionalHeat --method BernsteinPolynomials --alpha 0.7 --maxTerms 10
```

**Description:**

Utilizes **Bernstein Polynomials** to solve the **Fractional Heat Equation**, demonstrating the application of fractional calculus in heat transfer phenomena.

---

### Reverse Engineering to Infer Parameters

**Command:**

```bash
node src/index.js --model advectionDiffusion --method STADM --alpha 0.7 --beta 0.7 --maxTerms 15 --reverseEngineer
```

**Description:**

After generating fractal data, the system attempts to reverse engineer the original parameters using optimization techniques.

---

## New Features

### Edge Computing Deployment

**Command:**

```bash
node src/edge.js
```

**Description:**

Starts the application optimized for edge computing environments, enabling fractal generation on devices with limited resources.

---

### Additional Numerical Methods

The application now supports additional numerical methods:

- **He-Laplace Method**
- **Runge-Kutta Solver**
- **Bernstein Polynomials**
- **Adomian Decomposition Methods**
- **Fractal-Fractional Solvers**
- **Operational Matrices Method**
- **He’s Fractional Derivative**

These methods can be specified using the `--method` option.

---

### Interactive Visualizations

To generate interactive visualizations:

**Command:**

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --interactive
```

**Description:**

Generates an interactive plot of the fractal data using the Canvas API, allowing for zooming and panning.

---

## Notes and Warnings

- Ensure that all dependencies are installed, including any requirements for native modules like `canvas`.
- Output files are saved in the `plots` directory by default.
- Reverse engineering features are experimental and may require fine-tuning.
- Some models and methods may require specific parameters; refer to the main documentation for detailed information.

For more detailed information about each model and method, refer to the main documentation in the `README.md`.
