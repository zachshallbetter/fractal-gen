/**
 * @module FractalGeneratorInterface
 * @description Handles user interactions and communicates with the server to generate fractals.
 * @since 1.0.15
 */

// Declare the WebSocket variable globally
let ws; // Added global declaration

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

const elements = {
  model: document.getElementById('model'),
  method: document.getElementById('method'),
  alpha: document.getElementById('alpha'),
  beta: document.getElementById('beta'),
  maxTerms: document.getElementById('maxTerms'),
  generateFractal: document.getElementById('generateFractal'),
  results: document.getElementById('results'),
  alphaValue: document.getElementById('alphaValue'),
  betaValue: document.getElementById('betaValue'),
  maxTermsValue: document.getElementById('maxTermsValue'),
  timeSteps: document.getElementById('timeSteps'),
  timeEnd: document.getElementById('timeEnd'),
};

// Add reconnection logic
let wsReconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

function connectWebSocket() {
  ws = new WebSocket(`ws://${window.location.host}`);
  
  ws.onopen = () => {
    console.log('WebSocket connection established');
    wsReconnectAttempts = 0;
    ws.send(JSON.stringify({ action: 'getModelsAndMethods' }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.action) {
      case 'modelsAndMethods':
        populateModelsAndMethods(data.models, data.methods);
        break;
      case 'methods':
        populateMethods(data.methods);
        break;
      case 'fractalData':
        drawFractal(data.data);
        elements.generateFractal.disabled = false;
        elements.generateFractal.textContent = 'Generate Fractal';
        updateProgress(100);
        break;
      case 'progress':
        updateProgress(data.progress);
        break;
      default:
        console.warn('Unknown action received:', data.action);
    }
  };

  ws.onclose = () => {
    console.log('WebSocket connection closed');
    if (wsReconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      wsReconnectAttempts++;
      setTimeout(connectWebSocket, 1000 * wsReconnectAttempts);
    } else {
      displayError('Connection lost. Please refresh the page.');
    }
  };
}

// Initialize connection
connectWebSocket();

// Event listeners
elements.model.addEventListener('change', updateMethods);
elements.generateFractal.addEventListener('click', generateFractal);
elements.alpha.addEventListener('input', updateValueLabel);
elements.beta.addEventListener('input', updateValueLabel);
elements.maxTerms.addEventListener('input', updateValueLabel);

function updateMethods() {
  const selectedModel = elements.model.value;
  ws.send(JSON.stringify({ action: 'getMethods', model: selectedModel }));
}

function updateValueLabel(event) {
  elements[`${event.target.id}Value`].textContent = event.target.value;
}

function generateFractal() {
  const generateButton = elements.generateFractal;
  generateButton.disabled = true;
  generateButton.textContent = 'Generating...';

  const params = {
    action: 'generateFractal',
    params: {
      model: elements.model.value,
      method: elements.method.value,
      alpha: parseFloat(elements.alpha.value),
      beta: parseFloat(elements.beta.value),
      maxTerms: parseInt(elements.maxTerms.value, 10),
      timeSteps: parseInt(elements.timeSteps.value, 10),
      timeEnd: parseFloat(elements.timeEnd.value),
    },
  };

  ws.send(JSON.stringify(params));
}

/**
 * Draws the fractal on the canvas
 * @param {Array} data - The fractal data points
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
    const color = getColor(point.iteration);
    ctx.strokeStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  });
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
  elements.results.innerHTML = `<p class="error">${message}</p>`;
}

function updateProgress(progress) {
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  
  if (progress === 0) {
    progressContainer.style.display = 'block';
  } else if (progress === 100) {
    progressContainer.style.display = 'none';
  }
  
  progressBar.style.width = `${progress}%`;
  progressText.textContent = `Generating fractal... ${progress}%`;
}

/**
 * Populates the model and method dropdowns with available options
 * @param {Array} models - Array of available models
 * @param {Object} methods - Object mapping models to their methods
 */
function populateModelsAndMethods(models, methods) {
  if (models) {
    elements.model.innerHTML = models.map(model => `<option value="${model}">${model}</option>`).join('');
    elements.model.dispatchEvent(new Event('change'));
  }
  if (methods) {
    populateMethods(methods[elements.model.value]);
  }
}

/**
 * Populates the methods dropdown based on the selected model
 * @param {Array} methods - Array of available methods for the selected model
 * @since 1.0.15
 */
function populateMethods(methods) {
  if (methods) {
    elements.method.innerHTML = methods.map(method => `<option value="${method}">${method}</option>`).join('');
  } else {
    elements.method.innerHTML = '';
  }
}
