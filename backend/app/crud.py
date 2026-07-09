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


# These fields represent cumulative lists (things added over the course of a
# conversation), so an update should ADD to what's already there rather than
# replace it wholesale. Without this, e.g. clicking one "AI Suggested Follow-up"
# would wipe out every other follow-up action already on the form, and a second
# "attendees" mention would erase the first attendee.
LIST_MERGE_FIELDS = {"attendees", "materials_shared", "samples_distributed", "follow_up_actions"}


def apply_updates(db: Session, draft: Interaction, updates: dict) -> dict:
    """Apply a dict of non-null field updates to a draft, return only what changed.
    List-type fields in LIST_MERGE_FIELDS are merged (existing + new, de-duplicated,
    order preserved) instead of overwritten."""
    applied = {}
    for key, value in updates.items():
        if value is None:
            continue
        if not hasattr(draft, key):
            continue
        if key in LIST_MERGE_FIELDS and isinstance(value, list):
            existing = list(getattr(draft, key) or [])
            merged = existing + [v for v in value if v not in existing]
            setattr(draft, key, merged)
            applied[key] = merged
        else:
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
