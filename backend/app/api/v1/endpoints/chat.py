import json

from fastapi import APIRouter, Depends
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from app.agent.context import session_id_ctx, user_id_ctx
from app.agent.graph import graph
from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/api", tags=["chat"])

_CONVERSATIONS: dict = {}
MAX_HISTORY = 20


@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    token = session_id_ctx.set(req.session_id)
    user_token = user_id_ctx.set(current_user.id)
    try:
        history = _CONVERSATIONS.get(req.session_id, [])
        history = history + [HumanMessage(content=req.message)]

        result = graph.invoke({"messages": history})
        messages = result["messages"]

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
        user_id_ctx.reset(user_token)


@router.post("/chat/reset")
def reset_chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    _CONVERSATIONS.pop(req.session_id, None)
    return {"ok": True}
