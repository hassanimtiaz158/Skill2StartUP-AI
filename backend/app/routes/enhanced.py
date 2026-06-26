import json
import logging
from fastapi import APIRouter, Depends, Header, HTTPException
from fastapi.responses import StreamingResponse
from app.config import FRONTEND_URL
from app.models.schemas import (
    EvaluationRequest,
    CofounderRequest,
    RoadmapRequest,
    ReadmeRequest,
    IdeaAnalysisRequest,
    IdeaAnalysisResponse,
    IdeaChatRequest,
    IdeaChatResponse,
    ShareLinkRequest,
    ShareLinkResponse,
    FundingDecision,
    CofounderPersona,
    MarketSizeRequest,
    MarketSizeResponse,
    DebateRequest,
    DebateResponse,
    ComparisonRequest,
    ComparisonResponse,
    EmailReportRequest,
    EmailReportResponse,
    First100CustomersRequest,
    First100CustomersResponse,
    ProgressSaveRequest,
    ProgressLoadResponse,
    AnalyticsEvent,
    AnalyticsResponse,
)
from app.services.ai_service import (
    analyze_profile,
    evaluate_startup,
    generate_cofounder,
    generate_task_roadmap,
    generate_readme,
    analyze_idea,
    analyze_idea_stream,
    chat_about_idea,
    chat_about_idea_stream,
    estimate_market_size,
    debate_idea,
    compare_ideas,
    generate_email_report,
    generate_first_100_customers,
)
from app.services.ai_errors import AIServiceError, AIRateLimitError
from app.services.auth_service import get_user_by_token
from app.services.database_service import save_shared_analysis, get_shared_analysis, save_build_progress, get_build_progress, track_event, get_analytics_summary, save_idea_analysis, get_saved_idea_analyses, delete_saved_idea_analysis
from app.services.email_service import send_email

logger = logging.getLogger(__name__)

router = APIRouter()


def _normalize_string_list(val):
    """Ensure every element in a list is a string (coerce dicts/lists to JSON string)."""
    if not isinstance(val, list):
        return []
    return [str(item) if not isinstance(item, str) else item for item in val]


def _normalize_string(val):
    """Coerce non-string values to string."""
    return str(val) if not isinstance(val, str) else val


@router.post("/api/startups/evaluate", response_model=FundingDecision)
async def evaluate_startup_idea(request: EvaluationRequest):
    try:
        founder_analysis = await analyze_profile(request.profile.model_dump())
        result = await evaluate_startup(
            request.profile.model_dump(),
            request.idea.model_dump(),
            founder_analysis,
        )
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Evaluation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to evaluate startup. Please try again.")

    required = ("decision", "overall_score", "evaluations", "summary")
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("Evaluation missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete evaluation. Please try again.")

    try:
        return FundingDecision(**result)
    except Exception as e:
        logger.error("Evaluation response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/cofounder", response_model=CofounderPersona)
async def generate_cofounder_persona(request: CofounderRequest):
    try:
        founder_analysis = await analyze_profile(request.profile.model_dump())
        result = await generate_cofounder(
            request.profile.model_dump(),
            request.idea.model_dump(),
            founder_analysis,
        )
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Cofounder generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate co-founder. Please try again.")

    required = ("name", "personality", "strengths", "complement", "advice")
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("Cofounder missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete co-founder. Please try again.")

    try:
        return CofounderPersona(**result)
    except Exception as e:
        logger.error("Cofounder response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/roadmap")
async def generate_startup_roadmap(request: RoadmapRequest):
    try:
        result = await generate_task_roadmap(
            request.profile.model_dump(),
            request.idea.model_dump(),
            request.plan.model_dump(),
        )
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Roadmap generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate roadmap. Please try again.")

    if "roadmap" not in result or not isinstance(result["roadmap"], list):
        logger.error("Roadmap returned invalid structure: %s", list(result.keys()))
        raise HTTPException(status_code=502, detail="AI returned an invalid roadmap. Please try again.")

    return result


