"""
LangGraph tools for the HCP Interaction agent.

Each tool:
  1. Reads the active session_id from a contextvar (set by the /chat route).
  2. Opens its own short-lived DB session.
  3. Reads/writes the current Interaction draft row.
  4. Returns a JSON string { "message": <str shown to rep>, "field_updates": {...} }
     so the FastAPI route can forward field_updates to the React/Redux form.
"""
import json
from typing import List, Optional

from langchain_core.tools import tool
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.core.database import SessionLocal
from app.crud import hcp as hcp_crud
from app.crud import interaction as interaction_crud
from app.models.interaction import Interaction
from .context import session_id_ctx, user_id_ctx
from .llm import llm_large
from .embeddings import embed_text


def _db():
    return SessionLocal()


def _result(message: str, field_updates: dict) -> str:
    return json.dumps({"message": message, "field_updates": field_updates})


# ---------------------------------------------------------------------------
# Tool 1: log_interaction
# ---------------------------------------------------------------------------
class LogInteractionArgs(BaseModel):
    hcp_name: Optional[str] = Field(None, description="Name of the healthcare professional, e.g. 'Dr. Smith'")
    interaction_type: Optional[str] = Field(
        None, description="One of: Meeting, Call, Email, Conference"
    )
    date: Optional[str] = Field(None, description="Date of interaction in YYYY-MM-DD. Resolve relative terms like 'today' to a real date using the date already given in the conversation context if present.")
    time: Optional[str] = Field(None, description="Time of interaction in HH:MM 24h format")
    attendees: Optional[List[str]] = Field(None, description="Names of other people who attended")
    topics_discussed: Optional[str] = Field(None, description="Key discussion points, as a short paragraph")
    materials_shared: Optional[List[str]] = Field(None, description="Marketing materials/brochures mentioned as shared")
    samples_distributed: Optional[List[str]] = Field(None, description="Drug samples mentioned as distributed")
    sentiment: Optional[str] = Field(None, description="One of: Positive, Neutral, Negative")
    outcomes: Optional[str] = Field(None, description="Key outcomes or agreements reached")
    follow_up_actions: Optional[List[str]] = Field(None, description="Next steps / tasks explicitly mentioned")


@tool("log_interaction", args_schema=LogInteractionArgs)
def log_interaction(
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[List[str]] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[List[str]] = None,
    samples_distributed: Optional[List[str]] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[List[str]] = None,
) -> str:
    """Create/populate a NEW HCP interaction log from a natural-language description.
    Use this the FIRST time the rep describes an interaction in a message
    (e.g. 'Met with Dr. Smith, discussed Product X, positive sentiment, shared brochure').
    Extract every field you can confidently infer and leave the rest empty.
    This fills the left-hand form; do not ask the user to fill it manually."""
    session_id = session_id_ctx.get()
    db = _db()
    try:
        draft = interaction_crud.get_or_create_draft(db, session_id, user_id=user_id_ctx.get())
        updates = {
            "hcp_name": hcp_name,
            "interaction_type": interaction_type,
            "date": date,
            "time": time,
            "attendees": attendees,
            "topics_discussed": topics_discussed,
            "materials_shared": materials_shared,
            "samples_distributed": samples_distributed,
            "sentiment": sentiment,
            "outcomes": outcomes,
            "follow_up_actions": follow_up_actions,
        }
        applied = interaction_crud.apply_updates(db, draft, updates)
        msg = f"Logged interaction. Filled fields: {', '.join(applied.keys()) or 'none detected'}."
        return _result(msg, applied)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 2: edit_interaction
# ---------------------------------------------------------------------------
class EditInteractionArgs(LogInteractionArgs):
    pass


@tool("edit_interaction", args_schema=EditInteractionArgs)
def edit_interaction(
    hcp_name: Optional[str] = None,
    interaction_type: Optional[str] = None,
    date: Optional[str] = None,
    time: Optional[str] = None,
    attendees: Optional[List[str]] = None,
    topics_discussed: Optional[str] = None,
    materials_shared: Optional[List[str]] = None,
    samples_distributed: Optional[List[str]] = None,
    sentiment: Optional[str] = None,
    outcomes: Optional[str] = None,
    follow_up_actions: Optional[List[str]] = None,
) -> str:
    """Correct/update ONE OR MORE specific fields of the interaction ALREADY being
    logged in this conversation (e.g. 'Sorry, the name was actually Dr. John, and
    the sentiment was negative'). Only pass the fields that changed - every field
    you leave as None is left untouched on the existing form."""
    session_id = session_id_ctx.get()
    db = _db()
    try:
        draft = interaction_crud.get_or_create_draft(db, session_id, user_id=user_id_ctx.get())
        updates = {
            "hcp_name": hcp_name,
            "interaction_type": interaction_type,
            "date": date,
            "time": time,
            "attendees": attendees,
            "topics_discussed": topics_discussed,
            "materials_shared": materials_shared,
            "samples_distributed": samples_distributed,
            "sentiment": sentiment,
            "outcomes": outcomes,
            "follow_up_actions": follow_up_actions,
        }
        applied = interaction_crud.apply_updates(db, draft, updates)
        msg = f"Updated: {', '.join(applied.keys()) or 'nothing changed'}."
        return _result(msg, applied)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 3: summarize_voice_note
