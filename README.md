# AI-First CRM — HCP Module: Log Interaction Screen

A field-rep can log an HCP (Healthcare Professional) interaction in two ways on the
same screen:

1. **Structured form** (left panel) — the classic CRM fields.
2. **Conversational AI Assistant** (right panel) — describe what happened in plain
   English (or paste/dictate a voice-note transcript), and a **LangGraph agent**
   running on **Groq (`gemma2-9b-it`)** extracts the details, calls the right tool(s),
   and **fills / edits the left-hand form for you**. The rep never has to click into
   the form fields by hand for the AI-driven flow — that's the whole point of the
   assignment.

```
┌─────────────────────────────┐   ┌───────────────────────────┐
│  Interaction Details (form) │   │   AI Assistant (chat)     │
│  HCP Name, Date, Time,      │◄──┤   "Met Dr. Smith, positive│
│  Topics, Materials,         │   │    sentiment, shared      │
│  Sentiment, Outcomes,       │   │    brochure"              │
│  Follow-ups ...             │   │                           │
└─────────────────────────────┘   └───────────────────────────┘
        Redux store  ◄──────────────  field_updates from agent
```

## Tech stack (per assignment spec)

| Layer        | Choice                                                        |
|--------------|----------------------------------------------------------------|
| Frontend     | React 18 + Redux Toolkit, Vite, Google **Inter** font          |
| Backend      | Python **FastAPI**                                              |
| Agent        | **LangGraph** (`StateGraph` + `ToolNode`)                        |
| LLM          | **Groq** — `gemma2-9b-it` for extraction/tool-routing, `llama-3.3-70b-versatile` for longer free-text generation (voice-note summarization, follow-up suggestions) |
| Database     | Postgres (SQLAlchemy models; MySQL works too by swapping the URL) |

## How the AI actually drives the form

1. The React chat panel POSTs `{ session_id, message }` to `POST /api/chat`.
2. The FastAPI route pushes the message into the conversation history and invokes
   the compiled **LangGraph** graph (`app/agent/graph.py`):
   - `agent` node — Groq LLM with all 5 tools bound (`llm.bind_tools(TOOLS)`) decides
     which tool(s) to call, with what arguments, based on the system prompt + message.
   - `tools` node — a LangGraph `ToolNode` executes the chosen tool(s) against the
     Postgres draft record for that `session_id`.
   - The graph loops `agent → tools → agent` until the LLM responds with no more
     tool calls, then ends.
3. Each tool returns a small JSON payload `{ message, field_updates }`. The FastAPI
   route merges every tool's `field_updates` and returns them alongside the
   assistant's natural-language reply.
4. The frontend dispatches `mergeFields(field_updates)` into the `interaction` Redux
   slice — **this is the only code path that changes form values in the AI-driven
   flow.** The manual `<input>`/`<textarea>` `onChange` handlers exist only to satisfy
   the "structured form" fallback the spec asks for; they are not used by the agent.

## The 5 LangGraph tools

The LangGraph agent's job is to sit between unstructured rep speech and the
structured CRM schema: on every message it must decide *which* CRM operation the
rep means, extract the right slots, and leave everything else on the form alone.
That's implemented as 5 tools (`app/agent/tools.py`):