@router.post("/api/startups/analyze-idea", response_model=IdeaAnalysisResponse)
async def analyze_startup_idea(request: IdeaAnalysisRequest):
    try:
        track_event("idea_analysis", {"industry": request.industry, "idea_preview": request.startup_idea[:50]})
        result = await analyze_idea(request.model_dump())
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Idea analysis failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to analyze idea. Please try again.")

    required = (
        "refined_idea", "problem_statement", "target_users",
        "market_demand_score", "uniqueness_score", "feasibility_score",
        "revenue_potential_score", "hackathon_winning_score",
        "competitors", "differentiation_strategy", "mvp_features",
        "tech_stack_recommendation", "monetization_model", "risks",
        "improvement_suggestions", "seven_day_build_plan",
        "founder_readiness_check", "pitch_summary",
    )
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("Idea analysis missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete analysis. Please try again.")

    result["refined_idea"] = _normalize_string(result.get("refined_idea", ""))
    result["problem_statement"] = _normalize_string(result.get("problem_statement", ""))
    result["differentiation_strategy"] = _normalize_string(result.get("differentiation_strategy", ""))
    result["monetization_model"] = _normalize_string(result.get("monetization_model", ""))
    result["founder_readiness_check"] = _normalize_string(result.get("founder_readiness_check", ""))
    result["pitch_summary"] = _normalize_string(result.get("pitch_summary", ""))
    result["target_users"] = _normalize_string_list(result.get("target_users", []))
    result["mvp_features"] = _normalize_string_list(result.get("mvp_features", []))
    result["tech_stack_recommendation"] = _normalize_string_list(result.get("tech_stack_recommendation", []))
    result["risks"] = _normalize_string_list(result.get("risks", []))
    result["improvement_suggestions"] = _normalize_string_list(result.get("improvement_suggestions", []))
    for score_key in ("market_demand_score", "uniqueness_score", "feasibility_score", "revenue_potential_score", "hackathon_winning_score"):
        try:
            result[score_key] = float(result.get(score_key, 0))
        except (ValueError, TypeError):
            result[score_key] = 0.0
    for comp in result.get("competitors", []):
        comp["name"] = _normalize_string(comp.get("name", ""))
        comp["source"] = _normalize_string(comp.get("source", "ai-estimated")).lower()
        if comp["source"] not in ("ai-estimated", "web"):
            comp["source"] = "ai-estimated"
        comp["strengths"] = _normalize_string_list(comp.get("strengths", []))
        comp["weaknesses"] = _normalize_string_list(comp.get("weaknesses", []))
    for day in result.get("seven_day_build_plan", []):
        try:
            day["day"] = int(day.get("day", 1))
        except (ValueError, TypeError):
            day["day"] = 1
        day["title"] = _normalize_string(day.get("title", ""))
        day["tasks"] = _normalize_string_list(day.get("tasks", []))
    try:
        return IdeaAnalysisResponse(**result)
    except Exception as e:
        logger.error("Idea analysis response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/analyze-idea/stream")
async def analyze_startup_idea_stream(request: IdeaAnalysisRequest):
    """SSE streaming endpoint for idea analysis. Yields tokens then final result."""
    async def event_stream():
        try:
            final_result = None
            async for item in analyze_idea_stream(request.model_dump()):
                if isinstance(item, dict):
                    final_result = item
                else:
                    yield f"data: {json.dumps({'token': item})}\n\n"
            if final_result:
                yield f"data: {json.dumps({'done': True, 'result': final_result})}\n\n"
            else:
                yield f"data: {json.dumps({'error': 'AI returned an empty response.'})}\n\n"
        except AIRateLimitError as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        except AIServiceError as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        except Exception as e:
            logger.error("Streaming idea analysis failed: %s", e, exc_info=True)
            yield f"data: {json.dumps({'error': 'Analysis failed. Please try again.'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/api/startups/analyze-idea/chat", response_model=IdeaChatResponse)
