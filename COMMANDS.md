# Fractal Generation Commands and Results

This document provides a comprehensive overview of the various commands used to generate fractals using our system, along with their corresponding results, important notes, and advanced usage instructions.

## Basic Commands

### Start the Server

**Command:**

```bash
node src/server.js
```

### Generate a Fractal Using the Advection-Diffusion Model

**Command:**

```bash
node src/index.js --model advectionDiffusion --method STADM --alpha 0.7 --beta 0.7 --maxTerms 15
```

### Generate a Fractal Using the Interpersonal Relationships Model

**Command:**

```bash
node src/index.js --model interpersonal --method MHPM --alpha 0.5 --gamma 0.3 --timeSteps 200 --timeEnd 50
```

### Generate a Fractal Using the Two-Scale Model

**Command:**

```bash
node src/index.js --model twoScale --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

### Generate a Fractal Using the Fractional Sine-Gordon Model

**Command:**

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10
```

**Description:**
Generates a fractal using the Laplace-Adomian Decomposition Method (LADM) applied to the Fractional Sine-Gordon model with specified fractional orders in time (α) and space (β).

**Expected Output:**

- A set of data points representing the fractal will be generated.
- Results will be saved in specified output files and potentially visualized depending on the configuration.

### Reverse Engineering to Infer Parameters

**Command:**

```bash
node src/index.js --model fractionalSineGordon --method LADM --alpha 0.9 --beta 0.9 --maxTerms 10 --reverseEngineer
```

**Description:**
Executes the fractal generation and then attempts to reverse engineer the original parameters that could have produced the observed fractal pattern.

**Expected Output:**

- Original parameters estimation will be printed to the console.
- This feature helps in understanding the potential underlying parameters of a given fractal form.

## Advanced Usage

### Using Different Models and Methods

**Command:**

```bash
node src/index.js --model advectionDiffusion --method STADM --alpha 0.7 --beta 0.7 --maxTerms 15
```

**Description:**
Generates a fractal using the Shehu Transform-Adomian Decomposition Method (STADM) on the Advection-Diffusion model.

**Expected Output:**

- Fractal data points specific to the advection-diffusion dynamics will be generated and outputted as per configuration.

### Customizing Time Steps and Simulation End Time

**Command:**

```bash
node src/index.js --model twoScale --method LADM --timeSteps 500 --timeEnd 20
```

**Description:**
Runs the fractal generation for the Two-Scale model using 500 time steps up to a simulation end time of 20 units.

**Expected Output:**

- Detailed fractal data over the specified time frame, allowing for a more granular or extended view of the fractal evolution.

### Exploring Interpersonal Relationships Model

**Command:**

```bash
node src/index.js --model interpersonal --method MHPM --alpha 0.5 --gamma 0.3 --timeSteps 200 --timeEnd 50
```

**Description:**
Utilizes the Modified Homotopy Perturbation Method (MHPM) to explore the dynamics of interpersonal relationships over time, using specified fractional orders and time settings.

**Expected Output:**

- Generates a series of data points that model the complexity of interpersonal dynamics using fractal-fractional calculus.

## Notes and Warnings

- Ensure that the Node.js environment is properly set up and that all dependencies are installed as per the `README.md`.
- The output files and their locations might need to be configured before running these commands.
- Some models and methods may require specific configurations or additional parameters not covered in these examples.

For more detailed information about each model and method, refer to the main documentation in the `README.md`.