1. **`log_interaction`** — First-time extraction. Given a free-text description
   ("Today I met with Dr. Smith and discussed Product X efficiency. The sentiment
   was positive, and I shared the brochures."), the LLM extracts `hcp_name`,
   `interaction_type`, `date`, `sentiment`, `materials_shared`, etc., and the tool
   writes them onto a new draft `Interaction` row keyed by `session_id`.
2. **`edit_interaction`** — Same schema as above, but used for corrections
   ("Sorry, the name was actually Dr. John, and the sentiment was negative").
   Only the fields the LLM actually extracts are non-null, so `apply_updates()`
   patches *just those* columns and leaves the rest of the draft untouched.
3. **`summarize_voice_note`** — Mirrors the "Summarize from Voice Note" button.
   Takes a longer dictated transcript, asks the larger Groq model
   (`llama-3.3-70b-versatile`) to condense it into `topics_discussed` +
   `outcomes`, and writes those back.
4. **`manage_materials_samples`** — Mirrors the "Search/Add" and "Add Sample"
   controls. Searches a seeded catalog of marketing materials & drug samples and
   adds/removes matches from `materials_shared` / `samples_distributed`.
5. **`suggest_follow_ups`** — Mirrors the "AI Suggested Follow-ups" list. Looks at
   everything logged so far (topics, sentiment, outcomes) and asks the LLM to
   propose 2–4 concrete next steps, which appear as clickable suggestions the rep
   can promote into `follow_up_actions` with one click.

All 5 tools are declared with Pydantic `args_schema`s and bound to the Groq model
via `llm.bind_tools(...)`, then executed through LangGraph's `ToolNode` — nothing
is hard-coded string matching; the LLM decides which tool(s) to call and with what
arguments on every turn.

## Project structure

```
hcp-crm/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, CORS, startup DB init
│   │   ├── config.py          # env-based settings (Groq key/model, DB url)
│   │   ├── database.py        # SQLAlchemy engine/session + seed data
│   │   ├── models.py          # Interaction, Material tables
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── crud.py            # draft get/create/update helpers
│   │   ├── agent/
│   │   │   ├── llm.py         # ChatGroq instances
│   │   │   ├── tools.py       # the 5 LangGraph tools
│   │   │   ├── graph.py       # StateGraph wiring (agent <-> tools loop)
│   │   │   └── context.py     # contextvars: session_id, field_updates
│   │   └── routers/
│   │       ├── chat.py        # POST /api/chat  (drives the agent)
│   │       └── interactions.py# GET/POST draft, finalize, materials search
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LogInteractionPage.jsx   # split layout + Save button
│   │   │   ├── InteractionForm.jsx      # left panel (replica of screenshot)
│   │   │   └── AIAssistantPanel.jsx     # right panel, calls /api/chat
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   ├── interactionSlice.js      # mergeFields() = AI writes here
│   │   │   └── chatSlice.js
│   │   └── api/client.js
│   └── package.json
└── docker-compose.yml         # local Postgres
```

## Running it locally

### 1. Database
```bash
docker compose up -d          # starts Postgres on localhost:5432
```
(Or point `DATABASE_URL` at any existing MySQL/Postgres instance.)

### 2. Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env and paste your Groq API key from https://console.groq.com/keys
uvicorn app.main:app --reload --port 8000
```
Tables and seed catalog data (materials/samples) are created automatically on
startup. Docs at `http://localhost:8000/docs`.

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

## Trying the two required flows

**Log Interaction:**
> "Today I met with Dr. Smith and discussed Product X efficacy. The sentiment was
> positive, and I shared the brochures."

→ the agent calls `log_interaction` (+ `manage_materials_samples` for the
brochure), and HCP Name, Date, Sentiment, and Materials Shared populate on the
left instantly.

**Edit Interaction:**
> "Sorry, the name was actually Dr. John, and the sentiment was negative."

→ the agent calls `edit_interaction` with only `hcp_name` and `sentiment` set;
every other field on the form is left exactly as it was.

**Other 3 tools:**
- Paste a longer note and say "summarize this voice note: ..." → `summarize_voice_note`.
- "Add the CardioPlus sample pack I gave him" → `manage_materials_samples`.
- "What should I follow up on?" → `suggest_follow_ups`.

## Notes / assumptions

- Conversation history and the in-progress draft are keyed by a `session_id`
  generated client-side and stored in `sessionStorage`, so refreshing the tab keeps
  the same in-progress log.
- Conversation history is kept in-memory per backend process for this demo
  (`_CONVERSATIONS` dict in `routers/chat.py`); swap for Redis/DB for production.
- "Save Interaction" (top-right button) marks the draft `status = "logged"` via
  `POST /api/interactions/finalize` — a plain REST action, not a LangGraph tool,
  since finalizing isn't itself a natural-language operation the rep describes.
#   h c p - c r m  
 