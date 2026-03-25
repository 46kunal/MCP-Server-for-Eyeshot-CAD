from fastapi import FastAPI
from .routes import router

app = FastAPI(title="MCP CAD Server", description="LLM-driven 3D Geometry Manipulation", version="1.0.0")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "MCP CAD Server is running. Send POST requests to /command."}
