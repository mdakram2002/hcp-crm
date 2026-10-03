# HCP CRM

An AI-assisted customer relationship management application for logging and reviewing Healthcare Professional (HCP) interactions. Sales representatives can record an interaction in a structured form or describe it in natural language to an AI assistant. Managers receive a role-protected dashboard of team activity.

## Features

- Secure JWT authentication with **rep**, **manager**, and guest access.
- Interaction logging with HCP, date/time, attendees, discussion topics, materials, samples, sentiment, outcomes, and follow-up actions.
- AI chat assistant powered by LangGraph and Groq to populate and amend the current interaction draft.
- AI voice-note summarization and suggested follow-up actions.
- HCP search/autocomplete, profile pages, interaction history, and sentiment-trend charts.
- Manager dashboard with weekly/monthly activity, sentiment breakdown, material/sample usage, and inactive reps.
- Semantic search of prior interaction notes using OpenAI embeddings and PostgreSQL `pgvector`.

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 18, Vite, Redux Toolkit, React Router, Axios, Recharts |
| API | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL 16 with `pgvector` |
| AI | LangGraph, LangChain, Groq (`llama-3.3-70b-versatile`) |
| Semantic search | OpenAI `text-embedding-3-small` |
| Authentication | JWT, bcrypt/passlib |

## Application flow

1. Register as a representative or manager, sign in, or use the guest-login option.
2. On the log screen, enter interaction information directly or ask the AI assistant to extract it from a plain-language message.
3. The agent updates the server-side draft and returns field updates for the Redux form state.
4. Finalize the draft through the interaction API to persist it as a logged interaction. If the HCP does not exist, the API creates an HCP record.
5. Logged interactions appear in the history table. Selecting an HCP opens their profile and sentiment trend.
6. Managers can open the dashboard to review aggregate activity and attention items.

## AI tools

The LangGraph agent has eight tools:

| Tool | Purpose |
| --- | --- |
| `log_interaction` | Creates or populates an interaction draft from a natural-language description. |
| `edit_interaction` | Updates only the fields named in a correction. |
| `summarize_voice_note` | Converts a dictated transcript into topics and outcomes. |
| `manage_materials_samples` | Searches the catalog and adds or removes a material or sample. |
| `search_hcp` | Looks up existing HCPs by partial name. |
| `search_past_interactions` | Finds semantically similar prior notes. |
| `territory_summary` | Answers questions using aggregate territory/dashboard data. |
| `suggest_follow_ups` | Produces 2–4 suggested next actions for the current draft. |

## Prerequisites

