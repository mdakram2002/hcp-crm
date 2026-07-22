from typing import Any, Dict, List, Optional

from pydantic import BaseModel


class InteractionOut(BaseModel):
    id: int
    session_id: str
    hcp_name: Optional[str] = None
    hcp_id: Optional[int] = None
    hcp: Optional[Dict[str, Any]] = None
    interaction_type: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    attendees: List[str] = []
    topics_discussed: Optional[str] = None
    materials_shared: List[str] = []
    samples_distributed: List[str] = []
    sentiment: Optional[str] = None
    outcomes: Optional[str] = None
    follow_up_actions: List[str] = []
    ai_suggested_follow_ups: List[str] = []
    status: str

    class Config:
        from_attributes = True


class FinalizeRequest(BaseModel):
    session_id: str
