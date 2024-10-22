# Interactive Fractal Generator

## Overview

This Node.js application generates fractals using advanced mathematical models and numerical methods. It provides both a command-line interface and an interactive web-based interface for generating and visualizing complex fractal–fractional equations efficiently.

### Key Features

- **Advanced Mathematical Models**: Utilizes models such as the Nonlinear space–time fractal–fractional advection–diffusion–reaction equations, interpersonal relationships, two-scale population model, and fractional sine-Gordon model.
- **Diverse Numerical Methods**: Supports a variety of methods including the Laplace-Adomian Decomposition Method (LADM), Shehu Transform-Adomian Decomposition Method (STADM), He's Fractional Derivative, Fractional Complex Transform, He–Laplace Method, Fractal–Fractional Derivatives (ARL and ABC), Bernstein Polynomials and Operational Matrices, Modified Homotopy Perturbation Method, and Lagrangian Polynomial Interpolation.
- **Reverse Engineering**: Capable of inferring original parameters from generated fractal data using sophisticated optimization techniques and analytical approximations.
- **Interactive Web Interface**: Provides a user-friendly web interface for real-time fractal generation and visualization.
- **Dynamic Method Selection**: Automatically updates available methods based on the selected model.
- **Real-time Parameter Adjustment**: Allows users to adjust fractal parameters and see results instantly.
- **Canvas Rendering**: Utilizes HTML5 Canvas for efficient fractal visualization.
- **Web Server**: Provides a web server for generating fractals on-demand, supporting multiple models and methods.
- **Interactive Visualizations**: Generates both static images and interactive plots to visualize the fractals, enhancing user engagement and understanding.

## Installation

Ensure you have Node.js version **14.0.0 or higher** installed. This application uses ES6 modules.

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/fractal-generator.git
   cd fractal-generator
   ```

2. **Update `package.json`:**

   Ensure that the `package.json` file includes the `"type": "module"` field to enable ES6 module support.

   ```json
   {
     "name": "fractal-generator",
     "version": "1.0.6",
     "description": "A Node.js application for generating fractals using advanced mathematical models.",
     "type": "module",
     // ... existing content ...
   }
   ```

3. **Install Dependencies:**

   ```bash
   npm install
   ```

## Usage

### Command-Line Interface

Run the application with customizable parameters to generate fractals. You can see those commands in `COMMANDS.md` file in the root of the project.

The following command generates a fractal using the two-scale population model and the Laplace-Adomian Decomposition Method (LADM):

```bash
node src/index.js --model twoScale --method LADM --alpha 0.5 --beta 0.5 --maxTerms 10 --initialCondition "sin(x)" --timeSteps 200 --timeEnd 50
```

```bash
Output file generated: output.png
```


### Web Interface

To use the web interface, start the server with:

```bash
node src/server.js
```

```bash
Server running on port 3000
```

Open your browser and navigate to `http://localhost:3000` to access the interactive fractal generator.

## Contributing

We welcome contributions to improve the application. Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to submit improvements and bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.