import logging
from datetime import datetime
from bson import ObjectId, errors as bson_errors
from app.database import founder_profiles, startup_plans

logger = logging.getLogger(__name__)


def serialize_doc(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def save_founder_profile(profile: dict) -> str:
    profile["created_at"] = datetime.utcnow()
    result = founder_profiles.insert_one(profile)
    return str(result.inserted_id)


def save_startup_plan(plan: dict, profile: dict) -> str:
    doc = {
        "plan": plan,
        "profile": profile,
        "created_at": datetime.utcnow(),
    }
    result = startup_plans.insert_one(doc)
    return str(result.inserted_id)


def get_saved_plans() -> list:
    plans = list(startup_plans.find().sort("created_at", -1))
    return [serialize_doc(p) for p in plans]


def delete_startup_plan(plan_id: str) -> bool:
    try:
        obj_id = ObjectId(plan_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid plan_id format: %s", plan_id)
        return False
    result = startup_plans.delete_one({"_id": obj_id})
    return result.deleted_count > 0
