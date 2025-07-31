from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
import requests
import subprocess

app = FastAPI()

# Mount static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

OLLAMA_API = "http://localhost:11434"

@app.get("/models")
def get_models():
    try:
        response = requests.get(f"{OLLAMA_API}/api/tags")
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail="Ollama is not running or error fetching models")

@app.post("/pull")
def pull_model(model: str):
    try:
        result = subprocess.run(["ollama", "pull", model], capture_output=True, text=True)
        if result.returncode != 0:
            raise HTTPException(status_code=500, detail=result.stderr)
        return {"message": f"Model {model} pulled successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
def generate_response(model: str, prompt: str):
    try:
        response = requests.post(f"{OLLAMA_API}/api/generate", json={"model": model, "prompt": prompt})
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail="Error generating response")
