# Repository Guidelines

## Project Structure & Module Organization

This repository currently contains a FastAPI backend for Skill2Startup AI.
Source code lives in `backend/app/`: `main.py` wires the app, middleware, routes, and health check; `config.py` loads environment settings; `database.py` manages MongoDB access; `routes/` contains API endpoints; `services/` holds Gemini and database logic; `models/` contains Pydantic schemas; and `prompts/` stores AI prompt templates. Tests live in `backend/tests/`, with shared fixtures in `conftest.py` and endpoint coverage in `test_api.py`. The README references a future `frontend/`; only run frontend commands when that directory exists.

## Build, Test, and Development Commands

From `backend/`, create and activate a virtual environment before installing dependencies:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Run the API locally with reload:

```bash
uvicorn app.main:app --reload --port 8000
```

Run the backend test suite:

```bash
pytest tests/ -v
```

Use `GET /health` to verify the service and MongoDB connectivity after startup.

## Coding Style & Naming Conventions

Use Python 3.10+ and follow standard PEP 8 conventions: 4-space indentation, clear snake_case names for functions and variables, PascalCase for Pydantic models, and uppercase names for module-level constants such as `GEMINI_MODEL`. Keep route handlers thin and place reusable business logic in `backend/app/services/`. Prefer explicit request and response schemas in `backend/app/models/schemas.py`.

## Testing Guidelines

Tests use `pytest`, `pytest-asyncio`, and `httpx.AsyncClient` with mocked MongoDB and Gemini calls. Add async endpoint tests under `backend/tests/` using the `test_<behavior>` naming pattern. Avoid real network, Gemini, or MongoDB calls in tests; patch services or clients as done in `test_api.py`. Cover both success paths and validation or error responses.

## Commit & Pull Request Guidelines

Git history uses short, plain-language summaries such as `Initial commit` and `frontend pending`. Keep commits focused and imperative when possible, for example `Add startup plan validation tests`. Pull requests should include a brief description, test results such as `pytest tests/ -v`, linked issues when applicable, and screenshots only for UI-facing changes.

## Security & Configuration Tips

Do not commit `.env`, virtual environments, caches, or API keys. Required backend settings include `GEMINI_API_KEY` and `MONGODB_URL`; optional settings include `DATABASE_NAME`, `GEMINI_MODEL`, and `ALLOWED_ORIGINS`. Keep production CORS origins explicit instead of relying on broad defaults.
