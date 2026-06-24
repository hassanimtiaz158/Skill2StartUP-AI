# Skill2Startup AI

An AI-powered startup incubator that turns user skills, interests, experience, budget, and available time into startup ideas, MVP plans, competitor analysis, revenue models, and launch roadmaps.

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS 4, React Router 7, Axios, Framer Motion  
**Backend:** FastAPI, Python, Pydantic, Uvicorn  
**Database:** MongoDB Atlas or local MongoDB  
**AI:** Google Gemini or Groq

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://127.0.0.1:5173`. In development, Vite proxies API requests to `http://127.0.0.1:8000`.

## Backend Environment

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URL` | Yes | MongoDB connection string |
| `DATABASE_NAME` | No | Database name, default `skill2startup` |
| `AI_PROVIDER` | No | `gemini` or `groq`, default `gemini` |
| `GEMINI_API_KEY` | If Gemini | Google Gemini API key |
| `GEMINI_MODEL` | No | Default `gemini-1.5-flash` |
| `GROQ_API_KEY` | If Groq | Groq API key |
| `GROQ_MODEL` | No | Default `llama-3.3-70b-versatile` |
| `GROQ_BASE_URL` | No | Default `https://api.groq.com/openai/v1` |
| `ALLOWED_ORIGINS` | No | Comma-separated frontend origins |

To use Groq:

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Health check with database status |
| `POST` | `/api/auth/signup` | Create account and return auth token |
| `POST` | `/api/auth/signin` | Sign in and return auth token |
| `GET` | `/api/auth/me` | Return current user from bearer token |
| `POST` | `/api/auth/logout` | Revoke current token |
| `POST` | `/api/profile/analyze` | Analyze founder profile |
| `POST` | `/api/startups/generate` | Generate startup ideas |
| `POST` | `/api/startups/plan` | Generate full startup plan |
| `POST` | `/api/startups/save` | Save plan for signed-in user |
| `GET` | `/api/startups/saved` | List signed-in user plans |
| `DELETE` | `/api/startups/{plan_id}` | Delete signed-in user plan |

## Testing

```bash
cd backend
pytest tests/ -v
```

Tests mock MongoDB and AI calls; no real API keys are required when test env vars override provider settings.
