import uuid
from typing import Dict, Any, Optional, List
from ..utils import setup_logger

logger = setup_logger("object_store")


class CADObject:
    """Represents a single CAD object in the scene."""
    def __init__(self, obj_type: str, dimensions: Dict[str, Any] = None,
                 color: str = "#6c9ef8", transform: Dict[str, float] = None):
        self.id = str(uuid.uuid4())[:8]
        self.type = obj_type
        self.dimensions = dimensions or {}
        self.color = color
        self.transform = transform or {"x": 0, "y": 0, "z": 0}
        self.geometry_ref = None  # For real engine binding

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "type": self.type,
            "dimensions": self.dimensions,
            "color": self.color,
            "transform": self.transform
        }


class ObjectStore:
    """In-memory registry of all CAD objects in the scene."""

    def __init__(self):
        self._objects: Dict[str, CADObject] = {}
        self._active_id: Optional[str] = None
        # Create a default object for backward compatibility
        default = CADObject("box", {"width": 1, "height": 2, "depth": 1})
        default.id = "default"
        self._objects["default"] = default
        self._active_id = "default"
        logger.info("ObjectStore initialized with default object")

    def add(self, obj: CADObject) -> CADObject:
        self._objects[obj.id] = obj
        self._active_id = obj.id
        logger.info(f"Added object: {obj.id} ({obj.type})")
        return obj

    def get(self, obj_id: str) -> Optional[CADObject]:
        return self._objects.get(obj_id)

    def get_active(self) -> Optional[CADObject]:
        if self._active_id:
            return self._objects.get(self._active_id)
        return None

    def set_active(self, obj_id: str) -> bool:
        if obj_id in self._objects:
            self._active_id = obj_id
            return True
        return False

    def remove(self, obj_id: str) -> bool:
        if obj_id in self._objects:
            del self._objects[obj_id]
            if self._active_id == obj_id:
                self._active_id = next(iter(self._objects), None)
            logger.info(f"Removed object: {obj_id}")
            return True
        return False

    def list_all(self) -> List[Dict[str, Any]]:
        return [obj.to_dict() for obj in self._objects.values()]

    def count(self) -> int:
        return len(self._objects)


# Singleton
object_store = ObjectStore()
