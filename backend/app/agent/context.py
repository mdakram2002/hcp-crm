import contextvars

# Holds the current chat session id for the duration of a single /chat request,
# so tool functions (invoked by the LLM, which never sees session_id) can look up
# and mutate the correct Interaction draft row.
session_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar(
    "session_id_ctx", default="default"
)

# Accumulates {field: value} updates produced by tool calls during one graph run,
# so the FastAPI route can send them back to the frontend to patch the Redux form.
field_updates_ctx: contextvars.ContextVar[dict] = contextvars.ContextVar(
    "field_updates_ctx", default={}
)

# Holds the current authenticated user id for the duration of a single request.
user_id_ctx: contextvars.ContextVar[int | None] = contextvars.ContextVar(
    "user_id_ctx", default=None
)
