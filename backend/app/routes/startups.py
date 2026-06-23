import logging
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    UserProfile,
    PlanRequest,
    SavePlanRequest,
    StartupIdeasResponse,
    StartupPlan,
)
from app.services.ai_service import generate_startup_ideas, generate_full_plan
from app.services.database_service import (
    save_startup_plan,
    get_saved_plans,
    delete_startup_plan,
)
from app.services.gemini_service import GeminiAPIError, GeminiRateLimitError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/api/startups/generate", response_model=StartupIdeasResponse)
async def generate_ideas(profile: UserProfile):
    try:
        result = await generate_startup_ideas(profile.model_dump())
    except GeminiRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except GeminiAPIError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Idea generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate ideas. Please try again.")

    if "ideas" not in result or not isinstance(result["ideas"], list):
        logger.error("Idea generation returned invalid structure: %s", list(result.keys()))
        raise HTTPException(status_code=502, detail="AI returned an invalid response. Please try again.")

    try:
        return StartupIdeasResponse(**result)
    except Exception as e:
        logger.error("Ideas response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/plan", response_model=StartupPlan)
async def create_plan(request: PlanRequest):
    try:
        result = await generate_full_plan(
            request.profile.model_dump(),
            request.idea.model_dump(),
        )
    except GeminiRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except GeminiAPIError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Plan generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate plan. Please try again.")

    required = ("startup_name", "pitch", "problem", "solution", "target_users", "roadmap", "swot", "revenue_model", "hackathon_pitch")
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("Plan generation missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete plan. Please try again.")

    try:
        return StartupPlan(**result)
    except Exception as e:
        logger.error("Plan response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/save")
def save_plan(request: SavePlanRequest):
    try:
        plan_id = save_startup_plan(
            request.plan.model_dump(),
            request.profile.model_dump(),
        )
        return {"plan_id": plan_id, "message": "Plan saved successfully"}
    except Exception as e:
        logger.error("Save plan failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save plan. Please try again.")


@router.get("/api/startups/saved")
def list_saved_plans():
    try:
        plans = get_saved_plans()
        return {"plans": plans}
    except Exception as e:
        logger.error("List plans failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch saved plans.")


@router.delete("/api/startups/{plan_id}")
def remove_plan(plan_id: str):
    try:
        deleted = delete_startup_plan(plan_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Plan not found")
        return {"message": "Plan deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete plan failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete plan.")
