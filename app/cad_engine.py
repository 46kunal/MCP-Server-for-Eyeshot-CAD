from typing import Dict, Any
from .utils import setup_logger

logger = setup_logger("cad_engine")

class MockCADEngine:
    def __init__(self):
        self.state = {
            "volume": 0.0,
            "dimensions": {}
        }
    
    def modify_dimension(self, feature: str, value: float, unit: str) -> Dict[str, Any]:
        logger.info(f"Modifying dimension: {feature} to {value}{unit}")
        if feature not in self.state["dimensions"]:
            self.state["dimensions"][feature] = 0.0
        
        self.state["dimensions"][feature] = value
        
        return {
            "status": "success",
            "message": f"Successfully modified {feature} to {value}{unit}.",
            "data": {
                "feature": feature,
                "new_value": value,
                "unit": unit
            }
        }

    def get_volume(self, unit: str = "mm^3") -> Dict[str, Any]:
        logger.info(f"Retrieving volume in {unit}")
        return {
            "status": "success",
            "message": f"Calculated current volume.",
            "data": {
                "volume": sum(self.state["dimensions"].values()) * 10, # Mock logic
                "unit": unit
            }
        }

    def extrude(self, face: str, distance: float, unit: str) -> Dict[str, Any]:
        logger.info(f"Extruding {face} by {distance}{unit}")
        return {
            "status": "success",
            "message": f"Successfully extruded {face} by {distance}{unit}.",
            "data": {
                "face": face,
                "distance": distance,
                "unit": unit
            }
        }
        
    def execute_command(self, function_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        """
        Routes the function call to the specific method.
        """
        # Ensure it's not a private method or something else
        if not function_name.startswith('_') and hasattr(self, function_name):
            func = getattr(self, function_name)
            if callable(func):
                try:
                    return func(**arguments)
                except TypeError as e:
                    logger.error(f"Missing or invalid parameters for {function_name}: {e}")
                    raise ValueError(f"Missing or invalid parameters for {function_name}: {e}")
        
        logger.error(f"Unknown CAD function called: {function_name}")
        raise ValueError(f"Unknown command: {function_name}")

# Singleton instance
cad_engine = MockCADEngine()
