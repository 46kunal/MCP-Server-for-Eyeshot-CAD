import json
import re
from typing import Dict, Any
from .utils import setup_logger

logger = setup_logger("parser")

def extract_and_parse_json(text: str) -> Dict[str, Any]:
    """
    Tries to extract a JSON block from free text returned by LLM.
    Handles nested objects, markdown code fences, and multi-line output.
    """
    logger.debug(f"Raw LLM output:\n{text}")
    
    # Strategy 1: Try to find a JSON block wrapped in ```json ... ```
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass
    
    # Strategy 2: Find the outermost balanced braces
    depth = 0
    start_idx = -1
    for i, ch in enumerate(text):
        if ch == '{':
            if depth == 0:
                start_idx = i
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth == 0 and start_idx != -1:
                candidate = text[start_idx:i+1]
                try:
                    return json.loads(candidate)
                except json.JSONDecodeError:
                    start_idx = -1
                    continue
    
    raise ValueError("No valid JSON object found in response.")
