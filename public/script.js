/**
 * @module FractalGeneratorInterface
 * @description Handles user interactions and communicates with the server to generate fractals.
 * Provides an interactive interface for users to adjust parameters and visualize fractal data.
 * @since 1.0.2
 */

const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');

const modelSelect = document.getElementById('model');
const methodSelect = document.getElementById('method');
const alphaSlider = document.getElementById('alpha');
const betaSlider = document.getElementById('beta');
const maxTermsSlider = document.getElementById('maxTerms');
const reverseEngineerCheckbox = document.getElementById('reverseEngineer');

const alphaValueLabel = document.getElementById('alphaValue');
const betaValueLabel = document.getElementById('betaValue');
const maxTermsValueLabel = document.getElementById('maxTermsValue');
const resultsDiv = document.getElementById('results');

// Update labels and generate fractal on input change
[modelSelect, methodSelect, alphaSlider, betaSlider, maxTermsSlider, reverseEngineerCheckbox].forEach(element => {
  element.addEventListener('input', updateLabelAndGenerateFractal);
});

/**
 * Updates the corresponding label and triggers fractal generation
 * @param {Event} event - The input event
 */
function updateLabelAndGenerateFractal(event) {
  if (event.target.type === 'range') {
    const label = document.getElementById(`${event.target.id}Value`);
    label.textContent = event.target.value;
  }
  generateFractal();
}

/**
 * Requests fractal data from the server and handles the response
 * @async
 * @function
 * @throws {Error} If there's an issue with the server request or response
 */
async function generateFractal() {
  const params = {
    model: modelSelect.value,
    method: methodSelect.value,
    alpha: parseFloat(alphaSlider.value),
    beta: parseFloat(betaSlider.value),
    maxTerms: parseInt(maxTermsSlider.value),
    reverseEngineer: reverseEngineerCheckbox.checked
  };

  try {
    const response = await fetch('/generateFractal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    if (result.success) {
      renderFractal(result.data);
      displayResults(result);
    } else {
      throw new Error(result.message || 'Unknown error occurred');
    }
  } catch (error) {
    console.error('Error generating fractal:', error);
    displayError(error.message);
  }
}

/**
 * Renders the fractal data on the canvas
 * @param {Object} data - The fractal data to render
 */
function renderFractal(data) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const maxX = Math.max(...data.map(point => point.x));
  const maxY = Math.max(...data.map(point => point.y));
  const minY = Math.min(...data.map(point => point.y));

  data.forEach(point => {
    const x = (point.x / maxX) * canvas.width;
    const y = canvas.height - ((point.y - minY) / (maxY - minY)) * canvas.height;
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(x, y, 2, 2);
  });
}

/**
 * Displays the results of the fractal generation
 * @param {Object} result - The result object from the server
 */
function displayResults(result) {
  resultsDiv.innerHTML = '';
  if (result.data && result.data.length > 0) {
    const resultParagraph = document.createElement('p');
    resultParagraph.textContent = `Generated ${result.data.length} data points.`;
    resultsDiv.appendChild(resultParagraph);
  }
  if (result.inferredParams) {
    const inferredParamsHeader = document.createElement('h3');
    inferredParamsHeader.textContent = 'Inferred Parameters:';
    resultsDiv.appendChild(inferredParamsHeader);
    const inferredParamsList = document.createElement('ul');
    for (const [key, value] of Object.entries(result.inferredParams)) {
      const listItem = document.createElement('li');
      listItem.textContent = `${key}: ${value}`;
      inferredParamsList.appendChild(listItem);
    }
    resultsDiv.appendChild(inferredParamsList);
  }
}

/**
 * Displays an error message to the user
 * @param {string} message - The error message to display
 */
function displayError(message) {
  resultsDiv.innerHTML = `<p class="error">Error: ${message}</p>`;
}

/**
 * Populates the method select based on the selected model
 * @async
 * @function
 */
async function updateMethods() {
  const model = modelSelect.value;
  try {
    const response = await fetch(`/methods/${model}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const methods = await response.json();
    methodSelect.innerHTML = methods.map(method => `<option value="${method}">${method}</option>`).join('');
    generateFractal();
  } catch (error) {
    console.error('Error fetching methods:', error);
    displayError('Failed to fetch available methods');
  }
}

// Event listener for model change
modelSelect.addEventListener('change', updateMethods);

// Initial method population and fractal generation
updateMethods();
