from typing import Optional

from sqlalchemy.orm import Session

from .models import Interaction, Material


def get_or_create_draft(db: Session, session_id: str) -> Interaction:
    """Fetch the current draft interaction for this chat session, or create one."""
    draft = (
        db.query(Interaction)
        .filter(Interaction.session_id == session_id, Interaction.status == "draft")
        .order_by(Interaction.id.desc())
        .first()
    )
    if draft is None:
        draft = Interaction(session_id=session_id, status="draft", attendees=[],
                             materials_shared=[], samples_distributed=[],
                             follow_up_actions=[], ai_suggested_follow_ups=[])
        db.add(draft)
        db.commit()
        db.refresh(draft)
    return draft


def apply_updates(db: Session, draft: Interaction, updates: dict) -> dict:
    """Apply a dict of non-null field updates to a draft, return only what changed."""
    applied = {}
    for key, value in updates.items():
        if value is None:
            continue
        if not hasattr(draft, key):
            continue
        setattr(draft, key, value)
        applied[key] = value
    db.add(draft)
    db.commit()
    db.refresh(draft)
    return applied


def search_materials(db: Session, query: str, item_type: Optional[str] = None):
    q = db.query(Material)
    if item_type:
        q = q.filter(Material.item_type == item_type)
    if query:
        q = q.filter(Material.name.ilike(f"%{query}%"))
    return q.all()


def draft_to_dict(draft: Interaction) -> dict:
    return {
        "hcp_name": draft.hcp_name,
        "interaction_type": draft.interaction_type,
        "date": draft.date,
        "time": draft.time,
        "attendees": draft.attendees or [],
        "topics_discussed": draft.topics_discussed,
        "materials_shared": draft.materials_shared or [],
        "samples_distributed": draft.samples_distributed or [],
        "sentiment": draft.sentiment,
        "outcomes": draft.outcomes,
        "follow_up_actions": draft.follow_up_actions or [],
        "ai_suggested_follow_ups": draft.ai_suggested_follow_ups or [],
    }