async def chat_about_startup_idea(request: IdeaChatRequest):
    try:
        track_event("idea_chat", {"question_preview": request.question[:50]})
        result = await chat_about_idea(request.analysis, request.question)
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Idea chat failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to answer question. Please try again.")

    if "answer" not in result:
        logger.error("Chat response missing answer field: %s", list(result.keys()))
        raise HTTPException(status_code=502, detail="AI returned an incomplete response.")

    return IdeaChatResponse(**result)


@router.post("/api/startups/analyze-idea/chat/stream")
async def chat_about_startup_idea_stream(request: IdeaChatRequest):
    """SSE streaming endpoint for idea chat."""
    async def event_stream():
        try:
            async for item in chat_about_idea_stream(request.analysis, request.question):
                if isinstance(item, dict):
                    answer = item.get("answer", "")
                    yield f"data: {json.dumps({'done': True, 'answer': answer})}\n\n"
                else:
                    yield f"data: {json.dumps({'token': item})}\n\n"
        except AIRateLimitError as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        except AIServiceError as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        except Exception as e:
            logger.error("Streaming chat failed: %s", e, exc_info=True)
            yield f"data: {json.dumps({'error': 'Chat failed. Please try again.'})}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/api/startups/first-100-customers", response_model=First100CustomersResponse)
async def generate_first_100_customers_plan(request: First100CustomersRequest):
    try:
        track_event("first_100_customers", {"idea_preview": request.startup_name[:50] if request.startup_name else request.pitch[:50]})
        result = await generate_first_100_customers(request.model_dump())
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("First 100 customers failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate customer acquisition plan. Please try again.")

    required = ("ideal_early_adopters", "where_to_find_them", "outreach_channels", "cold_message_templates", "social_media_launch_plan", "referral_strategy", "seven_day_action_plan", "metrics_to_track")
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("First 100 customers missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete plan. Please try again.")

    try:
        return First100CustomersResponse(**result)
    except Exception as e:
        logger.error("First 100 customers response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid response format.")


@router.post("/api/startups/analyze-idea/share", response_model=ShareLinkResponse)
async def share_idea_analysis(request: ShareLinkRequest):
    try:
        token = save_shared_analysis(request.analysis, request.idea_form)
        share_url = f"{FRONTEND_URL.rstrip('/')}/share/{token}"
        return ShareLinkResponse(token=token, url=share_url)
    except Exception as e:
        logger.error("Share link creation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to create share link.")


@router.get("/api/share/{token}")
async def get_shared_idea_analysis(token: str):
    doc = get_shared_analysis(token)
    if not doc:
        raise HTTPException(status_code=404, detail="Shared analysis not found.")
    return {
        "analysis": doc.get("analysis"),
        "idea_form": doc.get("idea_form", {}),
        "created_at": doc.get("created_at", ""),
    }


@router.post("/api/startups/readme")
async def generate_startup_readme(request: ReadmeRequest):
    try:
        result = await generate_readme(
            request.profile.model_dump(),
            request.idea.model_dump(),
            request.plan.model_dump(),
        )
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited. Please try again in a moment.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("README generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate README. Please try again.")

    required = ("project_name", "problem", "solution", "features", "tech_stack", "architecture", "setup_steps", "future_improvements", "markdown")
    missing = [f for f in required if f not in result]
    if missing:
        logger.error("README missing fields: %s", missing)
        raise HTTPException(status_code=502, detail="AI returned an incomplete README. Please try again.")

    return result


@router.post("/api/startups/market-size", response_model=MarketSizeResponse)
async def estimate_startup_market(request: MarketSizeRequest):
    try:
        track_event("market_size", {"industry": request.industry, "idea_preview": request.startup_idea[:50]})
        result = await estimate_market_size(request.model_dump())
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Market size estimation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to estimate market size.")
    required = ("tam", "sam", "som", "growth_rate", "key_trends", "revenue_projection", "data_confidence")
    missing = [f for f in required if f not in result]
    if missing:
        raise HTTPException(status_code=502, detail="AI returned incomplete market data.")
    result["tam"] = _normalize_string(result.get("tam", ""))
    result["sam"] = _normalize_string(result.get("sam", ""))
    result["som"] = _normalize_string(result.get("som", ""))
    result["growth_rate"] = _normalize_string(result.get("growth_rate", ""))
    result["revenue_projection"] = _normalize_string(result.get("revenue_projection", ""))
    result["data_confidence"] = _normalize_string(result.get("data_confidence", "medium")).lower()
    if result["data_confidence"] not in ("high", "medium", "low"):
        result["data_confidence"] = "medium"
    result["key_trends"] = _normalize_string_list(result.get("key_trends", []))
    try:
        return MarketSizeResponse(**result)
    except Exception as e:
        logger.error("Market size response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid market size format. Please try again.")


