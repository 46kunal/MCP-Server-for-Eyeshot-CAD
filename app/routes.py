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

@router.post("/command", response_model=CommandResponse)
async def process_command(request: CommandRequest):
    logger.info(f"Received API command request: {request.prompt}")
    
    try:
        # Step 1: LLM interprets the prompt and gives us the function to call
        structured_command = generate_cad_command(request.prompt)
        function_name = structured_command["function"]
        arguments = structured_command["arguments"]
        
        # Step 2: Route to mocked CAD Engine
        result = cad_engine.execute_command(function_name, arguments)
        
        return CommandResponse(
            status=result["status"],
            message=result["message"],
            data=result.get("data")
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