# ---------------------------------------------------------------------------
class SummarizeVoiceNoteArgs(BaseModel):
    transcript: str = Field(..., description="Raw transcript/voice note text dictated by the rep")


@tool("summarize_voice_note", args_schema=SummarizeVoiceNoteArgs)
def summarize_voice_note(transcript: str) -> str:
    """Summarize a raw dictated voice-note transcript into concise 'Topics Discussed'
    bullet points and, if present, an 'Outcomes' summary, then fill those fields on
    the form. Use this when the rep pastes/dictates a longer free-form note rather
    than a short structured sentence (mirrors the 'Summarize from Voice Note' button)."""
    session_id = session_id_ctx.get()
    prompt = (
        "You summarize a pharma sales rep's dictated voice note into a CRM log.\n"
        "Return STRICT JSON only, no markdown, with keys 'topics_discussed' "
        "(a short bullet-style paragraph of key discussion points) and 'outcomes' "
        "(key outcomes/agreements, or empty string if none).\n\n"
        f"Voice note transcript:\n{transcript}"
    )
    resp = llm_large.invoke(prompt)
    content = resp.content.strip()
    if content.startswith("```"):
        content = content.strip("`")
        content = content.split("\n", 1)[-1] if "\n" in content else content
    try:
        parsed = json.loads(content)
    except Exception:
        parsed = {"topics_discussed": content, "outcomes": None}

    db = _db()
    try:
        draft = interaction_crud.get_or_create_draft(db, session_id, user_id=user_id_ctx.get())
        updates = {
            "topics_discussed": parsed.get("topics_discussed"),
            "outcomes": parsed.get("outcomes") or None,
        }
        applied = interaction_crud.apply_updates(db, draft, updates)
        return _result("Summarized voice note into Topics Discussed / Outcomes.", applied)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 4: manage_materials_samples
# ---------------------------------------------------------------------------
class ManageMaterialsArgs(BaseModel):
    action: str = Field(..., description="'add' or 'remove'")
    item_type: str = Field(..., description="'material' or 'sample'")
    query: str = Field(..., description="Name or partial name of the material/sample to search and add/remove")


@tool("manage_materials_samples", args_schema=ManageMaterialsArgs)
def manage_materials_samples(action: str, item_type: str, query: str) -> str:
    """Search the materials/samples catalog and add or remove an item from
    'Materials Shared' or 'Samples Distributed' on the current interaction
    (mirrors the 'Search/Add' and 'Add Sample' buttons). item_type must be
    'material' or 'sample'."""
    session_id = session_id_ctx.get()
    db = _db()
    try:
        matches = interaction_crud.search_materials(db, query, item_type)
        draft = interaction_crud.get_or_create_draft(db, session_id, user_id=user_id_ctx.get())
        field = "materials_shared" if item_type == "material" else "samples_distributed"
        current: List[str] = list(getattr(draft, field) or [])

        if not matches:
            return _result(f"No catalog item found matching '{query}'.", {})

        name = matches[0].name
        if action == "add":
            if name not in current:
                current.append(name)
        elif action == "remove":
            current = [c for c in current if c != name]

        applied = interaction_crud.apply_updates(db, draft, {field: current})
        verb = "Added" if action == "add" else "Removed"
        return _result(f"{verb} '{name}' to/from {field.replace('_', ' ')}.", applied)
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 5: search_hcp
# ---------------------------------------------------------------------------
class SearchHcpArgs(BaseModel):
    query: str = Field(..., description="Partial name of the HCP to look up")


@tool("search_hcp", args_schema=SearchHcpArgs)
def search_hcp(query: str) -> str:
    """Look up existing HCPs by partial name match and report the matches back to the rep."""
    db = _db()
    try:
        matches = hcp_crud.search_hcps(db, query)
        if not matches:
            return _result(f"No HCP found matching '{query}'.", {})
        names = ", ".join(match.name for match in matches[:5])
        return _result(f"Found HCP matches: {names}", {})
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 6: search_past_interactions
# ---------------------------------------------------------------------------
class SearchPastInteractionsArgs(BaseModel):
    hcp_name: Optional[str] = Field(None, description="Optional HCP name to limit the search")
    query: str = Field(..., description="Natural-language question about a past interaction")