@router.post("/api/startups/debate", response_model=DebateResponse)
async def debate_startup_idea(request: DebateRequest):
    try:
        track_event("debate", {"industry": request.industry, "idea_preview": request.startup_idea[:50]})
        result = await debate_idea(request.model_dump())
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Debate failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to run debate.")
    if "agents" not in result or "consensus" not in result:
        raise HTTPException(status_code=502, detail="AI returned incomplete debate.")
    result["consensus"] = _normalize_string(result.get("consensus", ""))
    result["key_takeaways"] = _normalize_string_list(result.get("key_takeaways", []))
    for agent in result.get("agents", []):
        agent["agent_name"] = _normalize_string(agent.get("agent_name", ""))
        agent["role"] = _normalize_string(agent.get("role", ""))
        agent["argument"] = _normalize_string(agent.get("argument", ""))
        agent["emoji"] = _normalize_string(agent.get("emoji", ""))
    try:
        return DebateResponse(**result)
    except Exception as e:
        logger.error("Debate response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid debate format. Please try again.")


@router.post("/api/startups/compare", response_model=ComparisonResponse)
async def compare_startup_ideas(request: ComparisonRequest):
    try:
        track_event("comparison", {"idea_a_preview": request.idea_a[:50], "idea_b_preview": request.idea_b[:50]})
        result = await compare_ideas(request.model_dump())
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Comparison failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to compare ideas.")
    if "dimensions" not in result or "overall_winner" not in result:
        raise HTTPException(status_code=502, detail="AI returned incomplete comparison.")
    result["overall_winner"] = _normalize_string(result.get("overall_winner", ""))
    result["summary"] = _normalize_string(result.get("summary", ""))
    for dim in result.get("dimensions", []):
        dim["dimension"] = _normalize_string(dim.get("dimension", ""))
        dim["idea_a_notes"] = _normalize_string(dim.get("idea_a_notes", ""))
        dim["idea_b_notes"] = _normalize_string(dim.get("idea_b_notes", ""))
        try:
            dim["idea_a_score"] = int(dim.get("idea_a_score", 5))
            dim["idea_b_score"] = int(dim.get("idea_b_score", 5))
        except (ValueError, TypeError):
            dim["idea_a_score"] = 5
            dim["idea_b_score"] = 5
    try:
        return ComparisonResponse(**result)
    except Exception as e:
        logger.error("Comparison response validation failed: %s", e)
        raise HTTPException(status_code=502, detail="AI returned an invalid comparison format. Please try again.")


@router.post("/api/startups/email-report", response_model=EmailReportResponse)
async def email_startup_report(request: EmailReportRequest):
    try:
        track_event("email_report", {"recipient": request.recipient_email[:30]})
        html_content = await generate_email_report(request.analysis)
    except AIRateLimitError:
        raise HTTPException(status_code=429, detail="AI service rate limited.")
    except AIServiceError as e:
        raise HTTPException(status_code=502, detail=f"AI service error: {str(e)}")
    except Exception as e:
        logger.error("Email report generation failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate email report.")

    idea_name = request.analysis.get("refined_idea", request.idea_form.get("startup_idea", "Your Idea"))[:60]
    subject = f"Your Startup Idea Analysis - {idea_name}"
    sent, reason = await send_email(request.recipient_email, subject, html_content)
    if sent:
        return EmailReportResponse(sent=True, message=f"Report sent to {request.recipient_email}")
    return EmailReportResponse(sent=False, message=f"Email sending unavailable. {reason}")


