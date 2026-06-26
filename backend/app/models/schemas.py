from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import datetime


class AgentEvaluation(BaseModel):
    agent: str
    score: int = Field(..., ge=0, le=100)
    strengths: list[str]
    risks: list[str]
    improvements: list[str]


class FundingDecision(BaseModel):
    decision: Literal["Fund", "Revise", "Reject"]
    overall_score: int = Field(..., ge=0, le=100)
    evaluations: list[AgentEvaluation]
    summary: str


class CofounderPersona(BaseModel):
    name: str
    personality: str
    strengths: list[str]
    complement: str
    advice: list[str] = Field(..., min_length=3, max_length=3)


class RoadmapTask(BaseModel):
    phase: str
    task: str
    priority: Literal["High", "Medium", "Low"]
    estimated_time_hours: int
    tools_needed: list[str]
    status: Literal["Pending", "In Progress", "Done"] = "Pending"


class ReadmeContent(BaseModel):
    project_name: str
    problem: str
    solution: str
    features: list[str]
    tech_stack: list[str]
    architecture: str
    setup_steps: list[str]
    future_improvements: list[str]
    markdown: str


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


class EvaluationRequest(BaseModel):
    profile: UserProfile
    idea: StartupIdea


class CofounderRequest(BaseModel):
    profile: UserProfile
    idea: StartupIdea


class RoadmapRequest(BaseModel):
    profile: UserProfile
    idea: StartupIdea
    plan: StartupPlan


class ReadmeRequest(BaseModel):
    profile: UserProfile
    idea: StartupIdea
    plan: StartupPlan


class IdeaAnalysisRequest(BaseModel):
    startup_idea: str = Field(..., min_length=10, max_length=2000)
    target_audience: Optional[str] = ""
    industry: Optional[str] = ""
    skills: Optional[str] = ""
    budget_time_limit: Optional[str] = ""


class CompetitorAnalysis(BaseModel):
    name: str
    strengths: list[str]
    weaknesses: list[str]
    source: Literal["ai-estimated", "web"]


class BuildPlanDay(BaseModel):
    day: int
    title: str
    tasks: list[str]


class IdeaChatRequest(BaseModel):
    analysis: dict
    question: str = Field(..., min_length=1, max_length=1000)


class IdeaChatResponse(BaseModel):
    answer: str


class ShareLinkRequest(BaseModel):
    analysis: dict
    idea_form: dict = {}


class ShareLinkResponse(BaseModel):
    token: str
    url: str


class MarketSizeRequest(BaseModel):
    startup_idea: str = Field(..., min_length=10, max_length=2000)
    industry: Optional[str] = ""
    target_audience: Optional[str] = ""


class MarketSizeResponse(BaseModel):
    tam: str
    sam: str
    som: str
    growth_rate: str
    key_trends: list[str]
    revenue_projection: str
    data_confidence: Literal["high", "medium", "low"]


class DebateRequest(BaseModel):
    startup_idea: str = Field(..., min_length=10, max_length=2000)
    industry: Optional[str] = ""
    target_audience: Optional[str] = ""


class DebateAgentMessage(BaseModel):
    agent_name: str
    role: str
    argument: str
    emoji: str = ""


class DebateResponse(BaseModel):
    agents: list[DebateAgentMessage]
    consensus: str
    key_takeaways: list[str]


class ComparisonRequest(BaseModel):
    idea_a: str = Field(..., min_length=10, max_length=2000)
    idea_b: str = Field(..., min_length=10, max_length=2000)
    industry: Optional[str] = ""


class ComparisonDimension(BaseModel):
    dimension: str
    idea_a_score: int = Field(..., ge=0, le=10)
    idea_b_score: int = Field(..., ge=0, le=10)
    idea_a_notes: str
    idea_b_notes: str


class ComparisonResponse(BaseModel):
    dimensions: list[ComparisonDimension]
    overall_winner: str
    summary: str


class EmailReportRequest(BaseModel):
    analysis: dict
    recipient_email: str = Field(..., min_length=3, max_length=254)
    idea_form: dict = {}


class EmailReportResponse(BaseModel):
    sent: bool
    message: str


class ProgressSaveRequest(BaseModel):
    token: str = Field(..., min_length=1)
    day: int = Field(..., ge=1, le=7)
    completed_tasks: list[str]
    notes: str = ""


class ProgressLoadResponse(BaseModel):
    days: dict


class ColdMessageTemplate(BaseModel):
    channel: str
    subject: str
    body: str


class ActionDay(BaseModel):
    day: int
    title: str
    tasks: list[str]


class First100CustomersRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    mvp_features: list[str] = []
    competitors: list = []
    industry: str = ""


class First100CustomersResponse(BaseModel):
    ideal_early_adopters: str
    where_to_find_them: list[str]
    outreach_channels: list[str]
    cold_message_templates: list[ColdMessageTemplate]
    social_media_launch_plan: str
    referral_strategy: str
    seven_day_action_plan: list[ActionDay]
    metrics_to_track: list[str]