- Node.js 18 or later
- Python 3.10 or later
- Docker and Docker Compose
- A [Groq API key](https://console.groq.com/)
- An OpenAI API key if you want embeddings and semantic search enabled

## Run locally

### 1. Configure the environment

Copy `backend/.env.example` to `backend/.env` and replace the placeholder database password and application secrets. The database password in `DATABASE_URL` must match `POSTGRES_PASSWORD`; URL-encode it in `DATABASE_URL` if it contains URL-reserved characters.

For running the API directly on your computer, change the database host in `DATABASE_URL` from `db:5432` to `localhost:5433`. Docker Compose uses the `db:5432` address shown in the example.

### 2. Start PostgreSQL

From the repository root:

```bash
docker compose up -d db
```

The included Compose configuration uses PostgreSQL 16 with `pgvector`, persists its data in a Docker volume, and binds its local development port only to `127.0.0.1:5433`.

### 3. Configure and run the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

The application settings in `backend/.env` include:

```dotenv
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5433/hcp_crm
FRONTEND_ORIGIN=http://localhost:5173
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET_KEY=replace-with-a-long-random-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
```

`OPENAI_API_KEY` is needed for embedding interaction notes and semantic retrieval. The application can still start without it, but those operations will not be available.

Start the API:

```bash
uvicorn app.main:app --reload --port 8000
```

The health check is available at `http://localhost:8000/api/health`.

### 4. Configure and run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

To point the frontend at another API address, create `frontend/.env`:

```dotenv
VITE_API_BASE=http://localhost:8000
```

## Roles and access

| Role | Access |
| --- | --- |
| Guest | Can use the CRM through a newly created guest account. |
| Rep | Can create and view their own interactions. |
| Manager | Can access the team dashboard and all interactions endpoint. |

## API routes

All routes below require a bearer token except registration, login, guest login, and health.

| Route | Method | Description |
| --- | --- | --- |
| `/api/health` | GET | API health check. |
| `/api/auth/register` | POST | Register a rep or manager account. |
| `/api/auth/login` | POST | Sign in and receive an access token. |
| `/api/auth/guest-login` | POST | Create and sign in with a guest account. |
| `/api/auth/me` | GET | Fetch the current user. |
| `/api/chat` | POST | Send a message to the AI assistant. |
| `/api/chat/reset` | POST | Clear the in-memory chat history for a session. |
| `/api/interactions/draft` | GET | Fetch or create a draft by `session_id`. |
| `/api/interactions/finalize` | POST | Finalize an interaction draft. |
| `/api/interactions` | GET | List the current rep's interactions. |
| `/api/interactions/all` | GET | List all interactions (manager only). |
| `/api/materials/search` | GET | Search catalog materials or samples. |
| `/api/hcps/search` | GET | Search HCPs. |
| `/api/hcps/{hcp_id}` | GET | Get an HCP profile and history. |
| `/api/hcps/{hcp_id}/sentiment-trend` | GET | Get HCP sentiment data for the chart. |
| `/api/dashboard/summary` | GET | Get manager dashboard data. |

## Project structure

```text
hcp-crm/
├── backend/
│   ├── app/
│   │   ├── agent/          # LangGraph graph, tools, LLM, embeddings
│   │   ├── api/            # API router, dependencies, v1 endpoints
│   │   ├── core/           # Configuration, database, security
│   │   ├── crud/           # Database operations
│   │   ├── models/         # SQLAlchemy entities
│   │   ├── schemas/        # Request and response schemas
│   │   └── main.py
│   ├── tests/
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios client
│   │   ├── components/     # Auth, logging, dashboard, and HCP pages
│   │   └── store/          # Redux slices
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Development checks

Run the backend tests from `backend`:

```bash
pytest
```

Create a production frontend build from `frontend`:

```bash
npm run build
```

## Current implementation notes

- Chat history is held in the API process memory and is limited to the 20 most recent messages per session; it is not production-persistent.
- Database tables are initialized at application startup.
- The current frontend does not yet call the draft-finalization endpoint, so finalization must be invoked through the API until that UI control is added.
- The visible “Summarize from Voice Note,” “Search/Add,” and “Add Sample” form buttons are presentational in the current frontend. The corresponding capabilities are exposed through the AI agent tools.

## License

This repository was created as an interview assignment.

## Deployment: AWS EC2

The backend and database run together on one Linux EC2 instance:

```text
GitHub (push to main)
  -> GitHub Actions (build image, SSH deploy, health check)
  -> AWS EC2 (Linux)
      -> Docker Compose
          -> FastAPI backend + LangGraph (port 8000)
          -> PostgreSQL 16 + pgvector (private Compose network)
              -> persistent Docker volume
  FastAPI -> Groq / OpenAI APIs
Frontend -> remains deployed through Vercel
```

PostgreSQL has no public port. Compose binds its optional host port to `127.0.0.1:5433`, and the database is reachable by the backend on the private Compose network. Do not add inbound EC2 security-group rules for ports `5432` or `5433`.

### First-time EC2 setup

These commands assume an Ubuntu 22.04/24.04 EC2 instance. Configure its security group to allow SSH (port 22) from your administration IP and the GitHub-hosted runner IP ranges used by Actions; those ranges can change, so keep the rule current. Alternatively, use a self-hosted runner. Allow the backend API port 8000 from the clients that need to reach it. Do not open PostgreSQL ports.

Install Docker Engine, Compose, and Git:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

The EC2 instance needs read access to the GitHub repository for `git pull`. Create a separate read-only GitHub deploy key on the instance and add its public key under the repository's **Settings > Deploy keys**. This key is separate from `EC2_SSH_KEY`, which GitHub Actions uses to log in to EC2:

```bash
mkdir -p ~/.ssh
chmod 700 ~/.ssh
ssh-keygen -t ed25519 -C "hcp-crm-ec2-readonly" -f ~/.ssh/id_ed25519 -N ""
cat ~/.ssh/id_ed25519.pub
```

After adding the public key in GitHub, clone the repository:

```bash
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
sudo mkdir -p /opt/hcp-crm
sudo chown "$USER:$USER" /opt/hcp-crm
git clone git@github.com:mdakram2002/hcp-crm.git /opt/hcp-crm
cd /opt/hcp-crm
cp backend/.env.example backend/.env
chmod 600 backend/.env
nano backend/.env
```

On EC2, set real values in `backend/.env`. Use the Compose hostname and port in `DATABASE_URL`, for example `postgresql://postgres:<URL-ENCODED-PASSWORD>@db:5432/hcp_crm`; set the same password in `POSTGRES_PASSWORD`. Set `FRONTEND_ORIGIN` to the deployed frontend origin, and supply the real Groq, optional OpenAI, and long random JWT secrets. Keep this file only on EC2; it is ignored by Git.

Start and verify the first deployment:

```bash
cd /opt/hcp-crm
docker compose up -d --build
docker compose ps
curl --fail http://127.0.0.1:8000/api/health
```

The database data persists in the `hcp_crm_pgdata` Docker volume across container rebuilds.

### GitHub Actions CI/CD

Add these repository Actions secrets under **Settings > Secrets and variables > Actions**:

| Secret | Value |
| --- | --- |
| `EC2_HOST` | EC2 public IPv4 address or DNS name |
| `EC2_USERNAME` | EC2 SSH login user |
| `EC2_SSH_KEY` | Private SSH key authorized for that EC2 user |

The application/database settings stay in `/opt/hcp-crm/backend/.env` on EC2 and are not sent through GitHub Actions. On each push to `main`, `.github/workflows/deploy.yml` builds the backend image, connects over SSH, pulls `origin/main`, runs `docker compose up -d --build --remove-orphans`, and retries the existing `/api/health` endpoint. A failed SSH command, Compose deployment, or health check fails the workflow. `workflow_dispatch` is also available for a manual run.

To perform the same update manually on EC2:

```bash
cd /opt/hcp-crm
git pull --ff-only origin main
docker compose up -d --build --remove-orphans
curl --fail http://127.0.0.1:8000/api/health
```

### Existing Vercel frontend

Keep the frontend's existing Vercel Git integration. Configure the project with the `frontend` root directory, Vite framework preset, `npm run build` build command, and `dist` output directory. Set `VITE_API_BASE` in Vercel to the EC2 backend base URL without a trailing `/api`; `FRONTEND_ORIGIN` on EC2 must match the deployed frontend origin.