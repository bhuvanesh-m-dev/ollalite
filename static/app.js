// Theme toggle
function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
}

// Copy text function
function copyText(id) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard");
  });
}

// Fetch models and populate select
async function loadModels() {
  try {
    const response = await fetch('/models');
    if (!response.ok) throw new Error("Failed to fetch models");
    const data = await response.json();
    const select = document.getElementById('model-select');
    select.innerHTML = '';
    data.models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.name;
      option.textContent = model.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);
    alert("Error loading models. Is Ollama running?");
  }
}

// Pull model
async function pullModel() {
  const modelName = document.getElementById('pull-model').value;
  if (!modelName) {
    alert("Please enter a model name");
    return;
  }
  try {
    const response = await fetch('/pull', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: modelName })
    });
    if (!response.ok) throw new Error("Failed to pull model");
    const data = await response.json();
    alert(data.message);
    loadModels(); // Refresh model list
  } catch (error) {
    console.error(error);
    alert("Error pulling model");
  }
}

// Send prompt
async function sendPrompt() {
  const model = document.getElementById('model-select').value;
  const prompt = document.getElementById('prompt').value;
  if (!model || !prompt) {
    alert("Please select a model and enter a prompt");
    return;
  }
  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, prompt })
    });
    if (!response.ok) throw new Error("Failed to generate response");
    const data = await response.json();
    const conversation = document.getElementById('conversation');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    const codeId = 'response-' + Date.now();
    messageDiv.innerHTML = `<pre><code id="${codeId}">${data.response}</code></pre><button onclick="copyText('${codeId}')">Copy</button>`;
    conversation.appendChild(messageDiv);
  } catch (error) {
    console.error(error);
    alert("Error generating response");
  }
}

// Event listeners
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
document.getElementById('pull-button').addEventListener('click', pullModel);
document.getElementById('send-button').addEventListener('click', sendPrompt);

// Load theme from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

// Load models on page load
loadModels();
