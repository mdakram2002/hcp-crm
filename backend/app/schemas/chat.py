from typing import Any, Dict, List

from pydantic import BaseModel


class ChatRequest(BaseModel):
    session_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    field_updates: Dict[str, Any] = {}
    tool_calls: List[str] = []
