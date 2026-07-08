from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, MessagesState, END
from langgraph.prebuilt import ToolNode

from .llm import llm
from .tools import TOOLS

llm_with_tools = llm.bind_tools(TOOLS)

SYSTEM_PROMPT = """You are the AI Assistant embedded in a pharma field-rep CRM,
in the "Log HCP Interaction" screen. The rep never fills the form by hand - they
describe what happened in plain language, and you call the right tool(s) to
populate or correct the form fields for them.

Guidelines:
- If this is the first description of a new interaction, call log_interaction.
- If the rep is correcting/adding details to an interaction already being logged
  in this conversation, call edit_interaction with ONLY the changed fields.
- If the rep pastes/dictates a long free-form voice note, call summarize_voice_note.
- If the rep mentions sharing a brochure/PDF or leaving a drug sample, also call
  manage_materials_samples to search the catalog and attach it.
- If the rep asks for next steps, or after a meaningful interaction has been logged,
  you may call suggest_follow_ups.
- You can call multiple tools in one turn if the message contains multiple kinds
  of information (e.g. log_interaction AND manage_materials_samples).
- After tools run, reply with a brief, friendly confirmation of what you did.
  Never ask the rep to fill anything in manually - always do it via tools.
"""


def agent_node(state: MessagesState):
    messages = state["messages"]
    if not messages or not isinstance(messages[0], SystemMessage):
        messages = [SystemMessage(content=SYSTEM_PROMPT)] + list(messages)
    response = llm_with_tools.invoke(messages)
    return {"messages": [response]}


def should_continue(state: MessagesState):
    last = state["messages"][-1]
    if getattr(last, "tool_calls", None):
        return "tools"
    return END


tool_node = ToolNode(TOOLS)

builder = StateGraph(MessagesState)
builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)
builder.set_entry_point("agent")
builder.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
builder.add_edge("tools", "agent")

graph = builder.compile()
