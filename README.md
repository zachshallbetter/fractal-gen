# Fractal Generator

## Overview

A Node.js application for generating fractals using advanced mathematical models, including:

- Nonlinear space–time fractal–fractional advection–diffusion–reaction equations
- Atangana–Riemann–Liouville and Atangana–Baleanu–Caputo derivatives
- Bernstein polynomials and operational matrices
- Modified Homotopy Perturbation Method (MHPM)
- **Laplace-Adomian Decomposition Method (LADM)**
- **Shehu Transform-Adomian Decomposition Method (STADM)**
- **Fractional Order Sine-Gordon Equation Implementation**

## Visualization

- **Static Images:** Created using the Canvas API.
- **Interactive Plots:** Not implemented to minimize dependencies.

## Installation

Ensure you have Node.js version 14.0.0 or higher installed.

```bash
npm install
```

## Usage

Run the application with customizable parameters:

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

### Command-Line Options

- `--model`: Select the mathematical model.
  - Choices: `twoScale`, `interpersonal`, `advectionDiffusion`, `fractionalSineGordon`
- `--method`: Method for solving the equation (applicable to specific models).
  - Choices: `LADM`, `STADM`
- `--alpha`: Fractional order in time (α).
- `--beta`: Fractional order in space (β).
- `--maxTerms`: Maximum number of terms in the series solution.
- `--initialCondition`: Initial condition for the differential equations.
- `--timeSteps`: Number of time steps.
- `--timeEnd`: End time for simulations.
- `--reverseEngineer`: Enable reverse engineering of fractals.

### Examples

**Generate a fractal using the Fractional Sine-Gordon Model with LADM:**

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

**Generate a fractal using STADM:**

```bash
node src/index.js --model fractionalSineGordon --method STADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

## Reverse Engineering

The application can now reverse-engineer fractals without prior knowledge of the original functions or parameters by utilizing LADM and STADM.

- **Parameter Estimation:** Uses optimization techniques to infer parameters from fractal data.
- **Analytical Approximations:** Provides series solutions for comparison with numerical simulations.

## Validation and Testing

- **Comparison with Analytical Solutions:** Validate numerical simulations against series solutions.
- **Examples with Initial Conditions:** Confirm results with specific examples.

## Setting Up Advanced Debugging in VS Code

To effectively troubleshoot and step through your code, you can set up advanced debugging capabilities in Visual Studio Code.

### Steps to Set Up Debugging

1. **Open Your Project in VS Code**
   Navigate to your project directory and open it in VS Code.

2. **Create a Debug Configuration**
   - Click on the Run and Debug icon on the Activity Bar on the side of VS Code (or press Ctrl+Shift+D).
   - Click on "create a launch.json file" to create a new debug configuration.
   - Select "Node.js" when prompted for the environment.

3. **Configure launch.json**
   Update your `launch.json` file to include advanced debugging settings:

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

   Explanation:
   - `args`: Pass command-line arguments directly in the debug configuration.
   - `skipFiles`: Skip stepping into internal Node.js modules.
   - `console`: Use the integrated terminal for input/output.

4. **Set Breakpoints**
   - Open the files you want to debug (e.g., `src/solvers/ladmSolver.js`).
   - Click on the gutter next to the line numbers to set breakpoints.

5. **Start Debugging**
   - With your breakpoints set, go back to the Run and Debug panel.
   - Select "Launch Fractal Generator" from the configuration dropdown.
   - Click the Start Debugging button (green arrow) or press F5.

6. **Inspect Variables and Call Stack**
   - When execution pauses at a breakpoint, inspect variables in the Variables panel.
   - Use the Call Stack panel to trace function calls.
   - Step through your code using the Continue, Step Over, Step Into, and Step Out controls.

### Advanced Debugging Techniques

#### Conditional Breakpoints

If you want to pause execution when a certain condition is met:

1. Right-click on the breakpoint you added.
2. Select "Edit Breakpoint...".
3. Enter a condition, e.g., `n === maxTerms - 1`.

#### Logpoints

Use logpoints to output variable values without pausing execution:

1. Right-click on the gutter where you'd set a breakpoint.
2. Select "Add Logpoint...".
3. Enter an expression to log, e.g., `n = ${n}, u_n = ${u_n}`.

#### Using the Debug Console

While debugging, you can execute JavaScript expressions in the Debug Console to evaluate variables or execute code snippets on the fly.

### Resolving Other Potential Issues

1. **Ensure All Dependencies Are Installed**
   After updating `package.json`, run:

   ```bash
   npm install
   ```

   This will install any missing dependencies.

2. **Verify Module Imports**
   Ensure all `require` or `import` statements use the correct module names and paths.

3. **Check for Typos**
   Typos in module names or file paths can cause `MODULE_NOT_FOUND` errors.

4. **Clear Node.js Cache (if necessary)**
   Sometimes Node.js caches modules. You can clear the cache by running:

   ```bash
   npm cache clean --force
   ```
### Implemented Packages

### Implemented Packages

This project utilizes two main packages for data visualization:

#### 1. Plotly NPM Package

- **Description**: A Node.js client for the Plotly Graphing Library.
- **Features**:
  - Interfaces with the Plotly REST API.
  - Enables creation of plots and saving them as images directly from Node.js.
  - Offers a wide range of customizable chart types.
- **Requirements**:
  - Internet connection
  - Plotly account credentials
- **Use Case**: Ideal for projects requiring advanced, customizable plots with cloud storage and sharing capabilities.

#### 2. nodeplotlib

- **Description**: A Node.js library providing a simple interface for plotting using Plotly.
- **Features**:
  - Works in a Node.js environment without needing a browser or custom setup.
  - Straightforward to use with a simple API.
  - Does not require Plotly credentials.
- **Advantages**:
  - Self-contained solution
  - Easy to integrate and use in local development environments
- **Recommendation**: For simplicity and to keep everything self-contained, we recommend using `nodeplotlib` for most use cases in this project.

To install these packages, run:

## Contributing

Contributions are welcome! Please read the [contribution guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License.
