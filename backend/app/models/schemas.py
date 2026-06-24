from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class SignUpRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=8, max_length=128)


class SignInRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)
    password: str = Field(..., min_length=1, max_length=128)


class ForgotPasswordRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=254)


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class UserProfile(BaseModel):
    skills: list[str] = Field(..., min_length=1)
    interests: list[str] = Field(..., min_length=1)
    experience_level: str = "Intermediate"
    budget: str = "100"
    time_per_week: str = "10"
    preferred_industry: Optional[str] = ""
    goal: str = Field(..., min_length=1)


class FounderProfileResponse(BaseModel):
    founder_type: str
    strengths: list[str]
    weaknesses: list[str]
    best_startup_categories: list[str]


class StartupIdea(BaseModel):
    startup_name: str
    pitch: str
    problem: str
    solution: str
    target_users: list[str]
    why_now: str
    opportunity_score: float
    feasibility_score: float
    demand_score: float
    monetization_score: float
    competition_gap_score: float
    founder_fit_score: float


class StartupIdeasResponse(BaseModel):
    ideas: list[StartupIdea]


class CompetitorInfo(BaseModel):
    name: str
    strengths: list[str]
    weaknesses: list[str]


class SWOTAnalysis(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    opportunities: list[str]
    threats: list[str]


class RoadmapItem(BaseModel):
    week: int
    title: str
    tasks: list[str]


class StartupPlan(BaseModel):
    startup_name: str
    pitch: str
    problem: str
    solution: str
    target_users: list[str]
    why_now: str
    opportunity_score: float
    competitors: list[CompetitorInfo]
    competitor_limitations: list[str]
    our_advantages: list[str]
    market_gaps: list[str]
    mvp_features: list[str]
    mvp_v1_scope: str = ""
    mvp_v2_features: list[str] = []
    roadmap: list[RoadmapItem]
    revenue_model: dict
    launch_strategy: str
    swot: SWOTAnalysis
    risks: list[str]
    hackathon_pitch: str
    thirty_second_pitch: str


class PlanRequest(BaseModel):
    profile: UserProfile
    idea: StartupIdea


class SavePlanRequest(BaseModel):
    plan: StartupPlan
    profile: UserProfile
