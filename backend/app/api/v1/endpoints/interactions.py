import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.crud.interaction import get_dashboard_summary, get_or_create_draft, apply_updates, search_materials
from app.crud.hcp import find_or_create_hcp, search_hcps
from app.models.interaction import Interaction
from app.models.user import User
from app.schemas.interaction import FinalizeRequest, InteractionOut

router = APIRouter(prefix="/api", tags=["interactions"])


@router.get("/interactions/draft", response_model=InteractionOut)
def get_draft(session_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_or_create_draft(db, session_id)
    if current_user.role == "rep" and draft.user_id not in {None, current_user.id}:
        raise HTTPException(status_code=403, detail="Not authorized")
    if draft.user_id is None:
        draft.user_id = current_user.id
        db.add(draft)
        db.commit()
        db.refresh(draft)
    return draft


@router.post("/interactions/finalize", response_model=InteractionOut)
def finalize(req: FinalizeRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    draft = get_or_create_draft(db, req.session_id)
    if current_user.role == "rep" and draft.user_id not in {None, current_user.id}:
        raise HTTPException(status_code=403, detail="Not authorized")
    if draft.user_id is None:
        draft.user_id = current_user.id
    if draft.hcp_name and not draft.hcp_id:
        hcp = find_or_create_hcp(db, draft.hcp_name)
        draft.hcp_id = hcp.id
        draft.hcp_name = hcp.name
    draft.status = "logged"
    draft.updated_at = datetime.datetime.utcnow()
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return draft


@router.get("/interactions", response_model=list[InteractionOut])
def list_interactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    query = db.query(Interaction)
    if current_user.role == "rep":
        query = query.filter(Interaction.user_id == current_user.id)
    interactions = query.order_by(Interaction.id.desc()).limit(50).all()
    payload = []
    for interaction in interactions:
        hcp = interaction.hcp
        payload.append({
            "id": interaction.id,
            "session_id": interaction.session_id,
            "hcp_name": interaction.hcp_name,
            "hcp_id": interaction.hcp_id,
            "hcp": None if not hcp else {"id": hcp.id, "name": hcp.name, "specialty": hcp.specialty, "institution": hcp.institution},
            "interaction_type": interaction.interaction_type,
            "date": interaction.date,
            "time": interaction.time,
            "attendees": interaction.attendees or [],
            "topics_discussed": interaction.topics_discussed,
            "materials_shared": interaction.materials_shared or [],
            "samples_distributed": interaction.samples_distributed or [],
            "sentiment": interaction.sentiment,
            "outcomes": interaction.outcomes,
            "follow_up_actions": interaction.follow_up_actions or [],
            "ai_suggested_follow_ups": interaction.ai_suggested_follow_ups or [],
            "status": interaction.status,
        })
    return payload


@router.get("/interactions/all", response_model=list[InteractionOut])
def list_all_interactions(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "manager":
        raise HTTPException(status_code=403, detail="Manager access required")
    query = db.query(Interaction)
    interactions = query.order_by(Interaction.id.desc()).limit(100).all()
    payload = []
    for interaction in interactions:
        hcp = interaction.hcp
        payload.append({
            "id": interaction.id,
            "session_id": interaction.session_id,
            "hcp_name": interaction.hcp_name,
            "hcp_id": interaction.hcp_id,
            "hcp": None if not hcp else {"id": hcp.id, "name": hcp.name, "specialty": hcp.specialty, "institution": hcp.institution},
            "interaction_type": interaction.interaction_type,
            "date": interaction.date,
            "time": interaction.time,
            "attendees": interaction.attendees or [],
            "topics_discussed": interaction.topics_discussed,
            "materials_shared": interaction.materials_shared or [],
            "samples_distributed": interaction.samples_distributed or [],
            "sentiment": interaction.sentiment,
            "outcomes": interaction.outcomes,
            "follow_up_actions": interaction.follow_up_actions or [],
            "ai_suggested_follow_ups": interaction.ai_suggested_follow_ups or [],
            "status": interaction.status,
        })
    return payload


@router.get("/materials/search")
def materials_search(q: str = "", item_type: str | None = None, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    results = search_materials(db, q, item_type)
    return [{"id": m.id, "name": m.name, "item_type": m.item_type} for m in results]
