import logging
import secrets
from datetime import datetime
from bson import ObjectId, errors as bson_errors
from app.database import founder_profiles, startup_plans, saved_analyses, customer_strategies, decision_reports, business_plans, customer_insights, market_intelligence, ai_cofounder_chats, investor_tools

logger = logging.getLogger(__name__)


def serialize_doc(doc: dict) -> dict:
    doc["_id"] = str(doc["_id"])
    return doc


def save_founder_profile(profile: dict) -> str:
    profile["created_at"] = datetime.utcnow()
    result = founder_profiles.insert_one(profile)
    return str(result.inserted_id)


def save_startup_plan(plan: dict, profile: dict, user_id: str | None = None) -> str:
    doc = {
        "plan": plan,
        "profile": profile,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = startup_plans.insert_one(doc)
    return str(result.inserted_id)


def get_saved_plans(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    plans = list(startup_plans.find(query).sort("created_at", -1))
    return [serialize_doc(p) for p in plans]


def save_idea_analysis(analysis: dict, idea_form: dict, user_id: str | None = None) -> str:
    doc = {
        "analysis": analysis,
        "idea_form": idea_form,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = saved_analyses.insert_one(doc)
    return str(result.inserted_id)


def get_saved_idea_analyses(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(saved_analyses.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_saved_idea_analysis(analysis_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(analysis_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid analysis_id format: %s", analysis_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = saved_analyses.delete_one(query)
    return result.deleted_count > 0


def save_shared_analysis(analysis: dict, idea_form: dict) -> str:
    token = secrets.token_urlsafe(16)
    doc = {
        "token": token,
        "analysis": analysis,
        "idea_form": idea_form,
        "created_at": datetime.utcnow(),
    }
    from app.database import shared_analyses
    shared_analyses.insert_one(doc)
    return token


def get_shared_analysis(token: str) -> dict | None:
    from app.database import shared_analyses
    doc = shared_analyses.find_one({"token": token})
    if doc:
        doc["_id"] = str(doc["_id"])
        doc["created_at"] = doc["created_at"].isoformat()
        return doc
    return None


def save_build_progress(token: str, day: int, completed_tasks: list[str], notes: str = "") -> dict:
    from app.database import build_progress
    doc = build_progress.find_one({"token": token})
    if not doc:
        doc = {"token": token, "days": {}, "created_at": datetime.utcnow()}
    if "days" not in doc:
        doc["days"] = {}
    doc["days"][str(day)] = {"completed_tasks": completed_tasks, "notes": notes, "updated_at": datetime.utcnow().isoformat()}
    build_progress.replace_one({"token": token}, doc, upsert=True)
    return {"days": doc["days"]}


def get_build_progress(token: str) -> dict | None:
    from app.database import build_progress
    doc = build_progress.find_one({"token": token})
    if doc:
        return {"days": doc.get("days", {})}
    return {"days": {}}


def track_event(event: str, properties: dict | None = None) -> None:
    from app.database import analytics_events
    analytics_events.insert_one({
        "event": event,
        "properties": properties or {},
        "created_at": datetime.utcnow(),
    })


def get_analytics_summary() -> dict:
    from app.database import analytics_events, shared_analyses
    total_analyses = analytics_events.count_documents({"event": "idea_analysis"})
    total_shares = shared_analyses.count_documents({})
    total_chats = analytics_events.count_documents({"event": "idea_chat"})
    pipeline = [
        {"$match": {"event": "idea_analysis"}},
        {"$group": {"_id": "$properties.industry", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 10},
    ]
    top_industries = [{"industry": r["_id"] or "unknown", "count": r["count"]} for r in analytics_events.aggregate(pipeline)]
    recent = list(analytics_events.find().sort("created_at", -1).limit(20))
    recent_events = []
    for r in recent:
        recent_events.append({
            "event": r["event"],
            "properties": r.get("properties", {}),
            "created_at": r["created_at"].isoformat() if hasattr(r["created_at"], "isoformat") else str(r["created_at"]),
        })
    return {
        "total_analyses": total_analyses,
        "total_shares": total_shares,
        "total_chats": total_chats,
        "top_industries": top_industries,
        "recent_events": recent_events,
    }


def delete_startup_plan(plan_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(plan_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid plan_id format: %s", plan_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = startup_plans.delete_one(query)
    return result.deleted_count > 0


def save_customer_strategy(strategy: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "strategy": strategy,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = customer_strategies.insert_one(doc)
    return str(result.inserted_id)


def get_customer_strategies(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(customer_strategies.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def save_decision_report(report: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "report": report,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = decision_reports.insert_one(doc)
    return str(result.inserted_id)


def get_decision_reports(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(decision_reports.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_decision_report(report_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(report_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid report_id format: %s", report_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = decision_reports.delete_one(query)
    return result.deleted_count > 0


def save_business_plan(plan: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "plan": plan,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = business_plans.insert_one(doc)
    return str(result.inserted_id)


def get_business_plans(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(business_plans.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_business_plan(plan_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(plan_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid plan_id format: %s", plan_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = business_plans.delete_one(query)
    return result.deleted_count > 0


def save_customer_insights(insights: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "insights": insights,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = customer_insights.insert_one(doc)
    return str(result.inserted_id)


def get_customer_insights_list(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(customer_insights.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_customer_insights(insights_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(insights_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid insights_id format: %s", insights_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = customer_insights.delete_one(query)
    return result.deleted_count > 0


def delete_customer_strategy(strategy_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(strategy_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid strategy_id format: %s", strategy_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = customer_strategies.delete_one(query)
    return result.deleted_count > 0


def save_market_intelligence(report: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "report": report,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = market_intelligence.insert_one(doc)
    return str(result.inserted_id)


def get_market_intelligence_list(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(market_intelligence.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_market_intelligence(report_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(report_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid report_id format: %s", report_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = market_intelligence.delete_one(query)
    return result.deleted_count > 0


def save_ai_cofounder_chat(advisor_type: str, messages: list, user_id: str | None = None) -> str:
    doc = {
        "advisor_type": advisor_type,
        "messages": messages,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = ai_cofounder_chats.insert_one(doc)
    return str(result.inserted_id)


def get_ai_cofounder_chats(advisor_type: str, user_id: str | None = None, limit: int = 50) -> list:
    query = {"advisor_type": advisor_type}
    if user_id:
        query["user_id"] = user_id
    docs = list(ai_cofounder_chats.find(query).sort("created_at", -1).limit(limit))
    return [serialize_doc(d) for d in docs]


def delete_ai_cofounder_chat(chat_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(chat_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid chat_id format: %s", chat_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = ai_cofounder_chats.delete_one(query)
    return result.deleted_count > 0


def save_investor_tools(report: dict, idea_context: dict, user_id: str | None = None) -> str:
    doc = {
        "report": report,
        "idea_context": idea_context,
        "user_id": user_id,
        "created_at": datetime.utcnow(),
    }
    result = investor_tools.insert_one(doc)
    return str(result.inserted_id)


def get_investor_tools_list(user_id: str | None = None) -> list:
    query = {"user_id": user_id} if user_id else {}
    docs = list(investor_tools.find(query).sort("created_at", -1))
    return [serialize_doc(d) for d in docs]


def delete_investor_tools(report_id: str, user_id: str | None = None) -> bool:
    try:
        obj_id = ObjectId(report_id)
    except (bson_errors.InvalidId, TypeError):
        logger.warning("Invalid report_id format: %s", report_id)
        return False
    query = {"_id": obj_id}
    if user_id:
        query["user_id"] = user_id
    result = investor_tools.delete_one(query)
    return result.deleted_count > 0
