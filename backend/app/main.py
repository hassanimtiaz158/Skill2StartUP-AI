import logging
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError
from starlette.middleware.base import BaseHTTPMiddleware
import asyncio

from app.database import client, db, ensure_indexes
from app.routes import auth, profile, startups

logger = logging.getLogger(__name__)


class TimeoutMiddleware(BaseHTTPMiddleware):
    """Abort requests that take too long (e.g. hanging Gemini calls)."""

    def __init__(self, app, timeout: float = 60.0):
        super().__init__(app)
        self.timeout = timeout

    async def dispatch(self, request: Request, call_next):
        try:
            return await asyncio.wait_for(call_next(request), timeout=self.timeout)
        except asyncio.TimeoutError:
            logger.error("Request timed out: %s %s", request.method, request.url.path)
            return JSONResponse(
                status_code=504,
                content={"detail": "Request timed out. Please try again.", "status_code": 504},
            )


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: verify MongoDB connection and create indexes when available.
    # Do not fail the whole web process here; Render must see the app bind to $PORT.
    try:
        client.admin.command("ping")
        ensure_indexes()
        logger.info("MongoDB connection established successfully.")
    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error("MongoDB connection failed on startup: %s", e)
    except Exception as e:
        logger.error("MongoDB startup check failed: %s", e, exc_info=True)
    yield
    # Shutdown: close MongoDB connection
    client.close()
    logger.info("MongoDB connection closed.")


app = FastAPI(title="Skill2Startup AI", version="1.0.0", lifespan=lifespan)

# CORS: environment-based origins instead of wildcard
_origins_env = os.getenv("ALLOWED_ORIGINS", "")
if _origins_env:
    _allowed_origins = [o.strip() for o in _origins_env.split(",") if o.strip()]
else:
    _allowed_origins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(TimeoutMiddleware, timeout=60.0)

app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(startups.router)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected error occurred. Please try again later.",
            "status_code": 500,
        },
    )


@app.get("/health")
async def health_check():
    try:
        client.admin.command("ping")
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    return {
        "status": "healthy",
        "service": "Skill2Startup AI",
        "database": db_status,
    }
