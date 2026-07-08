# AI-First CRM — HCP Module: Log Interaction Screen

This project implements an AI-first CRM system for Healthcare Professional (HCP) interaction logging, as required for the Round 1 Interview Assignment.

## Overview

Field representatives can log HCP interactions in two ways on the same screen:

1. **Structured Form** (left panel) - Fill in HCP details, topics, materials, sentiment, and follow-ups.
2. **AI Assistant Chat** (right panel) - Describe the interaction in plain English, and the AI extracts and fills the form automatically.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18, Redux Toolkit, Vite, Google Inter Font |
| Backend | Python FastAPI |
| AI Agent | LangGraph |
| LLM | Groq (llama-3.3-70b-versatile) |
| Database | PostgreSQL |

## Key Features

- **Dual Input Methods**: Use either the structured form or chat interface
- **AI-Powered Form Filling**: Describe interactions naturally, AI extracts and fills fields
- **Edit Capability**: Correct any field by simply telling the AI
- **5 LangGraph Tools**: Log Interaction, Edit Interaction, Summarize Voice Note, Manage Materials/Samples, Suggest Follow-ups

## How It Works

1. User types a message in the chat panel
2. Message is sent to FastAPI backend
3. LangGraph agent processes the message using Groq LLM
4. Agent calls appropriate tool(s) based on the intent
5. Tool extracts information and updates the form
6. Form updates automatically without manual input

## The 5 LangGraph Tools

| Tool | Purpose |
|------|---------|
| **Log Interaction** | Extract HCP details from natural language and create a new interaction record |
| **Edit Interaction** | Modify only the fields mentioned in the correction |
| **Summarize Voice Note** | Condense voice transcripts into topics and outcomes |
| **Manage Materials/Samples** | Search and add/remove materials and samples from the catalog |
| **Suggest Follow-ups** | Generate AI-powered follow-up recommendations |

## Installation & Setup

### Prerequisites

- Python 3.10+
- Node.js 18+
- Docker (for PostgreSQL)
- Groq API Key (get from console.groq.com)

### Step 1: Clone and Setup Database

```bash
cd hcp-crm
docker compose up -d
```

### Step 2: Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` and add your Groq API key:

```text
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/hcp_crm
GROQ_MODEL=llama-3.3-70b-versatile
FRONTEND_ORIGIN=http://localhost:5173
```

Start the backend:

```bash
uvicorn app.main:app --reload --port 8000
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Access the Application

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Testing the AI Assistant

Try these example prompts:

**Log Interaction:**
```text
Today I met with Dr. Smith and discussed Product X efficacy. The sentiment was positive, and I shared the OncoBoost brochure.
```

**Edit Interaction:**
```text
Sorry, the name was actually Dr. John, and the sentiment was negative.
```

**Summarize Voice Note:**
```text
Summarize this: "Called Dr. Patel. Good patient outcomes. Requested more materials. Follow up next month."
```

**Manage Materials:**
```text
Add OncoBoost and ImmunoPlus to the materials list.
```

**Suggest Follow-ups:**
```text
Suggest follow-ups for Dr. Smith.
```

## Project Structure

```text
hcp-crm/
├── backend/
│   ├── app/
│   │   ├── agent/
│   │   │   ├── graph.py      # LangGraph workflow
│   │   │   ├── llm.py        # Groq configuration
│   │   │   └── tools.py      # 5 LangGraph tools
│   │   ├── routers/
│   │   │   ├── chat.py       # Chat endpoint
│   │   │   └── interactions.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── store/             # Redux state management
│   │   └── api/
│   └── package.json
└── docker-compose.yml
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message to AI assistant |
| `/api/chat/reset` | POST | Reset conversation |
| `/api/interactions/draft` | GET | Get current draft |
| `/api/interactions/finalize` | POST | Save the interaction |

## Demo Video Requirements

For the video submission (10-15 minutes), demonstrate:

- Frontend walkthrough showing the split-screen layout
- All 5 LangGraph tools working:
  - Log Interaction
  - Edit Interaction
  - Summarize Voice Note
  - Manage Materials/Samples
  - Suggest Follow-ups
- Code explanation and project structure overview
- Summary of understanding the task

## Submission Checklist

- [ ] GitHub repository with frontend and backend code
- [ ] README.md explaining project and setup
- [ ] Video recording (10-15 minutes)
- [ ] All 5 LangGraph tools implemented
- [ ] Both form and chat interfaces working

## Notes

- The `gemma2-9b-it` model has been decommissioned by Groq; this project uses `llama-3.3-70b-versatile` instead
- Conversation history is stored in-memory for the demo (replace with Redis/DB for production)
- "Save Interaction" button saves the draft via REST API (not a LangGraph tool)

## License

This project was created for the Round 1 Interview Assignment.
