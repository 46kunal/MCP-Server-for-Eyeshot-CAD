"""
Real CAD Engine using OCP (cadquery/build123d) if available.
Falls back gracefully to None if OCP is not installed.
"""
from typing import Dict, Any, Optional
from ..utils import setup_logger

logger = setup_logger("real_engine")

# Attempt to import OCP
try:
    import cadquery as cq
    OCP_AVAILABLE = True
    logger.info("CadQuery/OCP loaded — real geometry engine available")
except ImportError:
    OCP_AVAILABLE = False
    logger.warning("CadQuery/OCP not found — real geometry engine disabled, using mock fallback")


class RealCADEngine:
    """Real parametric CAD engine powered by OpenCascade (via CadQuery)."""

    def __init__(self):
        self._shapes: Dict[str, Any] = {}  # id -> cq.Workplane

    @property
    def available(self) -> bool:
        return OCP_AVAILABLE

    def create_box(self, obj_id: str, length: float, width: float, height: float) -> Optional[Any]:
        if not OCP_AVAILABLE:
            return None
        try:
            shape = cq.Workplane("XY").box(length, width, height)
            self._shapes[obj_id] = shape
            logger.info(f"Real box created: {obj_id} ({length}x{width}x{height})")
            return shape
        except Exception as e:
            logger.error(f"Real engine error (create_box): {e}")
            return None

    def create_cylinder(self, obj_id: str, radius: float, height: float) -> Optional[Any]:
        if not OCP_AVAILABLE:
            return None
        try:
            shape = cq.Workplane("XY").cylinder(height, radius)
            self._shapes[obj_id] = shape
            logger.info(f"Real cylinder created: {obj_id} (r={radius}, h={height})")
            return shape
        except Exception as e:
            logger.error(f"Real engine error (create_cylinder): {e}")
            return None

    def create_sphere(self, obj_id: str, radius: float) -> Optional[Any]:
        if not OCP_AVAILABLE:
            return None
        try:
            shape = cq.Workplane("XY").sphere(radius)
            self._shapes[obj_id] = shape
            logger.info(f"Real sphere created: {obj_id} (r={radius})")
            return shape
        except Exception as e:
            logger.error(f"Real engine error (create_sphere): {e}")
            return None

    def boolean_cut(self, target_id: str, tool_id: str) -> Optional[Any]:
        if not OCP_AVAILABLE:
            return None
        target = self._shapes.get(target_id)
        tool = self._shapes.get(tool_id)
        if not target or not tool:
            logger.error(f"Boolean cut: missing shapes ({target_id}, {tool_id})")
            return None
        try:
            result = target.cut(tool)
            self._shapes[target_id] = result
            logger.info(f"Boolean cut: {tool_id} from {target_id}")
            return result
        except Exception as e:
            logger.error(f"Real engine error (boolean_cut): {e}")
            return None

    def compute_volume(self, obj_id: str) -> Optional[float]:
        if not OCP_AVAILABLE:
            return None
        shape = self._shapes.get(obj_id)
        if not shape:
            return None
        try:
            vol = shape.val().Volume()
            return round(vol, 4)
        except Exception as e:
            logger.error(f"Real engine error (compute_volume): {e}")
            return None

    def get_shape(self, obj_id: str) -> Optional[Any]:
        return self._shapes.get(obj_id)

    def remove_shape(self, obj_id: str):
        self._shapes.pop(obj_id, None)


# Singleton
real_engine = RealCADEngine()
