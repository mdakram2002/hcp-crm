from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.hcp import HCP


def _normalize_name(name: str) -> str:
    return " ".join((name or "").split()).strip().casefold()


def find_or_create_hcp(db: Session, name: str) -> Optional[HCP]:
    normalized = _normalize_name(name)
    if not normalized:
        return None

    match = db.query(HCP).filter(func.lower(HCP.name) == normalized).first()
    if match is None:
        match = (
            db.query(HCP)
            .filter(func.lower(HCP.name).like(f"%{normalized}%"))
            .order_by(HCP.name)
            .first()
        )

    if match is None:
        match = HCP(name=name.strip())
        db.add(match)
        db.commit()
        db.refresh(match)
    return match


def search_hcps(db: Session, query: str):
    q = db.query(HCP)
    if query:
        q = q.filter(func.lower(HCP.name).like(f"%{_normalize_name(query)}%"))
    return q.order_by(HCP.name).limit(10).all()
