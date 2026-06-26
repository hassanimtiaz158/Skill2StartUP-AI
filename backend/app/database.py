import logging
from pymongo import MongoClient, ASCENDING, DESCENDING
from app.config import MONGODB_URL, DATABASE_NAME

logger = logging.getLogger(__name__)

client = MongoClient(
    MONGODB_URL,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=5000,
)
db = client[DATABASE_NAME]

founder_profiles = db["founder_profiles"]
startup_plans = db["startup_plans"]
shared_analyses = db["shared_analyses"]
saved_analyses = db["saved_analyses"]
build_progress = db["build_progress"]
analytics_events = db["analytics_events"]
customer_strategies = db["customer_strategies"]
users = db["users"]


def ensure_indexes():
    """Create indexes for performance. Safe to call multiple times."""
    try:
        startup_plans.create_index([("created_at", DESCENDING)])
        startup_plans.create_index([("plan.startup_name", ASCENDING)])
        startup_plans.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        saved_analyses.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        customer_strategies.create_index([("user_id", ASCENDING), ("created_at", DESCENDING)])
        founder_profiles.create_index([("created_at", DESCENDING)])
        users.create_index([("email", ASCENDING)], unique=True)
        users.create_index([("created_at", DESCENDING)])
        logger.info("MongoDB indexes ensured.")
    except Exception as e:
        logger.warning("Failed to create MongoDB indexes: %s", e)


def get_db():
    return db
