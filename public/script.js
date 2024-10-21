/**
 * Fractal Generator Interface Script
 * Handles user interactions and communicates with the server to generate fractals.
 *
 * @module FractalGeneratorScript
 * @since 1.0.0
 */

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

const alphaSlider = document.getElementById('alpha');
const betaSlider = document.getElementById('beta');
const maxTermsSlider = document.getElementById('maxTerms');

const alphaValueLabel = document.getElementById('alphaValue');
const betaValueLabel = document.getElementById('betaValue');
const maxTermsValueLabel = document.getElementById('maxTermsValue');

// Update labels and generate fractal on slider input
alphaSlider.addEventListener('input', () => {
  alphaValueLabel.textContent = alphaSlider.value;
  generateFractal();
});

betaSlider.addEventListener('input', () => {
  betaValueLabel.textContent = betaSlider.value;
  generateFractal();
});

maxTermsSlider.addEventListener('input', () => {
  maxTermsValueLabel.textContent = maxTermsSlider.value;
  generateFractal();
});

// Function to request fractal data from the server
function generateFractal() {
  const params = {
    model: 'fractionalSineGordon',
    method: 'LADM',
    alpha: parseFloat(alphaSlider.value),
    beta: parseFloat(betaSlider.value),
    maxTerms: parseInt(maxTermsSlider.value)
  };

  fetch('/generateFractal', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
    .then(response => response.json())
    .then(data => {
      renderFractal(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to render fractal on the canvas
function renderFractal(data) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw fractal based on data
  data.points.forEach(point => {
    ctx.fillStyle = `rgba(${point.color.r}, ${point.color.g}, ${point.color.b}, ${point.color.a})`;
    ctx.fillRect(point.x, point.y, 1, 1);
  });
}

// Initial fractal generation
generateFractal();
