"""
Extended CAD Engine — maintains ALL original methods + adds new tools.
Uses ObjectStore for multi-object tracking and RealEngine when available.
"""
from typing import Dict, Any
from .utils import setup_logger
from .models.object_store import CADObject, object_store
from .cad.real_engine import real_engine
from .cad.mesh_converter import shape_to_gltf
from .mcp.tool_registry import tool_registry

logger = setup_logger("cad_engine")

# Config flag
USE_REAL_CAD = real_engine.available


class MockCADEngine:
    def __init__(self):
        self.state = {
            "shape": "box",
            "volume": 0.0,
            "dimensions": {}
        }

    # ──────────────────────────────────────────
    # ORIGINAL METHODS (unchanged)
    # ──────────────────────────────────────────

    def create_shape(self, shape_type: str, dimensions: Dict[str, Any] = None) -> Dict[str, Any]:
        dimensions = dimensions or {}
        logger.info(f"Creating shape: {shape_type} with dimensions {dimensions}")
        self.state["shape"] = shape_type
        self.state["dimensions"] = dimensions

        # Also register in object store
        obj = CADObject(shape_type, dimensions)
        object_store.add(obj)

        return {
            "status": "success",
            "message": f"Successfully generated a {shape_type}.",
            "data": {
                "feature": "shape_type",
                "new_value": shape_type,
                "dimensions": dimensions
            }
        }

    def modify_dimension(self, feature: str, value: float, unit: str) -> Dict[str, Any]:
        logger.info(f"Modifying dimension: {feature} to {value}{unit}")
        if feature not in self.state["dimensions"]:
            self.state["dimensions"][feature] = 0.0
        self.state["dimensions"][feature] = value

        # Update active object in store
        active = object_store.get_active()
        if active:
            active.dimensions[feature] = value

        return {
            "status": "success",
            "message": f"Successfully modified {feature} to {value}{unit}.",
            "data": {"feature": feature, "new_value": value, "unit": unit}
        }

    def get_volume(self, unit: str = "mm^3") -> Dict[str, Any]:
        logger.info(f"Retrieving volume in {unit}")
        active = object_store.get_active()

        # Try real engine first
        if USE_REAL_CAD and active:
            real_vol = real_engine.compute_volume(active.id)
            if real_vol is not None:
                return {
                    "status": "success",
                    "message": "Calculated volume (real geometry).",
                    "data": {"volume": real_vol, "unit": unit}
                }

        # Fallback mock
        dims = self.state.get("dimensions", {})
        mock_vol = 1.0
        for v in dims.values():
            if isinstance(v, (int, float)):
                mock_vol *= v
        return {
            "status": "success",
            "message": "Calculated current volume.",
            "data": {"volume": round(mock_vol, 4), "unit": unit}
        }

    def extrude(self, face: str, distance: float, unit: str) -> Dict[str, Any]:
        logger.info(f"Extruding {face} by {distance}{unit}")
        return {
            "status": "success",
            "message": f"Successfully extruded {face} by {distance}{unit}.",
            "data": {"face": face, "distance": distance, "unit": unit}
        }

    # ──────────────────────────────────────────
    # NEW TOOLS (Phase 4)
    # ──────────────────────────────────────────

    def create_box(self, length: float = 1, width: float = 1, height: float = 1,
                   color: str = "#6c9ef8") -> Dict[str, Any]:
        dims = {"length": length, "width": width, "height": height}
        obj = CADObject("box", dims, color=color)
        object_store.add(obj)
        self.state["shape"] = "box"
        self.state["dimensions"] = dims

        if USE_REAL_CAD:
            real_engine.create_box(obj.id, length, width, height)

        return {
            "status": "success",
            "message": f"Created box ({length}×{width}×{height}).",
            "data": {"feature": "shape_type", "new_value": "box", "dimensions": dims},
            "color": color,
            "object_id": obj.id
        }

    def create_cylinder(self, radius: float = 1, height: float = 2,
                        color: str = "#6c9ef8") -> Dict[str, Any]:
        dims = {"radius": radius, "height": height}
        obj = CADObject("cylinder", dims, color=color)
        object_store.add(obj)
        self.state["shape"] = "cylinder"
        self.state["dimensions"] = dims

        if USE_REAL_CAD:
            real_engine.create_cylinder(obj.id, radius, height)

        return {
            "status": "success",
            "message": f"Created cylinder (r={radius}, h={height}).",
            "data": {"feature": "shape_type", "new_value": "cylinder", "dimensions": dims},
            "color": color,
            "object_id": obj.id
        }

    def boolean_cut(self, target_id: str = "default", tool_id: str = "") -> Dict[str, Any]:
        if not tool_id:
            return {"status": "error", "message": "Tool object ID required for boolean cut.", "data": None}

        if USE_REAL_CAD:
            result = real_engine.boolean_cut(target_id, tool_id)
            if result:
                return {
                    "status": "success",
                    "message": f"Boolean cut: removed {tool_id} from {target_id}.",
                    "data": {"target": target_id, "tool": tool_id}
                }

        # Mock fallback
        object_store.remove(tool_id)
        return {
            "status": "success",
            "message": f"Boolean cut simulated: removed {tool_id} from {target_id}.",
            "data": {"target": target_id, "tool": tool_id}
        }

    def set_color(self, color: str, object_id: str = "") -> Dict[str, Any]:
        target = object_store.get(object_id) if object_id else object_store.get_active()
        if not target:
            return {"status": "error", "message": "No object found to set color.", "data": None}

        target.color = color
        logger.info(f"Set color of {target.id} to {color}")

        return {
            "status": "success",
            "message": f"Set color of {target.type} to {color}.",
            "data": {"object_id": target.id, "color": color},
            "color": color
        }

    def list_objects(self) -> Dict[str, Any]:
        objects = object_store.list_all()
        return {
            "status": "success",
            "message": f"Scene contains {len(objects)} object(s).",
            "data": {"objects": objects, "count": len(objects)}
        }

    # ──────────────────────────────────────────
    # DISPATCHER (handles old + new tools)
    # ──────────────────────────────────────────

    def execute_command(self, function_name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        # First try tool registry
        tool = tool_registry.get_tool(function_name)
        if tool:
            try:
                return tool.handler(**arguments)
            except TypeError as e:
                logger.error(f"Invalid params for {function_name}: {e}")
                raise ValueError(f"Missing or invalid parameters for {function_name}: {e}")

        # Fallback to direct method lookup (backward compat)
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


# Singleton
cad_engine = MockCADEngine()

# ──────────────────────────────────────────
# REGISTER ALL TOOLS
# ──────────────────────────────────────────

tool_registry.register("create_shape", "Generate a shape (box, sphere, cylinder, cone, torus)",
    {"shape_type": "str", "dimensions": "dict"}, cad_engine.create_shape, "geometry")

tool_registry.register("modify_dimension", "Modify a dimension of the active object",
    {"feature": "str", "value": "float", "unit": "str"}, cad_engine.modify_dimension, "geometry")

tool_registry.register("get_volume", "Calculate the volume of the active object",
    {"unit": "str"}, cad_engine.get_volume, "analysis")

tool_registry.register("extrude", "Extrude a face by a given distance",
    {"face": "str", "distance": "float", "unit": "str"}, cad_engine.extrude, "geometry")

tool_registry.register("create_box", "Create a parametric box with length/width/height and optional color",
    {"length": "float", "width": "float", "height": "float", "color": "str (optional)"},
    cad_engine.create_box, "geometry")

tool_registry.register("create_cylinder", "Create a cylinder with radius/height and optional color",
    {"radius": "float", "height": "float", "color": "str (optional)"},
    cad_engine.create_cylinder, "geometry")

tool_registry.register("boolean_cut", "Remove one shape from another (boolean subtraction)",
    {"target_id": "str", "tool_id": "str"}, cad_engine.boolean_cut, "boolean")

tool_registry.register("set_color", "Set the color of an object",
    {"color": "str (hex)", "object_id": "str (optional)"}, cad_engine.set_color, "appearance")

tool_registry.register("list_objects", "List all objects in the scene",
    {}, cad_engine.list_objects, "scene")
