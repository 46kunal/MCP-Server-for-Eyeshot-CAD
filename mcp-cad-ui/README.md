# Futuristic MCP CAD Dashboard UI

A React + Vite + Three.js frontend web application functioning as a holographic dashboard for the **MCP CAD Server**.

## Features
- **3D Viewer**: A live wireframe representation reacting to real-time CAD dimensions via Three.js. Supports box, sphere, cylinder, cone, and torus shapes.
- **Dark Glassmorphism UI**: Neon blue (`#00eaff`) typography, grid backgrounds, and blurred panels with full glow effects.
- **Command Terminal**: User inputs are sent directly to the local FastAPI backend (`http://localhost:8000/command`) powered by Groq's free Llama 3.3 API.
- **Dynamic Status Logs**: Live Model Attributes, System processing states, and persistent Command History.

## Running Locally

1. **Start the backend server** (in a separate terminal):
   ```bash
   cd ../mcp-cad-server
   export GROQ_API_KEY='your-groq-key-here'
   python3 -m uvicorn app.main:app --reload
   ```

2. **Start the Dashboard:**
   ```bash
   cd mcp-cad-ui
   npm install
   npm run dev
   ```

3. **Interact:**
   Open your browser to `http://localhost:5173` and type commands like:
   - "Create a sphere"
   - "Set the width to 5 units"
   - "Extrude top face by 2 meters"
   - "Generate a torus"
