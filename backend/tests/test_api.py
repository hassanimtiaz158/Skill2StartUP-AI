"""
Tests for the Skill2Startup AI backend API endpoints.

Uses pytest-asyncio for async tests and httpx's AsyncClient for HTTP calls.
Gemini API calls are mocked so no real API key is needed.
"""

import asyncio
from datetime import datetime
from unittest.mock import AsyncMock, patch, MagicMock
from typing import Any

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from bson import ObjectId
from pymongo.errors import DuplicateKeyError

from app.main import app
from app.services.auth_service import _hash_password


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------

VALID_PROFILE = {
    "skills": ["Python", "AI/ML", "FastAPI", "React"],
    "interests": ["Education", "SaaS", "Productivity"],
    "experience_level": "Intermediate",
    "budget": "100",
    "time_per_week": "10",
    "preferred_industry": "EdTech",
    "goal": "Hackathon MVP",
}

VALID_IDEA = {
    "startup_name": "SkillPath AI",
    "pitch": "An AI mentor that turns student skills into personalized career and startup roadmaps.",
    "problem": "Students have skills but do not know how to convert them into real projects.",
    "solution": "SkillPath AI analyzes skills, interests, and goals to generate startup ideas.",
    "target_users": ["Students", "Freelancers", "Hackathon participants"],
    "why_now": "AI tools now allow solo builders to launch MVPs faster than ever.",
    "opportunity_score": 8.7,
    "feasibility_score": 8.0,
    "demand_score": 9.0,
    "monetization_score": 7.5,
    "competition_gap_score": 8.0,
    "founder_fit_score": 9.0,
}


def _mock_gemini_response(payload: dict) -> dict:
    """Return the payload directly — simulates a successful Gemini JSON response."""
    return payload


def _make_mock_generate(mock_return: dict):
    """Create an async mock for generate_with_gemini."""
    async_mock = AsyncMock(return_value=mock_return)
    return async_mock


# ---------------------------------------------------------------------------
# Fixtures
# ---------------------------------------------------------------------------

@pytest.fixture(autouse=True)
def _mock_mongo():
    """Mock the MongoDB client so tests never touch a real database."""
    with patch("app.main.client") as mock_client, \
         patch("app.database.client", mock_client), \
         patch("app.services.database_service.founder_profiles") as mock_fp, \
         patch("app.services.database_service.startup_plans") as mock_sp, \
         patch("app.services.auth_service.users") as mock_users:
        # Make the ping command used in lifespan and health check succeed
        mock_client.admin.command = MagicMock(return_value=True)

        # Configure startup_plans mock
        mock_sp.insert_one.return_value = MagicMock(inserted_id=ObjectId())
        mock_sp.find.return_value = []
        mock_sp.delete_one.return_value = MagicMock(deleted_count=1)
        mock_users.insert_one.return_value = MagicMock(inserted_id=ObjectId())
        mock_users.find_one.return_value = None
        mock_users.update_one.return_value = MagicMock(modified_count=1)

        yield {
            "client": mock_client,
            "founder_profiles": mock_fp,
            "startup_plans": mock_sp,
            "users": mock_users,
        }


