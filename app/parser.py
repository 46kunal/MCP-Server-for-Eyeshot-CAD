import json
import re
from typing import Dict, Any
from .utils import setup_logger

logger = setup_logger("parser")

def extract_and_parse_json(text: str) -> Dict[str, Any]:
    """
    Tries to extract a JSON block from free text returned by LLM.
    """
    logger.debug(f"Raw LLM output:\n{text}")
    # Try to find a JSON block wrapped in ```json ... ```
    json_match = re.search(r'```(?:json)?\s*(\{.*?\})\s*```', text, re.DOTALL)
    
    json_str = ""
    if json_match:
        json_str = json_match.group(1)
    else:
        # Fallback: try to find the first '{' and last '}'
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1 and end > start:
            json_str = text[start:end+1]
        else:
            raise ValueError("No valid JSON object found in response.")
            
    try:
        parsed = json.loads(json_str)
        return parsed
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON: {json_str}")
        raise ValueError(f"Invalid JSON format: {str(e)}")
