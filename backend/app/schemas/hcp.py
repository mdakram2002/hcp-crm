from typing import Optional

from pydantic import BaseModel


class HCPOut(BaseModel):
    id: int
    name: str
    specialty: Optional[str] = None
    institution: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None

    class Config:
        from_attributes = True
