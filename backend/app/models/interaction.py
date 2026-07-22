import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.dialects.postgresql import VECTOR
from sqlalchemy.orm import relationship

from app.core.database import Base


class Interaction(Base):
    """A single HCP interaction record (draft or finalized)."""

    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), index=True, nullable=False)

    hcp_name = Column(String(255), nullable=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=True, index=True)
    interaction_type = Column(String(64), nullable=True)
    date = Column(String(32), nullable=True)
    time = Column(String(16), nullable=True)
    attendees = Column(JSON, default=list)

    topics_discussed = Column(Text, nullable=True)

    materials_shared = Column(JSON, default=list)
    samples_distributed = Column(JSON, default=list)

    sentiment = Column(String(16), nullable=True)

    outcomes = Column(Text, nullable=True)
    embedding = Column(VECTOR(1536), nullable=True)
    follow_up_actions = Column(JSON, default=list)
    ai_suggested_follow_ups = Column(JSON, default=list)

    status = Column(String(16), default="draft")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    hcp = relationship("HCP", back_populates="interactions")
