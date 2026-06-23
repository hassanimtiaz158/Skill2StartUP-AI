SKILL_ANALYSIS_PROMPT = """You are an expert startup advisor and career coach. Analyze the following user profile and provide a detailed founder profile analysis.

User Profile:
- Skills: {skills}
- Interests: {interests}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week
- Goal: {goal}

Provide your analysis as a JSON object with exactly this structure:
{{
    "founder_type": "A descriptive title like 'AI SaaS Builder' or 'EdTech Innovator'",
    "strengths": ["strength1", "strength2", "strength3"],
    "weaknesses": ["weakness1", "weakness2"],
    "best_startup_categories": ["category1", "category2", "category3"]
}}

Return ONLY the JSON object. No other text."""


STARTUP_GENERATION_PROMPT = """You are a startup idea generator AI. Based on the user's profile, generate exactly 4 innovative startup ideas.

User Profile:
- Skills: {skills}
- Interests: {interests}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week
- Preferred Industry: {preferred_industry}
- Goal: {goal}

For each idea, calculate opportunity scores using these weights:
- Feasibility (25%): How feasible is this given the user's skills and budget?
- Market Demand (25%): How high is the market demand?
- Monetization Potential (20%): How easy to monetize?
- Competition Gap (15%): How much gap exists in competition?
- Founder-Skill Fit (15%): How well does this match the founder's skills?

The final opportunity_score = (feasibility*0.25 + demand*0.25 + monetization*0.2 + competition_gap*0.15 + founder_fit*0.15), scaled to 10.

Return exactly 4 ideas as a JSON object with this structure:
{{
    "ideas": [
        {{
            "startup_name": "Creative Name",
            "pitch": "One-line compelling pitch",
            "problem": "Clear problem statement",
            "solution": "How this startup solves it",
            "target_users": ["user1", "user2"],
            "why_now": "Why this is timely",
            "opportunity_score": 8.5,
            "feasibility_score": 8.0,
            "demand_score": 9.0,
            "monetization_score": 7.5,
            "competition_gap_score": 8.0,
            "founder_fit_score": 9.0
        }}
    ]
}}

Return ONLY the JSON object. No other text."""


FULL_PLAN_PROMPT = """You are a startup planning AI expert. Generate a comprehensive startup plan for the following idea based on this founder profile.

Founder Profile:
- Skills: {skills}
- Interests: {interests}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week
- Goal: {goal}

Startup Idea:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}
- Target Users: {target_users}
- Opportunity Score: {opportunity_score}

Generate a detailed plan and return it as a JSON object with this exact structure:
{{
    "startup_name": "{startup_name}",
    "pitch": "{pitch}",
    "problem": "Detailed problem analysis",
    "solution": "Detailed solution explanation",
    "target_users": ["user1", "user2", "user3"],
    "why_now": "Why this is the right time",
    "opportunity_score": {opportunity_score},
    "competitors": [
        {{
            "name": "Competitor Name",
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"]
        }}
    ],
    "competitor_limitations": ["limitation1", "limitation2", "limitation3"],
    "our_advantages": ["advantage1", "advantage2", "advantage3"],
    "market_gaps": ["gap1", "gap2", "gap3"],
    "mvp_features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
    "mvp_v1_scope": "Description of what's included in Version 1 MVP",
    "mvp_v2_features": ["future_feature1", "future_feature2", "future_feature3"],
    "roadmap": [
        {{"week": 1, "title": "Foundation", "tasks": ["task1", "task2"]}},
        {{"week": 2, "title": "Core Build", "tasks": ["task1", "task2"]}},
        {{"week": 3, "title": "Testing & Polish", "tasks": ["task1", "task2"]}},
        {{"week": 4, "title": "Launch", "tasks": ["task1", "task2"]}}
    ],
    "revenue_model": {{
        "pricing_model": "Freemium / Subscription / One-time",
        "monetization_methods": ["method1", "method2"],
        "first_customer_strategy": "How to get first 10 customers",
        "recommendation": "B2B or B2C"
    }},
    "launch_strategy": "Step-by-step launch plan",
    "swot": {{
        "strengths": ["s1", "s2", "s3"],
        "weaknesses": ["w1", "w2"],
        "opportunities": ["o1", "o2", "o3"],
        "threats": ["t1", "t2"]
    }},
    "risks": ["risk1", "risk2", "risk3"],
    "hackathon_pitch": "A compelling 60-second hackathon demo pitch",
    "thirty_second_pitch": "A concise 30-second elevator pitch"
}}

Return ONLY the JSON object. No other text."""
