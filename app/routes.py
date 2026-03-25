from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from .agent import generate_cad_command
from .cad_engine import cad_engine
from .utils import setup_logger

logger = setup_logger("routes")

router = APIRouter()

class CommandRequest(BaseModel):
    prompt: str

class CommandResponse(BaseModel):
    status: str
    message: str
    data: Optional[dict] = None
    # NEW optional fields (backward compatible — old responses omit these)
    color: Optional[str] = None
    mesh_url: Optional[str] = None
    object_id: Optional[str] = None

@router.post("/command", response_model=CommandResponse)
async def process_command(request: CommandRequest):
    logger.info(f"Received API command request: {request.prompt}")
    
    try:
        structured_command = generate_cad_command(request.prompt)
        function_name = structured_command["function"]
        arguments = structured_command["arguments"]
        
        result = cad_engine.execute_command(function_name, arguments)
        
        return CommandResponse(
            status=result.get("status", "success"),
            message=result.get("message", ""),
            data=result.get("data"),
            color=result.get("color"),
            mesh_url=result.get("mesh_url"),
            object_id=result.get("object_id")
        )

    except ValueError as ve:
        logger.error(f"Validation Error: {ve}")
        raise HTTPException(status_code=400, detail=str(ve))
    except RuntimeError as re:
        logger.error(f"Runtime Error: {re}")
        raise HTTPException(status_code=503, detail=str(re))
    except Exception as e:
        logger.error(f"Unexpected Error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
