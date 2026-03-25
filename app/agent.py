import requests
from typing import Dict, Any
from .utils import setup_logger
from .parser import extract_and_parse_json

logger = setup_logger("agent")

OLLAMA_URL = "http://localhost:11434/api/generate"
DEFAULT_MODEL = "llama3"

SYSTEM_PROMPT = """
You are a CAD assistant computing natural language to predefined JSON function calls.
Convert user commands into JSON function calls ONLY. 

Available functions:
1. "modify_dimension" - Arguments: {"feature": str, "value": float, "unit": str}
2. "get_volume" - Arguments: {"unit": str}
3. "extrude" - Arguments: {"face": str, "distance": float, "unit": str}

Expected output format (ONLY RETURN THIS JSON, NO EXTRA TEXT):
```json
{
  "function": "<function_name>",
  "arguments": {
    ...
  }
}
```
"""

def generate_cad_command(prompt: str, model: str = DEFAULT_MODEL) -> Dict[str, Any]:
    full_prompt = f"{SYSTEM_PROMPT}\n\nUser command: {prompt}"
    
    payload = {
        "model": model,
        "prompt": full_prompt,
        "stream": False
    }
    
    logger.info(f"Sending prompt to Ollama ({model})")
    try:
        response = requests.post(OLLAMA_URL, json=payload, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error communicating with Ollama: {e}")
        raise RuntimeError(f"Failed to connect to Ollama at {OLLAMA_URL}. Is it running?")

    data = response.json()
    response_text = data.get("response", "")
    
    # Parse the response to JSON
    parsed = extract_and_parse_json(response_text)
    
    # Basic validation of the shape
    if "function" not in parsed or "arguments" not in parsed:
        raise ValueError("LLM returned JSON, but missing 'function' or 'arguments' keys.")
        
    return parsed
