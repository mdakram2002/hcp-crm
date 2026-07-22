import datetime
from collections import Counter
from typing import Optional

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models.models import HCP, Interaction, Material, User


def _normalize_name(name: str) -> str:
    return " ".join((name or "").split()).strip().casefold()


def get_or_create_draft(db: Session, session_id: str, user_id: Optional[int] = None) -> Interaction:
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
        if user_id is not None:
            draft.user_id = user_id
        db.add(draft)
        db.commit()
        db.refresh(draft)
    elif user_id is not None and draft.user_id is None:
        draft.user_id = user_id
        db.add(draft)
        db.commit()
        db.refresh(draft)
    return draft


def find_or_create_hcp(db: Session, name: str) -> Optional[HCP]:
    """Find a matching HCP by case-insensitive name, or create one if absent."""
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

    if "topics_discussed" in updates or "outcomes" in updates:
        text_to_embed = " ".join(
            part for part in [getattr(draft, "topics_discussed", None), getattr(draft, "outcomes", None)] if part
        ).strip()
        if text_to_embed:
            from ..agent.embeddings import embed_text

            try:
                draft.embedding = embed_text(text_to_embed)
            except Exception:
                draft.embedding = None

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
        "hcp_id": draft.hcp_id,
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


def _parse_date(value: Optional[str]) -> Optional[datetime.date]:
    if not value:
        return None
    try:
        return datetime.datetime.fromisoformat(value).date()
    except ValueError:
        return None


def get_dashboard_summary(db: Session) -> dict:
    now = datetime.datetime.utcnow().date()
    week_start = now - datetime.timedelta(days=7)
    month_start = now.replace(day=1)

    interactions = db.query(Interaction).filter(Interaction.status == "logged").all()
    week_interactions = [i for i in interactions if _parse_date(i.date) and _parse_date(i.date) >= week_start]
    month_interactions = [i for i in interactions if _parse_date(i.date) and _parse_date(i.date) >= month_start]

    sentiment_breakdown = Counter(i.sentiment or "Neutral" for i in interactions)
    materials_counter = Counter()
    samples_counter = Counter()
    for interaction in interactions:
        for item in interaction.materials_shared or []:
            materials_counter[item] += 1
        for item in interaction.samples_distributed or []:
            samples_counter[item] += 1

    material_items = [
        {"name": name, "count": count, "item_type": "material"}
        for name, count in materials_counter.most_common(5)
    ]
    sample_items = [
        {"name": name, "count": count, "item_type": "sample"}
        for name, count in samples_counter.most_common(5)
    ]
    top_items = sorted(material_items + sample_items, key=lambda item: item["count"], reverse=True)[:5]

    reps = db.query(User).filter(User.role == "rep").all()
    needs_attention = []
    for rep in reps:
        recent = [
            i for i in interactions
            if i.user_id == rep.id and _parse_date(i.date) and _parse_date(i.date) >= week_start
        ]
        if not recent:
            needs_attention.append({
                "email": rep.email,
                "role": rep.role,
                "last_interaction_date": None,
            })

    return {
        "total_interactions_this_week": len(week_interactions),
        "total_interactions_this_month": len(month_interactions),
        "sentiment_breakdown": {
            "Positive": sentiment_breakdown.get("Positive", 0),
            "Neutral": sentiment_breakdown.get("Neutral", 0),
            "Negative": sentiment_breakdown.get("Negative", 0),
        },
        "top_materials": top_items,
        "needs_attention": needs_attention,
    }
