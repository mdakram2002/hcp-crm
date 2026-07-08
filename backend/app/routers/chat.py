import json

from fastapi import APIRouter
from langchain_core.messages import HumanMessage, ToolMessage, AIMessage

from ..schemas import ChatRequest, ChatResponse
from ..agent.graph import graph
from ..agent.context import session_id_ctx

router = APIRouter(prefix="/api", tags=["chat"])

# In-memory per-session chat history for this demo.
# (Swap for a DB-backed store / Redis for production.)
_CONVERSATIONS: dict = {}
MAX_HISTORY = 20


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    token = session_id_ctx.set(req.session_id)
    try:
        history = _CONVERSATIONS.get(req.session_id, [])
        history = history + [HumanMessage(content=req.message)]

        result = graph.invoke({"messages": history})
        messages = result["messages"]

        # Trim stored history so the context window doesn't grow unbounded.
        _CONVERSATIONS[req.session_id] = messages[-MAX_HISTORY:]

        field_updates: dict = {}
        tool_names: list = []
        for m in messages:
            if isinstance(m, ToolMessage):
                tool_names.append(m.name)
                try:
                    data = json.loads(m.content)
                    field_updates.update(data.get("field_updates", {}))
                except Exception:
                    pass

        final_reply = ""
        for m in reversed(messages):
            if isinstance(m, AIMessage) and m.content:
                final_reply = m.content
                break

        return ChatResponse(reply=final_reply or "Done.", field_updates=field_updates, tool_calls=tool_names)
    finally:
        session_id_ctx.reset(token)


@router.post("/chat/reset")
def reset_chat(req: ChatRequest):
    _CONVERSATIONS.pop(req.session_id, None)
    return {"ok": True}
