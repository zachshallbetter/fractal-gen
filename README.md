# Fractal Generator

## Overview

This Node.js application generates fractals using advanced mathematical models and numerical methods. It is designed to handle complex fractal–fractional equations efficiently, providing both static and interactive visualizations.

### Key Features

- **Advanced Mathematical Models**: Utilizes models such as the Nonlinear space–time fractal–fractional advection–diffusion–reaction equations, interpersonal relationships, two-scale population model, and fractional sine-Gordon model.
- **Diverse Numerical Methods**: Supports a variety of methods including the Laplace-Adomian Decomposition Method (LADM), Shehu Transform-Adomian Decomposition Method (STADM), He's Fractional Derivative, Fractional Complex Transform, He–Laplace Method, Fractal–Fractional Derivatives (ARL and ABC), Bernstein Polynomials and Operational Matrices, Modified Homotopy Perturbation Method, and Lagrangian Polynomial Interpolation.
- **Reverse Engineering**: Capable of inferring original parameters from generated fractal data using sophisticated optimization techniques and analytical approximations.
- **Interactive Visualizations**: Generates both static images and interactive plots to visualize the fractals, enhancing user engagement and understanding.
- **Web Server**: Provides a web server for generating fractals on-demand, supporting multiple models and methods.

## Installation

Ensure you have Node.js version 14.0.0 or higher installed. To install the necessary dependencies, run:

```bash
npm install
```

## Usage

Run the application with customizable parameters to generate fractals:

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

### Command-Line Options

- `--model`: Select the mathematical model (e.g., `twoScale`, `interpersonal`, `advectionDiffusion`, `fractionalSineGordon`).
- `--method`: Choose the method for solving the equation (e.g., `LADM`, `STADM`).
- `--alpha`: Set the fractional order in time (α).
- `--beta`: Set the fractional order in space (β).
- `--maxTerms`: Define the maximum number of terms in the series solution.
- `--initialCondition`: Specify the initial condition for the differential equations.
- `--timeSteps`: Determine the number of time steps.
- `--timeEnd`: Set the end time for simulations.
- `--reverseEngineer`: Enable reverse engineering to infer parameters.

### Examples

**Generate a fractal using the Fractional Sine-Gordon Model with LADM:**

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

**Generate a fractal using STADM:**

```bash
node src/index.js --model fractionalSineGordon --method STADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

**Generate a fractal using the Two-Scale Model:**

```bash
node src/index.js --model twoScale --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

## Reverse Engineering

Enable this feature to infer parameters from fractal data without prior knowledge of the original functions:

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10 --reverseEngineer
```

## Validation and Testing

Ensure the accuracy of numerical simulations by comparing them against analytical solutions. Validate results with specific initial conditions to confirm the correctness of the outputs.

## Advanced Debugging in VS Code

Set up advanced debugging in Visual Studio Code to step through the code effectively:

1. **Open Your Project**: Navigate to your project directory in VS Code.
2. **Create a Debug Configuration**: Use the `launch.json` file to configure debugging settings.
3. **Set Breakpoints**: Place breakpoints in critical sections like `src/solvers/ladmSolver.js`.
4. **Start Debugging**: Use the debugging panel in VS Code to start and manage your debugging session.

### Debug Configuration Example

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Fractal Generator",
      "program": "${workspaceFolder}/src/index.js",
      "args": ["--model", "fractionalSineGordon", "--method", "LADM", "--alpha", "0.9", "--beta", "0.9", "--maxTerms", "10"],
      "skipFiles": ["<node_internals>/**"],
      "console": "integratedTerminal"
    }
  ]
}
```

## Packages

- **Canvas**: Utilized for generating static images.
- **Math.js**: Provides comprehensive mathematical functions necessary for fractal calculations.
- **Yargs**: Facilitates command-line argument parsing.

Install these packages using:

```bash
npm install canvas mathjs yargs
```

## Contributing

Contributions are welcome! Please read the contribution guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.
