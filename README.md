<div align="center">

# Skill2Startup AI

### Turn Your Skills Into a Startup in Minutes

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![React 18](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)

**AI-powered startup incubator** that transforms your skills, interests, and budget into actionable business plans, MVP roadmaps, and launch strategies — not just generic advice.

---

[Get Started](#-quick-start) • [Features](#-features) • [Why Us](#-why-skill2startup-ai) • [Competitor Analysis](#-competitor-limitations--how-we-solve-them) • [Deploy](#-deployment)

</div>

---

## Why Skill2Startup AI?

> "ChatGPT gave me 10 startup ideas. None were personalized. None had a plan. None told me what to do next."

**Generic AI tools fail founders because they treat everyone the same.** Skill2Startup AI is different:

- **Personalized to YOU** — Your skills, experience, budget, and time constraints shape every recommendation
- **End-to-end pipeline** — From idea generation → validation → MVP plan → marketing → launch → growth
- **Structured outputs** — Not walls of text, but actionable checklists, tables, and roadmaps
- **AI Co-Founder** — Chat with an AI that knows your entire business context
- **Save & compare** — Track multiple ideas, compare them side-by-side, pick the winner

---

## Competitor Limitations & How We Solve Them

### The Problem with Generic AI Tools

| Tool | What It Does Well | Where It Falls Short |
|------|-------------------|----------------------|
| **ChatGPT / GPT-4** | Great at general Q&A, brainstorming | No personalized context. No persistence. No structured business outputs. You get walls of text, not action plans. |
| **Copy.ai** | Good for marketing copy | Focused on content generation, not business strategy. No idea validation. No MVP planning. |
| **Notion AI** | Works inside your workspace | Just a writing assistant inside docs. No startup-specific logic. No domain expertise. |
| **IdeaBuddy** | Business model canvas tool | Template-based, not AI-driven. Limited personalization. No technical planning. |
| **Founderpal** | AI startup advice | Generic advice. No context about your skills, budget, or market. One-size-fits-all. |

### How Skill2Startup AI Solves Each Limitation

<table>
<tr>
<th width="30%">Limitation</th>
<th width="35%">Generic AI Tools</th>
<th width="35%">Skill2Startup AI</th>
</tr>
<tr>
<td><strong>No Personalization</strong></td>
<td>Same advice for everyone. "Start a SaaS" — even if you have $0 and no coding skills.</td>
<td><strong>Founder Profile Analysis</strong> — Input your skills, interests, budget, and time. Get ideas that match YOUR reality.</td>
</tr>
<tr>
<td><strong>No Persistence</strong></td>
<td>Chat history lost. Start over every session. No progress tracking.</td>
<td><strong>Saved Ideas + Dashboard</strong> — All your plans saved. Track progress. Pick up where you left off.</td>
</tr>
<tr>
<td><strong>No Actionable Plans</strong></td>
<td>"Here are 10 ideas!" — Great. Now what? No roadmap. No next steps.</td>
<td><strong>Full MVP Roadmap</strong> — Week-by-week plan with tasks, deliverables, and milestones.</td>
</tr>
<tr>
<td><strong>No Market Context</strong></td>
<td>Generic suggestions without market analysis. "Build an app for X" — is there demand?</td>
<td><strong>Competitor Analysis + Market Intelligence</strong> — Real market data, competitor landscape, positioning strategy.</td>
</tr>
<tr>
<td><strong>No Financial Planning</strong></td>
<td>"Raise funding" — How much? From where? What's the burn rate?</td>
<td><strong>Revenue Model + Financial Plan</strong> — Pricing strategy, break-even analysis, funding recommendations.</td>
</tr>
<tr>
<td><strong>No Marketing Strategy</strong></td>
<td>"Post on social media" — Which platforms? What content? What budget?</td>
<td><strong>Marketing Hub</strong> — Channel strategy, content calendar, customer acquisition plan, budget allocation.</td>
</tr>
<tr>
<td><strong>No Collaboration</strong></td>
<td>Single-user experience. Can't share with co-founders or advisors.</td>
<td><strong>Team Collaboration</strong> — Share plans, assign tasks, get feedback from your team.</td>
</tr>
<tr>
<td><strong>No Validation</strong></td>
<td>"Great idea!" — But is it really? No scoring. No reality check.</td>
<td><strong>AI Judge + Decision Engine</strong> — Brutally honest scoring of your idea's viability, risk assessment, go/no-go decision.</td>
</tr>
</table>

---

## Features

### Core Pipeline
- **Founder Profile Analysis** — AI analyzes your skills, experience, and goals to suggest founder types
- **Idea Generation** — Personalized startup ideas based on YOUR profile
- **Idea Analysis** — Deep dive into any idea: market size, competition, feasibility, risk
- **Startup Plan Generator** — Full business plan with MVP, timeline, and budget

### Business Tools
- **AI Co-Founder** — Context-aware chatbot that knows your entire business
- **Investor Tools** — Pitch deck outline, financial projections, funding strategy
- **Marketing Hub** — Channel strategy, content plan, customer acquisition
- **Development Hub** — Tech stack recommendations, architecture, sprint planning
- **Growth Hub** — Scaling strategy, metrics, growth loops
- **Financial Plan** — Revenue model, pricing, break-even analysis
- **Launch Hub** — Go-to-market checklist, launch timeline, PR strategy

### Strategy Pages
- **First 100 Customers** — Acquisition channels, outreach templates, conversion funnel
- **Decision Engine** — Score your idea against 8 criteria, get a go/no-go recommendation
- **Business Planning** — Business Model Canvas, Lean Canvas, revenue modeling
- **Customer Insights** — Personas, journey mapping, pain point analysis
- **Market Intelligence** — Market sizing, trends, competitor deep-dive

### Collaboration & Security
- **Team Collaboration** — Invite members, share plans, assign tasks, leave comments
- **Saved Ideas** — Central registry linking all analysis and reports per idea
- **Secure Auth** — Bearer token authentication, password reset, CORS protection
- **Error Boundaries** — Graceful crash recovery across the app

---

## Tech Stack

<div align="center">

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite 6, Tailwind CSS 4, React Router 7, Axios, Framer Motion, Lucide Icons |
| **Backend** | FastAPI, Python 3.11+, Pydantic, Uvicorn |
| **Database** | MongoDB Atlas (or local MongoDB) |
| **AI Providers** | Google Gemini (gemini-1.5-flash) or Groq (llama-3.3-70b-versatile) |
| **Deployment** | Vercel (frontend) + Render (backend) |

</div>

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
copy .env.example .env         # Windows
# cp .env.example .env        # macOS/Linux
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open **http://127.0.0.1:5173** — Vite proxies API requests to the backend.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URL` | Yes | MongoDB connection string |
| `DATABASE_NAME` | No | Default: `skill2startup` |
| `AI_PROVIDER` | No | `gemini` or `groq` (default: `gemini`) |
| `GEMINI_API_KEY` | If Gemini | Google Gemini API key |
| `GEMINI_MODEL` | No | Default: `gemini-1.5-flash` |
| `GROQ_API_KEY` | If Groq | Groq API key |
| `GROQ_MODEL` | No | Default: `llama-3.3-70b-versatile` |
| `GROQ_BASE_URL` | No | Default: `https://api.groq.com/openai/v1` |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |
| `FRONTEND_URL` | No | Frontend URL for deployment |

---

## API Endpoints

<details>
<summary><strong>Auth Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signup` | Create account |
| `POST` | `/api/auth/signin` | Sign in |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/logout` | Revoke token |

</details>

<details>
<summary><strong>Core Pipeline Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/profile/analyze` | Analyze founder profile |
| `POST` | `/api/startups/generate` | Generate startup ideas |
| `POST` | `/api/startups/plan` | Generate full startup plan |
| `POST` | `/api/startups/evaluate` | Evaluate startup viability |
| `POST` | `/api/startups/analyze-idea` | Deep idea analysis |
| `POST` | `/api/startups/chat` | Chat with AI co-founder |

</details>

<details>
<summary><strong>Hub Tool Endpoints</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/hubs/investor-tools` | Generate investor materials |
| `POST` | `/api/hubs/marketing` | Generate marketing strategy |
| `POST` | `/api/hubs/development` | Generate dev roadmap |
| `POST` | `/api/hubs/growth` | Generate growth strategy |
| `POST` | `/api/hubs/financial-plan` | Generate financial plan |
| `POST` | `/api/hubs/launch` | Generate launch checklist |
| `POST` | `/api/strategy/first-100-customers` | Customer acquisition plan |
| `POST` | `/api/strategy/decision-engine` | Score & validate idea |
| `POST` | `/api/strategy/business-planning` | Business model canvas |
| `POST` | `/api/strategy/customer-insights` | Customer persona analysis |
| `POST` | `/api/strategy/market-intelligence` | Market research report |

</details>

<details>
<summary><strong>Saved Ideas & Collaboration</strong></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/saved-ideas` | Create saved idea |
| `GET` | `/api/saved-ideas` | List saved ideas |
| `PUT` | `/api/saved-ideas/{id}` | Update saved idea |
| `DELETE` | `/api/saved-ideas/{id}` | Delete saved idea |
| `POST` | `/api/saved-ideas/{id}/reports` | Add report to idea |
| `GET` | `/api/saved-ideas/{id}/reports` | List idea reports |

</details>

---

## Testing

```bash
cd backend
pytest tests/ -v
```

35 tests covering auth, profile analysis, idea generation, startup planning, chat, and error handling. All AI calls are mocked — no API keys needed.

---

## Deployment

### Backend on Render

```text
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend on Vercel

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Set `VITE_API_URL` to your Render backend URL.

See [full deployment guide](#backend-environment) for environment variables.

---

## 60-Second Demo

1. Open the app → Click **"Run AI Demo"**
2. Watch the AI analyze a sample founder profile
3. See personalized startup ideas generated in real-time
4. Explore the full MVP plan, marketing strategy, and financial projections
5. Sign up to save your own ideas and track progress

---

<div align="center">

**Built for founders who want action, not just ideas.**

[Get Started](#-quick-start) • [Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>
