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

Ensure you have Node.js version **14.0.0 or higher** installed. This application uses ES6 modules and requires modern JavaScript features.

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/fractal-generator.git
   cd fractal-generator
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

   Note: The `canvas` package might require additional native libraries. If you encounter issues, please refer to the [node-canvas installation guide](https://github.com/Automattic/node-canvas#installation).

3. **Verify Installation:**

   After installation, you can verify that everything is set up correctly by running:

   ```bash
   npm test
   ```

   This will run the test suite and ensure all dependencies are working as expected.

## Usage

### Command-Line Interface

To generate fractals using the command-line interface, run:

```bash
node src/index.js
```

### Web Interface

To use the web interface, start the server with:

```bash
node src/server.js
```

Open your browser and navigate to `http://localhost:3000` to access the interactive fractal generator.

### Edge Computing

You can use this application in edge computing environments by running the `edge.js` file. This will start a web server and you can access the fractal generator through your browser.

```bash
node src/edge.js
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
