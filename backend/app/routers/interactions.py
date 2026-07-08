import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud
from ..models import Interaction
from ..schemas import InteractionOut, FinalizeRequest

router = APIRouter(prefix="/api", tags=["interactions"])


@router.get("/interactions/draft", response_model=InteractionOut)
def get_draft(session_id: str, db: Session = Depends(get_db)):
    draft = crud.get_or_create_draft(db, session_id)
    return draft


@router.post("/interactions/finalize", response_model=InteractionOut)
def finalize(req: FinalizeRequest, db: Session = Depends(get_db)):
    draft = crud.get_or_create_draft(db, req.session_id)
    draft.status = "logged"
    draft.updated_at = datetime.datetime.utcnow()
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft


@router.get("/interactions", response_model=list[InteractionOut])
def list_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).order_by(Interaction.id.desc()).limit(50).all()


@router.get("/materials/search")
def search_materials(q: str = "", item_type: str | None = None, db: Session = Depends(get_db)):
    results = crud.search_materials(db, q, item_type)
    return [{"id": m.id, "name": m.name, "item_type": m.item_type} for m in results]