@tool("search_past_interactions", args_schema=SearchPastInteractionsArgs)
def search_past_interactions(hcp_name: Optional[str] = None, query: str = "") -> str:
    """Search earlier interaction notes using semantic similarity and return the top matches as grounded context."""
    db = _db()
    try:
        embedding = embed_text(query)
        if not embedding:
            return _result("No relevant past interaction notes found.", {})

        base_query = db.query(Interaction)
        if hcp_name:
            base_query = base_query.filter(Interaction.hcp_name.ilike(f"%{hcp_name}%"))
        matches = (
            base_query.filter(Interaction.embedding.is_not(None))
            .order_by(text("embedding <=> :embedding"))
            .params(embedding=embedding)
            .limit(3)
            .all()
        )

        if not matches:
            return _result("No relevant past interaction notes found.", {})

        context = [
            {
                "date": match.date,
                "hcp_name": match.hcp_name,
                "topics_discussed": match.topics_discussed,
                "outcomes": match.outcomes,
            }
            for match in matches
        ]
        return _result("Relevant past interaction notes: " + json.dumps(context), {})
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 7: territory_summary
# ---------------------------------------------------------------------------
class TerritorySummaryArgs(BaseModel):
    question: str = Field(..., description="Question about the team or territory performance")


@tool("territory_summary", args_schema=TerritorySummaryArgs)
def territory_summary(question: str) -> str:
    """Answer questions about team / territory performance using the aggregated dashboard data."""
    db = _db()
    try:
        summary = interaction_crud.get_dashboard_summary(db)
        prompt = (
            "You are a pharma sales manager assistant. Answer the user's question in a brief, natural-language update "
            "based on the team summary below. Keep it concise and actionable.\n\n"
            f"Question: {question}\n"
            f"Summary: {json.dumps(summary)}"
        )
        resp = llm_large.invoke(prompt)
        content = resp.content.strip()
        return _result(content, {})
    finally:
        db.close()


# ---------------------------------------------------------------------------
# Tool 8: suggest_follow_ups
# ---------------------------------------------------------------------------
class SuggestFollowUpsArgs(BaseModel):
    hint: Optional[str] = Field(
        None, description="Optional extra context from the rep about what kind of follow-up they want"
    )


@tool("suggest_follow_ups", args_schema=SuggestFollowUpsArgs)
def suggest_follow_ups(hint: Optional[str] = None) -> str:
    """Generate 2-4 AI-suggested follow-up actions (e.g. 'Schedule follow-up meeting
    in 2 weeks', 'Send OncoBoost Phase III PDF') based on the interaction logged so
    far, and populate the 'AI Suggested Follow-ups' list on the form. Call this
    after the interaction has some topics/sentiment/outcomes filled in, or whenever
    the rep asks for follow-up suggestions."""
    session_id = session_id_ctx.get()
    db = _db()
    try:
        draft = interaction_crud.get_or_create_draft(db, session_id)
        context = interaction_crud.draft_to_dict(draft)
        prompt = (
            "You are a pharma CRM co-pilot. Based on this logged HCP interaction, "
            "suggest 2 to 4 short, concrete follow-up actions for the sales rep "
            "(e.g. scheduling, sending specific materials, adding the HCP to lists). "
            "Return STRICT JSON: a list of strings, no markdown, no extra keys.\n\n"
            f"Interaction so far: {json.dumps(context)}\n"
            f"Extra hint from rep: {hint or 'none'}"
        )
        resp = llm_large.invoke(prompt)
        content = resp.content.strip()
        if content.startswith("```"):
            content = content.strip("`")
            content = content.split("\n", 1)[-1] if "\n" in content else content
        try:
            suggestions = json.loads(content)
            if not isinstance(suggestions, list):
                raise ValueError
        except Exception:
            suggestions = [line.strip("- ").strip() for line in content.split("\n") if line.strip()][:4]

        applied = interaction_crud.apply_updates(db, draft, {"ai_suggested_follow_ups": suggestions})
        return _result("Generated AI suggested follow-ups.", applied)
    finally:
        db.close()


TOOLS = [
    log_interaction,
    edit_interaction,
    summarize_voice_note,
    manage_materials_samples,
    search_hcp,
    search_past_interactions,
    territory_summary,
    suggest_follow_ups,
]
