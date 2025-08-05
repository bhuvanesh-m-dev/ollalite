# main.py
# Entry point for PyLlamaUI, initializes the GUI and connects components

import sys
from api import OllamaAPI

def main():
    # Create Ollama API instance
    api = OllamaAPI(base_url="http://localhost:11434")
    
    # Get prompt from command-line arguments
    if len(sys.argv) > 1:
        prompt = ' '.join(sys.argv[1:])
    else:
        # Provide a default prompt if none is given
        prompt = input("Enter your prompt : ")
    
    # Send prompt to Ollama and get response
    print(f"Sending prompt: {prompt}")
    response = api.send_prompt(prompt)
    
    # Print the response
    print(f"Response: {response}")

if __name__ == "__main__":
    main()
