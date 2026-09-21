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

### 1. Start PostgreSQL

From the repository root:

```bash
docker compose up -d
```

The included Compose configuration starts PostgreSQL on `localhost:5433` using database `hcp_crm` and credentials `postgres` / `postgres`.

### 2. Configure and run the backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `backend/.env` with the following values:

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

### 3. Configure and run the frontend

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

## CI/CD Deployment

This project uses GitHub Actions for automated CI/CD deployment to production.

### Deployment Flow

```
GitHub main branch
    ↓
GitHub Actions
    ↓
CI checks (ci.yml)
    ↓
Docker image build + push (deploy.yml)
    ↓
┌──────────────────┐
▼                  ▼
Frontend             Backend
     │                  │
     ▼                  ▼
  Vercel             Azure VM
                        │
                        ▼
                  Docker Container
                        │
                        ▼
                     FastAPI
                        │
                  ┌─────┴─────┐
                  ▼           ▼
             PostgreSQL    Groq/OpenAI
             + pgvector
```

### What happens on push to `main`:

1. **CI Pipeline** (`ci.yml`):
   - Frontend: Install dependencies, build
   - Backend: Install dependencies, run tests
   - Backend: Validate Docker image build (does not push)
   - This pipeline runs on push to `main` and `develop`, and on pull requests

2. **Deployment Pipeline** (`deploy.yml`):
   - Build production backend Docker image with commit SHA tag
   - Push Docker image to Docker Hub (both SHA tag and `latest`)
   - Deploy frontend to Vercel production
   - Deploy backend Docker container to Azure VM via SSH
   - Health check: Verify `/api/health` endpoint is working
   - This pipeline runs only on push to `main`

### Required GitHub Secrets

Configure these in your GitHub repository settings under `Settings > Secrets and variables > Actions`:

#### Docker Secrets:
- `DOCKER_USERNAME`: Your Docker Hub username
- `DOCKER_PASSWORD`: Your Docker Hub password or access token

#### Vercel Secrets:
- `VERCEL_TOKEN`: Your Vercel authentication token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### Azure VM Secrets:
- `AZURE_VM_IP`: Your Azure VM public IP address
- `AZURE_VM_USER`: SSH username for Azure VM (e.g., `azureuser`)
- `AZURE_SSH_PRIVATE_KEY`: Private SSH key for Azure VM authentication

#### Application Secrets:
- `PRODUCTION_API_BASE`: Production backend URL (e.g., `https://api.yourdomain.com`)
- `PRODUCTION_FRONTEND_ORIGIN`: Production frontend URL (e.g., `https://yourdomain.com`)
- `PRODUCTION_DATABASE_URL`: Production PostgreSQL connection string
- `GROQ_API_KEY`: Your Groq API key for AI features
- `GROQ_MODEL`: Groq model to use (default: `llama-3.3-70b-versatile`)
- `OPENAI_API_KEY`: Your OpenAI API key for embeddings
- `JWT_SECRET_KEY`: Secret key for JWT token signing

### Azure VM Prerequisites

Run these commands once on your Azure VM to set up the environment:

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Configure firewall to allow port 8000
sudo ufw allow 8000/tcp
sudo ufw allow 22/tcp
sudo ufw enable

# Test Docker installation
docker --version
docker run hello-world
```

### Vercel Configuration

1. Connect your GitHub repository to Vercel
2. Configure the project with these settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Add `VITE_API_BASE` with your production backend URL

### Manual Backend Deployment

If you need to manually redeploy the backend to Azure VM:

```bash
# SSH into your Azure VM
ssh azureuser@your-vm-ip

# Pull specific commit image (replace COMMIT_SHA with actual commit hash)
docker pull your-docker-username/hcp-crm-backend:COMMIT_SHA

# Stop existing container
docker stop hcp-crm-backend
docker rm hcp-crm-backend

# Create .env file with your production secrets
cat > .env << EOF
DATABASE_URL=your-production-database-url
FRONTEND_ORIGIN=https://yourdomain.com
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
OPENAI_API_KEY=your-openai-api-key
JWT_SECRET_KEY=your-jwt-secret
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=60
EOF

# Run new container with specific commit image
docker run -d \
  --name hcp-crm-backend \
  --restart unless-stopped \
  -p 8000:8000 \
  --env-file .env \
  your-docker-username/hcp-crm-backend:COMMIT_SHA

# Verify health
curl http://localhost:8000/api/health
```
