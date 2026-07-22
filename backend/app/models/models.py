import datetime

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import VECTOR
from sqlalchemy.orm import relationship

from ..database import Base


class User(Base):
    """Authenticated user in the CRM."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(16), nullable=False, default="rep")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class HCP(Base):
    """Reference table for healthcare professionals."""

    __tablename__ = "hcps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    specialty = Column(String(255), nullable=True)
    institution = Column(String(255), nullable=True)
    phone = Column(String(64), nullable=True)
    email = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    interactions = relationship("Interaction", back_populates="hcp")


class Interaction(Base):
    """A single HCP interaction record (draft or finalized)."""

    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), index=True, nullable=False)

    hcp_name = Column(String(255), nullable=True)
    hcp_id = Column(Integer, ForeignKey("hcps.id"), nullable=True, index=True)
    interaction_type = Column(String(64), nullable=True)  # Meeting/Call/Email/Conference
    date = Column(String(32), nullable=True)  # ISO date string, kept as string for simplicity
    time = Column(String(16), nullable=True)
    attendees = Column(JSON, default=list)

    topics_discussed = Column(Text, nullable=True)

    materials_shared = Column(JSON, default=list)
    samples_distributed = Column(JSON, default=list)

    sentiment = Column(String(16), nullable=True)  # Positive/Neutral/Negative

    outcomes = Column(Text, nullable=True)
    embedding = Column(VECTOR(1536), nullable=True)
    follow_up_actions = Column(JSON, default=list)
    ai_suggested_follow_ups = Column(JSON, default=list)

    status = Column(String(16), default="draft")  # draft / logged
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    hcp = relationship("HCP", back_populates="interactions")


class Material(Base):
    """Reference table of marketing materials and drug samples."""

    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    item_type = Column(String(16), nullable=False)  # material / sample
