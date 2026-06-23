# Skill2Startup AI

An AI-powered startup incubator that transforms user skills, interests, experience, budget, and available time into validated startup opportunities with competitor analysis, MVP plans, revenue models, and execution roadmaps.

## Tech Stack

**Frontend:** React 19, Vite, Tailwind CSS 4, React Router 7, Axios, Framer Motion
**Backend:** FastAPI, Python, Pydantic, Uvicorn
**Database:** MongoDB Atlas
**AI:** Google Gemini API

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Google Gemini API key ([get one](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/your-username/skill2startup-ai.git
cd skill2startup-ai
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
# source venv/bin/activate # macOS/Linux
pip install -r requirements.txt
cp .env.example .env       # Edit .env with your keys
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env       # Optional: set VITE_API_URL for production
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API calls to `http://localhost:8000`.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URL` | Yes | MongoDB Atlas connection string |
| `DATABASE_NAME` | No | Database name (default: `skill2startup`) |
| `GEMINI_API_KEY` | Yes | Google Gemini API key |
| `GEMINI_MODEL` | No | Model name (default: `gemini-1.5-flash`) |
| `ALLOWED_ORIGINS` | No | Comma-separated frontend URLs (default: localhost) |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | No | Backend URL. Leave empty to use Vite proxy in dev. Set for production builds. |

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Health check (includes DB status) |
| POST | `/api/profile/analyze` | Analyze user profile → founder type |
| POST | `/api/startups/generate` | Generate 4 startup ideas |
| POST | `/api/startups/plan` | Generate full startup plan |
| POST | `/api/startups/save` | Save startup plan to MongoDB |
| GET | `/api/startups/saved` | List all saved plans |
| DELETE | `/api/startups/{plan_id}` | Delete a saved plan |

## Testing

```bash
cd backend
pytest tests/ -v
```

Tests cover all endpoints with mocked MongoDB and Gemini. No real API keys needed.

## Project Structure

```
skill2startup-ai/
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API client
│   │   ├── lib/          # Utilities (cn)
│   │   ├── App.jsx       # Router + layout
│   │   └── main.jsx      # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── main.py       # FastAPI app + middleware
│   │   ├── config.py     # Env config + validation
│   │   ├── database.py   # MongoDB connection + indexes
│   │   ├── models/       # Pydantic schemas
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # AI + DB services
│   │   └── prompts/      # AI prompt templates
│   ├── tests/
│   │   ├── test_api.py   # 14 API tests
│   │   └── conftest.py
│   ├── .env.example
│   └── requirements.txt
├── README.md
├── PRD.md
├── TDD.md
└── CLAUDE.md
```

## Deployment

### Frontend → Vercel

1. Push to GitHub
2. Import project in Vercel
3. Set root directory to `frontend`
4. Add env variable: `VITE_API_URL` = your Render backend URL
5. Deploy

### Backend → Render

1. Push to GitHub
2. Create a new Web Service on Render
3. Set root directory to `backend`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all environment variables from `.env.example`
6. Deploy

### Database → MongoDB Atlas

1. Create a free cluster
2. Get connection string
3. Add your IP to Network Access
4. Set the string as `MONGODB_URL`

## Production Checklist

- [ ] `GEMINI_API_KEY` set in backend env
- [ ] `MONGODB_URL` set in backend env
- [ ] `ALLOWED_ORIGINS` set to production frontend URL(s)
- [ ] `VITE_API_URL` set in frontend env
- [ ] Backend health check returns `"database": "connected"`
- [ ] CORS errors resolved in browser console
- [ ] Tests pass: `pytest tests/ -v`
- [ ] Frontend builds: `npm run build`