def _optional_user_id(authorization: str = Header(default="")) -> str | None:
    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None
    user = get_user_by_token(token)
    return user["id"] if user else None


def _require_user_id(authorization: str = Header(default="")) -> str:
    user_id = _optional_user_id(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Sign in required.")
    return user_id


@router.post("/api/startups/first-100-customers/save")
async def save_customer_strategy(body: dict, user_id: str = Depends(_require_user_id)):
    try:
        track_event("save_customer_strategy", {"user_id": user_id})
        strategy = body.get("strategy", {})
        idea_context = body.get("idea_context", {})
        if not strategy:
            raise HTTPException(status_code=400, detail="Strategy data is required.")
        from app.services.database_service import save_customer_strategy as db_save
        strategy_id = db_save(strategy, idea_context, user_id=user_id)
        return {"strategy_id": strategy_id, "message": "Customer strategy saved successfully."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Save customer strategy failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save strategy.")


@router.get("/api/startups/first-100-customers/saved")
async def list_saved_customer_strategies(user_id: str = Depends(_require_user_id)):
    try:
        from app.services.database_service import get_customer_strategies
        strategies = get_customer_strategies(user_id=user_id)
        return {"strategies": strategies}
    except Exception as e:
        logger.error("List customer strategies failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch saved strategies.")


@router.delete("/api/startups/first-100-customers/{strategy_id}")
async def remove_customer_strategy(strategy_id: str, user_id: str = Depends(_require_user_id)):
    try:
        from app.services.database_service import delete_customer_strategy
        deleted = delete_customer_strategy(strategy_id, user_id=user_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Strategy not found")
        return {"message": "Strategy deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete customer strategy failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete strategy.")


@router.post("/api/startups/analyze-idea/save")
async def save_idea_analysis_progress(
    body: dict,
    user_id: str = Depends(_require_user_id),
):
    try:
        track_event("save_analysis", {"user_id": user_id})
        analysis = body.get("analysis", {})
        idea_form = body.get("idea_form", {})
        if not analysis:
            raise HTTPException(status_code=400, detail="Analysis data is required.")
        analysis_id = save_idea_analysis(analysis, idea_form, user_id=user_id)
        return {"analysis_id": analysis_id, "message": "Progress saved successfully."}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Save idea analysis failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save analysis.")


@router.get("/api/startups/analyze-idea/saved")
async def list_saved_idea_analyses(user_id: str = Depends(_require_user_id)):
    try:
        analyses = get_saved_idea_analyses(user_id=user_id)
        return {"analyses": analyses}
    except Exception as e:
        logger.error("List saved analyses failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch saved analyses.")


@router.delete("/api/startups/analyze-idea/saved/{analysis_id}")
async def remove_saved_idea_analysis(analysis_id: str, user_id: str = Depends(_require_user_id)):
    try:
        deleted = delete_saved_idea_analysis(analysis_id, user_id=user_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Analysis not found")
        return {"message": "Analysis deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error("Delete analysis failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to delete analysis.")


@router.post("/api/startups/progress/save")
async def save_build_progress_endpoint(request: ProgressSaveRequest):
    try:
        result = save_build_progress(request.token, request.day, request.completed_tasks, request.notes)
        return result
    except Exception as e:
        logger.error("Save progress failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save progress.")


@router.get("/api/startups/progress/{token}")
async def load_build_progress_endpoint(token: str):
    try:
        return get_build_progress(token)
    except Exception as e:
        logger.error("Load progress failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to load progress.")


@router.get("/api/analytics", response_model=AnalyticsResponse)
async def get_analytics_dashboard():
    try:
        return get_analytics_summary()
    except Exception as e:
        logger.error("Analytics fetch failed: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to fetch analytics.")


@router.post("/api/analytics/track")
async def track_analytics_event(request: AnalyticsEvent):
    try:
        track_event(request.event, request.properties)
        return {"ok": True}
    except Exception as e:
        logger.error("Track event failed: %s", e, exc_info=True)
        return {"ok": False}
