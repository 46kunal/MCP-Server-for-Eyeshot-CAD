from typing import Dict, Any, Callable, List, Optional
from ..utils import setup_logger

logger = setup_logger("tool_registry")


class ToolDefinition:
    """Metadata for a registered tool."""
    def __init__(self, name: str, description: str, arguments: Dict[str, str],
                 handler: Callable, category: str = "general"):
        self.name = name
        self.description = description
        self.arguments = arguments  # {"arg_name": "type_description"}
        self.handler = handler
        self.category = category


class ToolRegistry:
    """Dynamic tool registration and dispatch system."""

    def __init__(self):
        self._tools: Dict[str, ToolDefinition] = {}

    def register(self, name: str, description: str, arguments: Dict[str, str],
                 handler: Callable, category: str = "general"):
        self._tools[name] = ToolDefinition(name, description, arguments, handler, category)
        logger.info(f"Registered tool: {name} [{category}]")

    def get_tool(self, name: str) -> Optional[ToolDefinition]:
        return self._tools.get(name)

    def list_tools(self) -> List[str]:
        return list(self._tools.keys())

    def execute(self, name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
        tool = self._tools.get(name)
        if not tool:
            raise ValueError(f"Unknown command: {name}")
        try:
            return tool.handler(**arguments)
        except TypeError as e:
            raise ValueError(f"Invalid parameters for {name}: {e}")

    def generate_prompt_description(self) -> str:
        """Generates a numbered list of tools for the LLM system prompt."""
        lines = []
        for i, (name, tool) in enumerate(self._tools.items(), 1):
            args_str = ", ".join(f'"{k}": {v}' for k, v in tool.arguments.items())
            lines.append(f'{i}. "{name}" - {tool.description}\n   Arguments: {{{args_str}}}')
        return "\n".join(lines)


# Singleton
tool_registry = ToolRegistry()
