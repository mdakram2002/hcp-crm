from sqlalchemy import Column, Integer, String

from app.core.database import Base


class Material(Base):
    """Reference table of marketing materials and drug samples."""

    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    item_type = Column(String(16), nullable=False)
