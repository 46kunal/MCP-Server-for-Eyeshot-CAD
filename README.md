# MCP Server for CAD - LLM-driven 3D Geometry Manipulation

A local-first, open-source MVP of an MCP (Model Context Protocol) type server that uses a cloud LLM (via Groq's free API running Llama 3.3) to translate natural language user commands into structured geometric operations for a simulated CAD engine.

## Prerequisites

1. Python 3.9+
2. A **free Groq API key** — get one at [https://console.groq.com/keys](https://console.groq.com/keys)

## Setup

1. Install the project dependencies:
   ```bash
   cd mcp-cad-server
   pip3 install -r requirements.txt
   ```

2. Start the FastAPI backend server with your Groq key:
   ```bash
   export GROQ_API_KEY='your-groq-api-key-here'
   python3 -m uvicorn app.main:app --reload
   ```
   *The server runs by default on `http://localhost:8000`.*

## Architecture

- **Groq Cloud API**: Free LLM inference using Llama 3.3 70B.
- **FastAPI / MCP Server**: Orchestrates receiving user prompts, formatting them for the LLM, securely parsing the JSON output, and delegating instructions.
- **Mock CAD Engine**: Simulated geometry state handling dimensions and volumetric output based on structured commands.

## Testing via CLI

You can easily interact with the running CAD Server through `test_cli.py`:

```bash
python3 test_cli.py "Increase hole diameter by 5mm"
```

Expected JSON response:
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

More examples:
```bash
python3 test_cli.py "Create a sphere"
python3 test_cli.py "Extrude the top face by 50mm"
python3 test_cli.py "What is the volume?"
```

## Supported Mock CAD Functions

- `create_shape` (shape_type, dimensions) — Generates box, sphere, cylinder, cone, or torus
- `modify_dimension` (feature, value, unit)
- `extrude` (face, distance, unit)
- `get_volume` (unit)