class RiskAnalysis(BaseModel):
    overall_risk_level: Literal["Low", "Medium", "High"]
    key_business_risks: list[str]
    technical_risks: list[str]
    market_risks: list[str]
    financial_risks: list[str]


class SuccessProbability(BaseModel):
    percentage: int = Field(..., ge=0, le=100)
    reason: str


class Recommendation(BaseModel):
    decision: Literal["Go", "Pivot", "Drop"]
    explanation: str
    action_steps: list[str]


class DecisionEngineRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    industry: str = ""
    mvp_features: list[str] = []
    competitors: list = []
    market_demand: float = 0
    uniqueness: float = 0
    feasibility: float = 0
    revenue_potential: float = 0
    risks: list[str] = []


class DecisionEngineResponse(BaseModel):
    risk_analysis: RiskAnalysis
    success_probability: SuccessProbability
    recommendation: Recommendation


class AnalyticsEvent(BaseModel):
    event: str = Field(..., min_length=1)
    properties: dict = {}


class AnalyticsResponse(BaseModel):
    total_analyses: int
    total_shares: int
    total_chats: int
    top_industries: list[dict]
    recent_events: list[dict]

class IdeaAnalysisResponse(BaseModel):
    refined_idea: str
    problem_statement: str
    target_users: list[str]
    market_demand_score: float
    uniqueness_score: float
    feasibility_score: float
    revenue_potential_score: float
    hackathon_winning_score: float
    competitors: list[CompetitorAnalysis]
    differentiation_strategy: str
    mvp_features: list[str]
    tech_stack_recommendation: list[str]
    monetization_model: str
    risks: list[str]
    improvement_suggestions: list[str]
    seven_day_build_plan: list[BuildPlanDay]
    founder_readiness_check: str
    pitch_summary: str


class BusinessModelCanvas(BaseModel):
    customer_segments: list[str]
    value_proposition: str
    channels: list[str]
    customer_relationships: str
    revenue_streams: list[str]
    key_resources: list[str]
    key_activities: list[str]
    key_partners: list[str]
    cost_structure: list[str]


class LeanCanvas(BaseModel):
    problem: list[str]
    customer_segments: list[str]
    unique_value_proposition: str
    solution: list[str]
    channels: list[str]
    revenue_streams: list[str]
    cost_structure: list[str]
    key_metrics: list[str]
    unfair_advantage: str


class YearForecast(BaseModel):
    total_revenue: float = 0
    monthly_revenue: list[float] = []
    estimated_customers: int = 0
    avg_revenue_per_customer: float = 0
    growth_rate: str = ""


class ScenarioForecast(BaseModel):
    year_1_revenue: float = 0
    year_2_revenue: float = 0
    year_3_revenue: float = 0
    assumptions: str = ""


class RevenueForecast(BaseModel):
    year_1: YearForecast
    year_2: YearForecast
    year_3: YearForecast
    best_case: ScenarioForecast
    expected_case: ScenarioForecast
    worst_case: ScenarioForecast
    growth_assumptions: list[str]


class PricingTier(BaseModel):
    name: str
    price: float = 0
    features: list[str]
    target_customers: str = ""


class CompetitorPricing(BaseModel):
    competitor_name: str
    model: str
    price_range: str = ""


class PricingStrategy(BaseModel):
    recommended_model: str
    tiers: list[PricingTier]
    competitor_pricing: list[CompetitorPricing]
    justification: str
    monetization_recommendations: list[str]


class BusinessPlanningRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    industry: str = ""
    mvp_features: list[str] = []
    competitors: list = []
    market_demand: float = 0
    uniqueness: float = 0
    feasibility: float = 0
    revenue_potential: float = 0
    risks: list[str] = []
    monetization_model: str = ""
    revenue_model_type: str = ""


class BusinessPlanningResponse(BaseModel):
    business_model_canvas: BusinessModelCanvas
    lean_canvas: LeanCanvas
    revenue_forecast: RevenueForecast
    pricing_strategy: PricingStrategy


class Persona(BaseModel):
    name: str
    age: str = ""
    occupation: str = ""
    location: str = ""
    goals: list[str] = []
    challenges: list[str] = []
    motivations: list[str] = []
    buying_behavior: str = ""
    preferred_channels: list[str] = []


class IdealCustomerProfile(BaseModel):
    target_audience: str = ""
    industry: str = ""
    company_size: str = ""
    demographics: str = ""
    interests: list[str] = []
    budget: str = ""
    buying_intent: str = ""
    decision_makers: list[str] = []
    primary_use_cases: list[str] = []


class PainPoint(BaseModel):
    pain_point: str
    existing_solutions: str = ""
    why_they_fail: str = ""
    startup_solution: str = ""
    priority: str = "Medium"


