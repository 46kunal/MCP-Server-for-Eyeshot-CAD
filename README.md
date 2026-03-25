# MCP Server for CAD - LLM-driven 3D Geometry Manipulation

A local-first, open-source MVP of an MCP (Model Context Protocol) type server that uses a local LLM (via Ollama) to translate natural language user commands into structured geometric operations for a simulated CAD engine.

## Prerequisites

1. Python 3.9+
2. [Ollama](https://ollama.com/) must be installed.

## Setup

1. Make sure Ollama is running and has downloaded the model:
   ```bash
   ollama run llama3
   ```
   *Note: Ollama automatically starts an API server on `http://localhost:11434`.*

2. Install the project dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Start the FastAPI backend server:
   ```bash
   uvicorn app.main:app --reload
   ```
   *The server runs by default on `http://localhost:8000`.*

## Architecture

- **Ollama**: Local LLM execution.
- **FastAPI / MCP Server**: Orchestrates receiving user prompts, formatting them for the LLM, securely parsing the JSON output, and delegating instructions.
- **Mock CAD Engine**: Simulated geometry state handling dimensions and volumetric output based on structured commands.

## Testing via CLI

You can easily interact with the running CAD Server through `test_cli.py`:

```bash
python test_cli.py "Increase hole diameter by 5mm"
```

Expected JSON response from FastAPI endpoint:
```json
{
  "status": "success",
  "message": "Successfully modified hole to 5.0mm.",
  "data": {
    "feature": "hole",
    "new_value": 5.0,
    "unit": "mm"
  }
}
```

Example 2:
```bash
python test_cli.py "Extrude the top face by 50mm"
```

## Supported Mock CAD Functions

The instructions parsed by the local LLM map strictly to these 3 mock functions:
- `modify_dimension` (feature, value, unit)
- `extrude` (face, distance, unit)
- `get_volume` (unit)