@pytest_asyncio.fixture
async def client():
    """Yield an httpx AsyncClient wired to the FastAPI app."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


# ---------------------------------------------------------------------------
# 1. Health check
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "Skill2Startup AI"


# ---------------------------------------------------------------------------
# 1b. Auth endpoints
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_signup_creates_user_session(client: AsyncClient, _mock_mongo):
    response = await client.post(
        "/api/auth/signup",
        json={"name": "Student Builder", "email": "Student@Example.com", "password": "Password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["token"]
    assert data["user"]["name"] == "Student Builder"
    assert data["user"]["email"] == "student@example.com"
    _mock_mongo["users"].insert_one.assert_called_once()


@pytest.mark.asyncio
async def test_signup_duplicate_email_returns_409(client: AsyncClient, _mock_mongo):
    _mock_mongo["users"].insert_one.side_effect = DuplicateKeyError("duplicate email")

    response = await client.post(
        "/api/auth/signup",
        json={"name": "Student Builder", "email": "student@example.com", "password": "Password123"},
    )

    assert response.status_code == 409


@pytest.mark.asyncio
async def test_signin_returns_user_session(client: AsyncClient, _mock_mongo):
    salt, password_hash = _hash_password("Password123")
    _mock_mongo["users"].find_one.return_value = {
        "_id": ObjectId(),
        "name": "Student Builder",
        "email": "student@example.com",
        "password_salt": salt,
        "password_hash": password_hash,
        "created_at": datetime.utcnow(),
    }

    response = await client.post(
        "/api/auth/signin",
        json={"email": "student@example.com", "password": "Password123"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["token"]
    assert data["user"]["email"] == "student@example.com"
    _mock_mongo["users"].update_one.assert_called_once()


@pytest.mark.asyncio
async def test_signin_invalid_password_returns_401(client: AsyncClient, _mock_mongo):
    salt, password_hash = _hash_password("Password123")
    _mock_mongo["users"].find_one.return_value = {
        "_id": ObjectId(),
        "name": "Student Builder",
        "email": "student@example.com",
        "password_salt": salt,
        "password_hash": password_hash,
        "created_at": datetime.utcnow(),
    }

    response = await client.post(
        "/api/auth/signin",
        json={"email": "student@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_and_logout_use_bearer_token(client: AsyncClient, _mock_mongo):
    user_id = ObjectId()
    _mock_mongo["users"].find_one.return_value = {
        "_id": user_id,
        "name": "Student Builder",
        "email": "student@example.com",
        "tokens": ["token-123"],
        "created_at": datetime.utcnow(),
    }

    me_response = await client.get("/api/auth/me", headers={"Authorization": "Bearer token-123"})
    assert me_response.status_code == 200
    assert me_response.json()["id"] == str(user_id)

    logout_response = await client.post("/api/auth/logout", headers={"Authorization": "Bearer token-123"})
    assert logout_response.status_code == 200
    assert logout_response.json()["message"] == "Signed out successfully"


# ---------------------------------------------------------------------------
# 2. Profile analysis
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_analyze_profile_returns_founder_type(client: AsyncClient, _mock_mongo):
    mock_result = {
        "founder_type": "AI SaaS Builder",
        "strengths": ["Python", "AI/ML", "FastAPI"],
        "weaknesses": ["Limited budget", "No marketing experience"],
        "best_startup_categories": ["EdTech", "SaaS", "Productivity"],
    }
    with patch("app.services.ai_service.generate_with_gemini", new=_make_mock_generate(mock_result)):
        response = await client.post("/api/profile/analyze", json=VALID_PROFILE)

    assert response.status_code == 200
    data = response.json()
    assert data["founder_type"] == "AI SaaS Builder"
    assert "strengths" in data
    assert "weaknesses" in data
    assert "best_startup_categories" in data


# ---------------------------------------------------------------------------
# 3. Startup idea generation
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_generate_ideas_returns_ideas_array(client: AsyncClient, _mock_mongo):
    mock_result = {
        "ideas": [
            {
                **VALID_IDEA,
                "startup_name": f"Startup {i}",
            }
            for i in range(3)
        ]
    }
    with patch("app.services.ai_service.generate_with_gemini", new=_make_mock_generate(mock_result)):
        response = await client.post("/api/startups/generate", json=VALID_PROFILE)

    assert response.status_code == 200
    data = response.json()
    assert "ideas" in data
    assert len(data["ideas"]) == 3
    for idea in data["ideas"]:
        assert "startup_name" in idea
        assert "opportunity_score" in idea


# ---------------------------------------------------------------------------
# 4. Full startup plan
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_generate_plan_returns_full_plan(client: AsyncClient, _mock_mongo):
    mock_result = {
        "startup_name": "SkillPath AI",
        "pitch": "An AI mentor for students.",
        "problem": "Students cannot convert skills into projects.",
        "solution": "AI-powered skill-to-startup platform.",
        "target_users": ["Students", "Freelancers"],
        "why_now": "AI tools enable solo builders.",
        "opportunity_score": 8.7,
        "competitors": [
            {"name": "CompetitorA", "strengths": ["Brand"], "weaknesses": ["Price"]},
        ],
        "competitor_limitations": ["No AI personalization"],
        "our_advantages": ["AI-driven", "Low cost"],
        "market_gaps": ["Personalized learning"],
        "mvp_features": ["Feature1", "Feature2"],
        "mvp_v1_scope": "Core features only",
        "mvp_v2_features": ["Future1"],
        "roadmap": [
            {"week": 1, "title": "Foundation", "tasks": ["Setup"]},
            {"week": 2, "title": "Build", "tasks": ["Code"]},
            {"week": 3, "title": "Test", "tasks": ["QA"]},
            {"week": 4, "title": "Launch", "tasks": ["Deploy"]},
        ],
        "revenue_model": {
            "pricing_model": "Freemium",
            "monetization_methods": ["Subscriptions"],
            "first_customer_strategy": "University partnerships",
            "recommendation": "B2C",
        },
        "launch_strategy": "Start with universities.",
        "swot": {
            "strengths": ["AI expertise"],
            "weaknesses": ["Small team"],
            "opportunities": ["Growing EdTech market"],
            "threats": ["Big competitors"],
        },
        "risks": ["Funding", "Adoption"],
        "hackathon_pitch": "A 60-second pitch.",
        "thirty_second_pitch": "A 30-second pitch.",
    }
    payload = {
        "profile": VALID_PROFILE,
        "idea": VALID_IDEA,
    }
    with patch("app.services.ai_service.generate_with_gemini", new=_make_mock_generate(mock_result)):
        response = await client.post("/api/startups/plan", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["startup_name"] == "SkillPath AI"
    assert "competitors" in data
    assert "roadmap" in data
    assert "swot" in data
    assert "revenue_model" in data
    assert "hackathon_pitch" in data


# ---------------------------------------------------------------------------
# 5. Save and list roundtrip
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_save_and_list_plans_roundtrip(client: AsyncClient, _mock_mongo):
    plan_id = str(ObjectId())
    user_id = ObjectId()
    _mock_mongo["users"].find_one.return_value = {
        "_id": user_id,
        "name": "Student Builder",
        "email": "student@example.com",
        "tokens": ["token-123"],
        "created_at": datetime.utcnow(),
    }
    mock_plan_doc = {
        "_id": str(ObjectId(plan_id)),
        "plan": {"startup_name": "TestStartup"},
        "profile": VALID_PROFILE,
        "user_id": str(user_id),
    }

    # --- save ---
    with patch("app.routes.startups.save_startup_plan", return_value=plan_id):
        save_payload = {
            "plan": {
                "startup_name": "TestStartup",
                "pitch": "Pitch",
                "problem": "Problem",
                "solution": "Solution",
                "target_users": ["Users"],
                "why_now": "Now",
                "opportunity_score": 7.0,
                "competitors": [],
                "competitor_limitations": [],
                "our_advantages": [],
                "market_gaps": [],
                "mvp_features": [],
                "roadmap": [],
                "revenue_model": {},
                "launch_strategy": "Strategy",
                "swot": {"strengths": [], "weaknesses": [], "opportunities": [], "threats": []},
                "risks": [],
                "hackathon_pitch": "Pitch",
                "thirty_second_pitch": "Short pitch",
            },
            "profile": VALID_PROFILE,
        }
        save_response = await client.post(
            "/api/startups/save",
            json=save_payload,
            headers={"Authorization": "Bearer token-123"},
        )

    assert save_response.status_code == 200
    save_data = save_response.json()
    assert save_data["plan_id"] == plan_id

    # --- list ---
    with patch("app.routes.startups.get_saved_plans", return_value=[mock_plan_doc]):
        list_response = await client.get(
            "/api/startups/saved",
            headers={"Authorization": "Bearer token-123"},
        )

    assert list_response.status_code == 200
    list_data = list_response.json()
    assert "plans" in list_data
    assert len(list_data["plans"]) >= 1


# ---------------------------------------------------------------------------
# 6. Delete plan
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_delete_plan(client: AsyncClient, _mock_mongo):
    plan_id = str(ObjectId())
    _mock_mongo["users"].find_one.return_value = {
        "_id": ObjectId(),
        "name": "Student Builder",
        "email": "student@example.com",
        "tokens": ["token-123"],
        "created_at": datetime.utcnow(),
    }
    with patch("app.routes.startups.delete_startup_plan", return_value=True):
        response = await client.delete(
            f"/api/startups/{plan_id}",
            headers={"Authorization": "Bearer token-123"},
        )

    assert response.status_code == 200
    assert response.json()["message"] == "Plan deleted successfully"


@pytest.mark.asyncio
async def test_delete_plan_not_found(client: AsyncClient, _mock_mongo):
    plan_id = str(ObjectId())
    _mock_mongo["users"].find_one.return_value = {
        "_id": ObjectId(),
        "name": "Student Builder",
        "email": "student@example.com",
        "tokens": ["token-123"],
        "created_at": datetime.utcnow(),
    }
    with patch("app.routes.startups.delete_startup_plan", return_value=False):
        response = await client.delete(
            f"/api/startups/{plan_id}",
            headers={"Authorization": "Bearer token-123"},
        )

    assert response.status_code == 404


@pytest.mark.asyncio
async def test_saved_plans_requires_auth(client: AsyncClient, _mock_mongo):
    response = await client.get("/api/startups/saved")
    assert response.status_code == 401


# ---------------------------------------------------------------------------
# 7. Validation errors (422)
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_analyze_profile_missing_skills_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE}
    bad_payload.pop("skills")
    response = await client.post("/api/profile/analyze", json=bad_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_profile_missing_interests_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE}
    bad_payload.pop("interests")
    response = await client.post("/api/profile/analyze", json=bad_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_analyze_profile_missing_goal_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE}
    bad_payload.pop("goal")
    response = await client.post("/api/profile/analyze", json=bad_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_ideas_empty_skills_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE, "skills": []}
    response = await client.post("/api/startups/generate", json=bad_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_ideas_empty_interests_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE, "interests": []}
    response = await client.post("/api/startups/generate", json=bad_payload)
    assert response.status_code == 422


@pytest.mark.asyncio
async def test_generate_ideas_empty_goal_returns_422(client: AsyncClient, _mock_mongo):
    bad_payload = {**VALID_PROFILE, "goal": ""}
    response = await client.post("/api/startups/generate", json=bad_payload)
    assert response.status_code == 422
