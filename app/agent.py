import os
import requests
from typing import Dict, Any
from .utils import setup_logger
from .parser import extract_and_parse_json

logger = setup_logger("agent")

# --- Groq Free Cloud API ---
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
DEFAULT_MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a CAD assistant converting natural language to predefined JSON function calls.
Convert user commands into JSON function calls ONLY. 

Available functions:
1. "create_shape" - Arguments: {"shape_type": str, "dimensions": dict} (Valid shapes: "box", "sphere", "cylinder", "cone", "torus")
2. "modify_dimension" - Arguments: {"feature": str, "value": float, "unit": str}
3. "get_volume" - Arguments: {"unit": str}
4. "extrude" - Arguments: {"face": str, "distance": float, "unit": str}

IMPORTANT: Return ONLY a JSON object in this exact format, no extra text:
{"function": "<function_name>", "arguments": {...}}
"""

def generate_cad_command(prompt: str, model: str = DEFAULT_MODEL) -> Dict[str, Any]:
    if not GROQ_API_KEY:
        raise RuntimeError(
            "GROQ_API_KEY environment variable is not set. "
            "Get a free key at https://console.groq.com/keys and run: "
            "export GROQ_API_KEY='your-key-here'"
        )

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.1,
        "max_tokens": 256
    }
    
    logger.info(f"Sending prompt to Groq ({model})")
    try:
        response = requests.post(GROQ_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        logger.error(f"Error communicating with Groq: {e}")
        raise RuntimeError(f"Failed to connect to Groq API: {e}")

    data = response.json()
    response_text = data["choices"][0]["message"]["content"]
    
    # Parse the response to JSON
    parsed = extract_and_parse_json(response_text)
    
    # Basic validation of the shape
    if "function" not in parsed or "arguments" not in parsed:
        raise ValueError("LLM returned JSON, but missing 'function' or 'arguments' keys.")
        
    return parsed