class JourneyStage(BaseModel):
    customer_goals: str = ""
    actions: list[str] = []
    pain_points: list[str] = []
    emotions: list[str] = []
    opportunities: list[str] = []


class CustomerJourney(BaseModel):
    awareness: JourneyStage
    consideration: JourneyStage
    decision: JourneyStage
    purchase: JourneyStage
    onboarding: JourneyStage
    retention: JourneyStage
    referral: JourneyStage


class CustomerInsightsRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    industry: str = ""
    mvp_features: list[str] = []
    competitors: list = []
    market_demand: float = 0
    uniqueness: float = 0
    risks: list[str] = []
    monetization_model: str = ""


class CustomerInsightsResponse(BaseModel):
    personas: list[Persona]
    ideal_customer_profile: IdealCustomerProfile
    pain_point_analysis: list[PainPoint]
    customer_journey: CustomerJourney


class MarketSizeDetail(BaseModel):
    value: str = ""
    description: str = ""
    assumptions: list[str] = []


class MarketSize(BaseModel):
    tam: MarketSizeDetail
    sam: MarketSizeDetail
    som: MarketSizeDetail
    confidence_level: str = "Medium"


class MarketTrend(BaseModel):
    trend: str
    description: str = ""
    impact_on_startup: str = ""
    priority: str = "Medium"


class IndustryGrowth(BaseModel):
    annual_growth_rate: str = ""
    growth_drivers: list[str] = []
    market_limitations: list[str] = []
    five_year_outlook: str = ""


class EmergingOpportunity(BaseModel):
    opportunity: str
    description: str = ""
    how_to_capitalize: str = ""
    impact: str = "Medium"
    feasibility: str = "Medium"


class CompetitorFeatureRow(BaseModel):
    competitor_name: str
    features: list[str] = []
    pricing_model: str = ""
    target_users: str = ""
    strengths: list[str] = []
    weaknesses: list[str] = []
    differentiation_opportunity: str = ""


class MarketIntelligenceRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    industry: str = ""
    location: str = ""
    business_model: str = ""
    mvp_features: list[str] = []
    competitors: list = []
    market_demand: float = 0
    uniqueness: float = 0
    risks: list[str] = []
    monetization_model: str = ""


class MarketIntelligenceResponse(BaseModel):
    market_size: MarketSize
    market_trends: list[MarketTrend]
    industry_growth: IndustryGrowth
    emerging_opportunities: list[EmergingOpportunity]
    competitor_comparison: list[CompetitorFeatureRow]


class AICofounderChatRequest(BaseModel):
    advisor_type: Literal["mentor", "product_manager", "marketing", "technical", "investor"]
    question: str = Field(..., min_length=1, max_length=2000)
    startup_context: dict = {}


class AICofounderChatResponse(BaseModel):
    answer: str


class PitchDeckSlide(BaseModel):
    slide_number: int
    title: str
    content: str = ""
    visual_suggestion: str = ""


class PitchDeck(BaseModel):
    slides: list[PitchDeckSlide]


class ElevatorPitch(BaseModel):
    short_pitch: str = ""
    full_pitch: str = ""
    key_message: str = ""


class ExecutiveSummary(BaseModel):
    problem: str = ""
    solution: str = ""
    target_market: str = ""
    business_model: str = ""
    competitive_advantage: str = ""
    revenue_potential: str = ""
    risks: list[str] = []
    next_steps: str = ""


class ReadinessScore(BaseModel):
    overall_score: int = 0
    market_demand_score: int = 0
    uniqueness_score: int = 0
    feasibility_score: int = 0
    revenue_potential_score: int = 0
    traction_score: int = 0
    team_readiness_score: int = 0
    financial_clarity_score: int = 0
    risk_management_score: int = 0
    strengths: list[str] = []
    weaknesses: list[str] = []
    improvement_suggestions: list[str] = []


class FundingRecommendation(BaseModel):
    recommended_type: str = ""
    explanation: str = ""
    amount_range: str = ""
    equity_to_offer: str = ""
    preparation_steps: list[str] = []
    ideal_investor_types: list[str] = []
    milestones_to_reach_before_fundraising: list[str] = []


class InvestorToolsRequest(BaseModel):
    startup_name: str = ""
    pitch: str = ""
    problem: str = ""
    solution: str = ""
    target_users: list[str] = []
    industry: str = ""
    location: str = ""
    business_model: str = ""
    mvp_features: list[str] = []
    competitors: list = []
    market_demand: float = 0
    uniqueness: float = 0
    feasibility: float = 0
    revenue_potential: float = 0
    risks: list[str] = []
    monetization_model: str = ""


class InvestorToolsResponse(BaseModel):
    pitch_deck: PitchDeck
    elevator_pitch: ElevatorPitch
    executive_summary: ExecutiveSummary
    readiness_score: ReadinessScore
    funding_recommendation: FundingRecommendation
