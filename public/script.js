/**
 * @module FractalGeneratorInterface
 * @description Handles user interactions and communicates with the server to generate fractals.
 * Provides an interactive interface for users to adjust parameters and visualize fractal data.
 * @since 1.0.7
 */

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const ws = new WebSocket('ws://localhost:3000');

const elements = {
  alpha: document.getElementById('alpha'),
  beta: document.getElementById('beta'),
  model: document.getElementById('model'),
  method: document.getElementById('method'),
  generateFractal: document.getElementById('generateFractal'),
  reverseEngineer: document.getElementById('reverseEngineer'),
  results: document.getElementById('results')
};

elements.alpha.addEventListener('input', updateValue);
elements.beta.addEventListener('input', updateValue);
elements.model.addEventListener('change', populateMethods);
elements.generateFractal.addEventListener('click', generateFractal);

/**
 * Updates the corresponding label when a slider value changes
 * @function
 * @param {Event} event - The input event
 */
function updateValue(event) {
  document.getElementById(`${event.target.id}Value`).textContent = event.target.value;
}

/**
 * Sends fractal generation parameters to the WebSocket server
 * @function
 */
function generateFractal() {
  const params = {
    model: elements.model.value,
    method: elements.method.value,
    alpha: parseFloat(elements.alpha.value),
    beta: parseFloat(elements.beta.value),
    timeSteps: 1000,
    timeEnd: 10,
    reverseEngineer: elements.reverseEngineer.checked,
  };

  ws.send(JSON.stringify(params));
}

/**
 * Handles incoming WebSocket messages
 * @param {MessageEvent} event - The WebSocket message event
 */
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.methods) {
    elements.method.innerHTML = data.methods.map(method => `<option value="${method}">${method}</option>`).join('');
  } else if (data.success) {
    drawFractal(data.data);
  } else {
    displayError(data.error);
  }
};

/**
 * Renders the fractal data on the canvas
 * @param {Array<{x: number, y: number, iteration: number}>} data - The fractal data to render
 */
function drawFractal(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  data.forEach((point, index) => {
    const x = (point.x / 10) * canvas.width;
    const y = canvas.height - (point.y / 10) * canvas.height;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();
}

/**
 * Generates a color based on the iteration count
 * @param {number} iteration - The iteration count
 * @returns {{r: number, g: number, b: number}} The RGB color values
 */
function getColor(iteration) {
  const hue = (iteration % 360) / 360;
  const saturation = 0.8;
  const lightness = 0.5;
  return hslToRgb(hue, saturation, lightness);
}

/**
 * Converts HSL color values to RGB
 * @param {number} h - Hue
 * @param {number} s - Saturation
 * @param {number} l - Lightness
 * @returns {{r: number, g: number, b: number}} The RGB color values
 */
function hslToRgb(h, s, l) {
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

/**
 * Displays an error message to the user
 * @param {string} message - The error message to display
 */
function displayError(message) {
  elements.results.innerHTML = `<p class="error">Error: ${message}</p>`;
}

/**
 * Initializes the WebSocket connection and sets up error handling
 */
function initializeWebSocket() {
  ws.onerror = (error) => {
    console.error('WebSocket Error:', error);
    displayError('Failed to connect to the server. Please try again later.');
  };

  ws.onopen = () => {
    console.log('WebSocket connection established');
    populateMethods(); // Populate methods for the initial model
  };
}

// Initialize WebSocket and generate initial fractal
initializeWebSocket();
