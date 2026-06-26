SKILL_ANALYSIS_PROMPT = """You are an expert startup advisor and career coach. Analyze the following user profile and provide a detailed founder profile analysis. Skills can be high-level domains (e.g., Full-Stack Development, AI/ML, Marketing, Product Management) — treat all domains as equally valuable for building a startup.

User Profile:
- Skills: {skills}
- Interests: {interests}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week
- Goal: {goal}

Provide your analysis as a JSON object with exactly this structure:
{{
    "founder_type": "A descriptive title that reflects the founder's domain — e.g. 'AI SaaS Builder', 'FinTech Operator', 'Growth Marketer', 'Design-Led Founder', 'Blockchain Developer'",
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
- Variation Seed: {variation_seed}

Novelty requirement:
- Generate fresh ideas for this exact request, guided by the variation seed.
- Avoid generic repeats like "AI mentor", "roadmap generator", or "productivity app" unless the user's profile strongly demands it.
- Mix at least 2 different business models or customer segments across the 4 ideas.
- Make names, users, and market angles distinct from each other.

For each idea, calculate opportunity scores using these weights:
- Feasibility (25%): How feasible is this given the user's skills (technical, business, creative, or domain expertise) and budget? Consider non-technical domains equally — a Marketing expert can build a marketing tool, a Finance expert can build FinTech.
- Market Demand (25%): How high is the market demand?
- Monetization Potential (20%): How easy to monetize?
- Competition Gap (15%): How much gap exists in competition?
- Founder-Skill Fit (15%): How well does this match the founder's skills and domain expertise? Consider all skill types — technical, business, creative, and domain knowledge.

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


AGENT_EVALUATION_PROMPT = """You are a {agent_role} evaluating a startup idea for investment potential.
You are part of a 3-agent evaluation committee. Your role is to provide your expert assessment.

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

Return your evaluation as a JSON object with this exact structure:
{{
    "agent": "{agent_name}",
    "score": <0-100>,
    "strengths": ["strength1", "strength2", "strength3"],
    "risks": ["risk1", "risk2", "risk3"],
    "improvements": ["improvement1", "improvement2", "improvement3"]
}}

Base your score on these criteria:
{criteria}

Return ONLY the JSON object. No other text."""


COFOUNDER_PROMPT = """You are a personality architect AI. Based on the user's founder profile and their chosen startup idea, generate a personalized AI co-founder persona that complements them perfectly.

Founder Profile:
- Skills: {skills}
- Interests: {interests}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week
- Goal: {goal}
- Founder Type: {founder_type}
- Strengths: {strengths}
- Weaknesses: {weaknesses}

Startup Idea:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}

Return a JSON object with this exact structure:
{{
    "name": "A creative co-founder name that reflects the startup's mission",
    "personality": "A vivid 2-sentence personality description",
    "strengths": ["strength1", "strength2", "strength3", "strength4"],
    "complement": "How this co-founder fills the user's skill gaps (1 sentence)",
    "advice": ["piece of advice 1", "piece of advice 2", "piece of advice 3"]
}}

The name should be memorable and thematic. The personality should feel real and human.
The strengths MUST directly complement the user's weaknesses.
The advice should be specific, actionable, and startup-oriented.
Return ONLY the JSON object. No other text."""


TASK_ROADMAP_PROMPT = """You are a project manager AI. Based on the founder profile and startup plan, generate a detailed task roadmap in JSON format. The founder's skills may include technical, business, creative, or domain expertise — tailor the roadmap tools and tasks accordingly.

Founder Profile:
- Skills: {skills}
- Experience Level: {experience_level}
- Budget: ${budget}
- Available Time: {time_per_week} hours/week

Startup Plan:
- Name: {startup_name}
- Pitch: {pitch}
- MVP Features: {mvp_features}
- Revenue Model: {revenue_model}
- Launch Strategy: {launch_strategy}
- Competitors: {competitors}

Return a JSON object with this exact structure:
{{
    "roadmap": [
        {{
            "phase": "Phase 1: Foundation",
            "tasks": [
                {{
                    "phase": "Phase 1: Foundation",
                    "task": "Specific actionable task description",
                    "priority": "High/Mid/Low",
                    "estimated_time_hours": <number>,
                    "tools_needed": ["tool1", "tool2"],
                    "status": "Pending"
                }}
            ]
        }}
    ]
}}

Generate 4-6 phases covering:
1. Foundation & Setup
2. Core MVP Build
3. Testing & Iteration
4. Launch Preparation
5. Marketing & Growth
6. Post-Launch

Each phase should have 2-4 concrete tasks. Prioritize based on the founder's time budget ({time_per_week} hrs/week) and budget (${budget}).
Use realistic tools for each task based on the founder's skills — if skills are non-technical (e.g., Marketing, Sales, Operations), suggest domain-appropriate tools (e.g., analytics platforms, CRM tools, no-code builders).

Return ONLY the JSON object. No other text."""


README_GENERATOR_PROMPT = """You are a technical writer AI. Generate a professional, complete README.md for the following startup idea. If the founder's skills are non-technical (e.g., Marketing, Design, Operations), adjust the README focus toward product workflow and business processes rather than purely code.

Startup Name: {startup_name}
Pitch: {pitch}
Problem: {problem}
Solution: {solution}
Target Users: {target_users}
Why Now: {why_now}

MVP Features: {mvp_features}
Competitors: {competitors}
Revenue Model: {revenue_model}
Launch Strategy: {launch_strategy}
Founder Skills & Domain: {skills}

Return a JSON object with this exact structure:
{{
    "project_name": "{startup_name}",
    "problem": "Detailed problem statement (3-4 sentences)",
    "solution": "How the startup solves it (3-4 sentences)",
    "features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
    "tech_stack": ["tech1", "tech2", "tech3", "tech4"],
    "architecture": "High-level architecture description (3-5 sentences)",
    "setup_steps": ["1. Clone the repository", "2. Install dependencies", "3. Configure environment", "4. Run the application"],
    "future_improvements": ["improvement1", "improvement2", "improvement3"],
    "markdown": "Full markdown content of the README with headings, badges, code blocks, and proper formatting"
}}

The markdown field should contain the COMPLETE README.md content using proper GitHub markdown with:
- A header with project name and badges
- Problem & Solution sections
- Features checklist
- Tech stack table
- Architecture diagram (ASCII)
- Setup instructions with code blocks
- API reference (if applicable)
- Contributing guidelines
- License section
- Future roadmap

If the founder's skills are primarily non-technical (e.g., Marketing, Operations), include no-code or low-code setup alternatives in the setup instructions and focus the architecture on workflows rather than software components.

Return ONLY the JSON object. No other text."""


IDEA_CHAT_PROMPT = """You are a domain-expert startup advisor. Below is a complete analysis of a specific startup idea. Your task is to answer the user's follow-up question using ONLY the data from this analysis. Generic, one-size-fits-all advice is forbidden.

IDEA ANALYSIS (use this as your sole source of facts):
{analysis}

USER QUESTION: {question}

## RULES — you MUST follow every rule:

1. **Mine the analysis first.** Before writing anything, extract from the IDEA ANALYSIS: the refined idea, its scores, competitors (by name), risks, MVP features, tech stack, target users, and build plan. Every answer MUST reference at least two of these.

2. **No generic advice.** Never say things like "focus on your target market" or "iterate based on feedback" without tying it to the specific idea. For example, instead of "research your competitors", say "Your competitor IdeaGenie already offers AI brainstorming — differentiate by adding the competitor validation layer your analysis recommends."

3. **Be specific and actionable.** Give concrete next steps the founder can execute today. Name specific tools, techniques, or approaches relevant to this idea.

4. **Stay in character as a domain expert.** If the question is about marketing, answer as a growth expert. If about tech, answer as an architect. Always ground your expertise in the specifics of this analysis.

5. **Structure your answer.** Start with a direct answer to the question, then support it with evidence from the analysis, then give 1-2 actionable steps.

## Output format:

Return a JSON object with this exact structure:
{{
    "answer": "Your detailed answer (2-5 paragraphs). Must reference specific scores, competitors, features, or risks from the analysis."
}}

Return ONLY the JSON object. No other text."""


IDEA_CHAT_CONCISE_PROMPT = """You are a domain-expert startup advisor. Below is a complete analysis of a specific startup idea.

IDEA ANALYSIS (use this as your sole source of facts):
{analysis}

USER QUESTION: {question}

## RULES:
1. Answer concisely in 2-5 sentences. Only give more detail if the question explicitly asks for it.
2. Use the analysis to give specific, actionable answers. Reference scores, competitors, features, or risks only when directly relevant.
3. No generic advice — tie every answer to the specific idea in the analysis.
4. Structure: direct answer → supporting evidence → 1 actionable step (if applicable).

## Output format:
Return a JSON object with this exact structure:
{{"answer": "Your concise answer here"}}

Return ONLY the JSON object. No other text."""


IDEA_CHAT_FULL_PROMPT = """You are a domain-expert startup advisor. Below is the complete analysis of a startup idea.

IDEA ANALYSIS:
{analysis}

USER QUESTION: {question}

The user wants a comprehensive summary of the entire analysis. Cover all key aspects:
- The refined idea and problem statement
- All scores (market demand, uniqueness, feasibility, revenue potential)
- Competitors and differentiation strategy
- MVP features and tech stack
- Monetization model
- Risks and improvement suggestions
- 7-day build plan
- Founder readiness check
- Pitch summary

## Output format:
Return a JSON object with this exact structure:
{{"answer": "Your comprehensive overview here"}}

Return ONLY the JSON object. No other text."""


IDEA_ANALYSIS_PROMPT = """You are an expert startup analyst and venture advisor. Analyze the following startup idea and return a comprehensive structured analysis.

Startup Idea: {startup_idea}
Target Audience: {target_audience}
Industry: {industry}
User Skills: {skills}
Budget/Time Limit: {budget_time_limit}

For competitors, generate at least 3 competitors or similar products. If you have specific market knowledge use it, otherwise provide AI-estimated competitors clearly labeled with source "ai-estimated".

For the 7-day build plan, create a day-by-day MVP build schedule with concrete tasks.

Return a JSON object with this exact structure:
{{
    "refined_idea": "A refined, compelling version of the startup idea (25-35 words)",
    "problem_statement": "Clear problem statement that this idea solves (20-30 words)",
    "target_users": ["user_segment1", "user_segment2", "user_segment3"],
    "market_demand_score": <0-10>,
    "uniqueness_score": <0-10>,
    "feasibility_score": <0-10>,
    "revenue_potential_score": <0-10>,
    "hackathon_winning_score": <0-10>,
    "competitors": [
        {{
            "name": "Competitor Name",
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "source": "ai-estimated"
        }}
    ],
    "differentiation_strategy": "How this idea stands out from competitors (20-30 words)",
    "mvp_features": ["feature1", "feature2", "feature3", "feature4", "feature5"],
    "tech_stack_recommendation": ["tech1", "tech2", "tech3", "tech4"],
    "monetization_model": "Clear monetization strategy description (15-25 words)",
    "risks": ["risk1", "risk2", "risk3", "risk4"],
    "improvement_suggestions": ["suggestion1", "suggestion2", "suggestion3"],
    "seven_day_build_plan": [
        {{"day": 1, "title": "Day 1 title", "tasks": ["task1", "task2"]}},
        {{"day": 2, "title": "Day 2 title", "tasks": ["task1", "task2"]}},
        {{"day": 3, "title": "Day 3 title", "tasks": ["task1", "task2"]}},
        {{"day": 4, "title": "Day 4 title", "tasks": ["task1", "task2"]}},
        {{"day": 5, "title": "Day 5 title", "tasks": ["task1", "task2"]}},
        {{"day": 6, "title": "Day 6 title", "tasks": ["task1", "task2"]}},
        {{"day": 7, "title": "Day 7 title", "tasks": ["task1", "task2"]}}
    ],
    "founder_readiness_check": "Assessment of founder readiness and skill gaps (20-30 words)",
    "pitch_summary": "A compelling 30-second investor pitch summary (40-50 words)"
}}

Scoring guidelines:
- market_demand_score: 0-10 based on market size, urgency, traction signals
- uniqueness_score: 0-10 based on novelty vs existing solutions
- feasibility_score: 0-10 based on build and execution complexity, given skills (technical or domain expertise) and resources. Non-technical founders can use no-code tools, business expertise, or partnerships — factor that in.
- revenue_potential_score: 0-10 based on monetization paths, pricing headroom
- hackathon_winning_score: 0-10 based on wow factor, demo-ability, judge appeal

Return ONLY the JSON object. No other text."""


MARKET_SIZE_PROMPT = """You are a market research analyst. Estimate the market size for the following startup idea.

Startup Idea: {startup_idea}
Industry: {industry}
Target Audience: {target_audience}

Return a JSON object with this exact structure:
{{
    "tam": "Total Addressable Market in USD with rationale (e.g. '$50B global market for online learning platforms')",
    "sam": "Serviceable Addressable Market in USD with rationale",
    "som": "Serviceable Obtainable Market in USD with rationale (realistic first 3-5 year capture)",
    "growth_rate": "Compound annual growth rate with source note (e.g. '14.5% CAGR (Grand View Research, 2024)')",
    "key_trends": ["trend1", "trend2", "trend3", "trend4"],
    "revenue_projection": "Revenue projection for years 1-3 based on SOM capture rate",
    "data_confidence": "high/medium/low based on how specific the industry data is"
}}

Return ONLY the JSON object. No other text."""


DEBATE_ROOM_PROMPT = """You are a debate moderator. Four expert AI agents will debate the following startup idea from their unique perspectives. For each agent, provide their arguments, then give a consensus.

Startup Idea: {startup_idea}
Industry: {industry}
Target Audience: {target_audience}

Generate a debate with exactly 4 agent personas:

1. "The Visionary" (role: "Idea & Innovation Expert", emoji: "💡") - Focuses on the big picture potential, innovation, and future possibilities. Scores highly on uniqueness but may ignore practical constraints.

2. "The Skeptic" (role: "Risk & Feasibility Analyst", emoji: "🔍") - Focuses on what could go wrong, technical challenges, market competition, and feasibility concerns. Cautious and detail-oriented.

3. "The Builder" (role: "Technical & Execution Expert", emoji: "⚙️") - Focuses on how to actually build this, what tech stack to use, MVP scope, timeline, and resource requirements.

4. "The Investor" (role: "Market & Monetization Analyst", emoji: "💰") - Focuses on revenue potential, market size, unit economics, funding strategy, and ROI.

Return a JSON object with this exact structure:
{{
    "agents": [
        {{
            "agent_name": "The Visionary",
            "role": "Idea & Innovation Expert",
            "argument": "Compelling argument from this agent's perspective (3-5 sentences)",
            "emoji": "💡"
        }},
        {{
            "agent_name": "The Skeptic",
            "role": "Risk & Feasibility Analyst",
            "argument": "Compelling argument from this agent's perspective (3-5 sentences)",
            "emoji": "🔍"
        }},
        {{
            "agent_name": "The Builder",
            "role": "Technical & Execution Expert",
            "argument": "Compelling argument from this agent's perspective (3-5 sentences)",
            "emoji": "⚙️"
        }},
        {{
            "agent_name": "The Investor",
            "role": "Market & Monetization Analyst",
            "argument": "Compelling argument from this agent's perspective (3-5 sentences)",
            "emoji": "💰"
        }}
    ],
    "consensus": "A balanced consensus that synthesizes all viewpoints (3-5 sentences)",
    "key_takeaways": ["takeaway1", "takeaway2", "takeaway3"]
}}

Return ONLY the JSON object. No other text."""


COMPARISON_PROMPT = """You are a startup comparison analyst. Compare two startup ideas across multiple dimensions and determine which is stronger.

Idea A: {idea_a}
Idea B: {idea_b}
Industry: {industry}

Return a JSON object with this exact structure:
{{
    "dimensions": [
        {{
            "dimension": "Market Potential",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment of Idea A for this dimension",
            "idea_b_notes": "Brief assessment of Idea B for this dimension"
        }},
        {{
            "dimension": "Technical Feasibility",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment",
            "idea_b_notes": "Brief assessment"
        }},
        {{
            "dimension": "Monetization Potential",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment",
            "idea_b_notes": "Brief assessment"
        }},
        {{
            "dimension": "Uniqueness & Differentiation",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment",
            "idea_b_notes": "Brief assessment"
        }},
        {{
            "dimension": "Time to Market",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment",
            "idea_b_notes": "Brief assessment"
        }},
        {{
            "dimension": "Founder Fit",
            "idea_a_score": <0-10>,
            "idea_b_score": <0-10>,
            "idea_a_notes": "Brief assessment",
            "idea_b_notes": "Brief assessment"
        }}
    ],
    "overall_winner": "Idea A" or "Idea B" or "Tie",
    "summary": "A comprehensive comparison summary (3-5 sentences explaining the winner)"
}}

Scoring: 0-3 = poor, 4-6 = moderate, 7-8 = good, 9-10 = excellent.
Return ONLY the JSON object. No other text."""


EMAIL_REPORT_PROMPT = """You are a startup report writer. Create a professional HTML email report for the following startup idea analysis.

IDEA ANALYSIS:
{analysis}

Write a compelling HTML email that:
1. Has a subject line: "Your Startup Idea Analysis - [refined idea name]"
2. Opens with a brief personalized greeting
3. Summarizes the key scores (market demand, uniqueness, feasibility, revenue potential, hackathon winning)
4. Lists top 3 strengths and top 3 risks
5. Gives 3 actionable next steps
6. Closes with encouragement

Use clean inline CSS styling (no external stylesheets). The email should be professional but accessible.
Return ONLY the HTML string. No JSON wrapper, no markdown code blocks."""


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


FIRST_100_CUSTOMERS_PROMPT = """You are a growth marketing strategist. Based on this startup's details, generate a practical "First 100 Customers" acquisition plan that is specific, actionable, and tailored to the idea — not generic advice.

STARTUP DETAILS:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}
- Target Users: {target_users}
- MVP Features: {mvp_features}
- Competitors: {competitors}
- Industry: {industry}

## RULES:
1. Every recommendation must be specific to this startup's target users, industry, and competitors.
2. Cold message templates must include actual subject lines and body text that reference the startup's value proposition.
3. The 7-day action plan must have concrete, daily tasks the founder can execute immediately.
4. Do not give generic advice like "post on social media" — specify which platforms and what type of content.

Return a JSON object with this exact structure:
{{
    "ideal_early_adopters": "Detailed description of the ideal first 100 customers, who they are, and why they would buy first (2-3 sentences)",
    "where_to_find_them": ["specific online community or platform 1", "specific community 2", "specific community 3", "specific community 4"],
    "outreach_channels": ["outreach channel 1 with brief rationale", "channel 2 with brief rationale", "channel 3 with brief rationale"],
    "cold_message_templates": [
        {{
            "channel": "Email",
            "subject": "Specific subject line referencing the startup's value prop",
            "body": "Full cold email body (3-4 sentences) personalized to the target user"
        }},
        {{
            "channel": "LinkedIn / Social DM",
            "subject": "Message subject or first line",
            "body": "Direct message body that is conversational and specific"
        }}
    ],
    "social_media_launch_plan": "Step-by-step social media launch strategy specific to this startup's audience and industry (3-5 sentences)",
    "referral_strategy": "Specific referral mechanics — what incentive, how to ask, and when to trigger the ask (2-3 sentences)",
    "seven_day_action_plan": [
        {{"day": 1, "title": "Day 1 objective", "tasks": ["concrete task 1", "concrete task 2", "concrete task 3"]}},
        {{"day": 2, "title": "Day 2 objective", "tasks": ["concrete task 1", "concrete task 2"]}},
        {{"day": 3, "title": "Day 3 objective", "tasks": ["concrete task 1", "concrete task 2", "concrete task 3"]}},
        {{"day": 4, "title": "Day 4 objective", "tasks": ["concrete task 1", "concrete task 2"]}},
        {{"day": 5, "title": "Day 5 objective", "tasks": ["concrete task 1", "concrete task 2", "concrete task 3"]}},
        {{"day": 6, "title": "Day 6 objective", "tasks": ["concrete task 1", "concrete task 2"]}},
        {{"day": 7, "title": "Day 7 objective", "tasks": ["concrete task 1", "concrete task 2", "concrete task 3"]}}
    ],
    "metrics_to_track": ["specific metric 1", "metric 2", "metric 3", "metric 4", "metric 5"]
}}

Return ONLY the JSON object. No other text."""


DECISION_ENGINE_PROMPT = """You are a venture analyst and startup strategist. Based on the startup idea details below, generate a comprehensive decision report with risk analysis, success probability, and a clear Go/Pivot/Drop recommendation. Every assessment must be specific to this idea — no generic advice.

STARTUP DETAILS:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}
- Target Users: {target_users}
- Industry: {industry}
- MVP Features: {mvp_features}
- Competitors: {competitors}
- Market Demand Score (0-10): {market_demand}
- Uniqueness Score (0-10): {uniqueness}
- Feasibility Score (0-10): {feasibility}
- Revenue Potential Score (0-10): {revenue_potential}
- Key Risks: {risks}

## RULES:
1. Every risk, score, and recommendation must reference specific details about this startup (name, features, users, competitors, scores).
2. The success probability should use the formula: `percentage = min(92, (market_demand * 3 + uniqueness * 2.5 + feasibility * 2 + revenue_potential * 2.5) + 12)` as a starting point, then adjust +-3 based on specific risks and strengths. This produces a baseline of 70-92% for typical scores. Be optimistic — focus on upside potential and the founder's ability to execute.
3. The final recommendation (Go/Pivot/Drop) must include a clear, specific reason tied to the idea. Favor "Go" unless there are critical red flags.
4. Action steps must be concrete and immediately actionable for this specific startup.
5. Overall risk level should default to "Low" or "Medium" — only assign "High" for genuinely severe red flags.

Return a JSON object with this exact structure:
{{
    "risk_analysis": {{
        "overall_risk_level": "Low" or "Medium" or "High",
        "key_business_risks": ["risk specific to this startup's business model", "risk 2", "risk 3"],
        "technical_risks": ["risk specific to building this product", "risk 2", "risk 3"],
        "market_risks": ["risk specific to this startup's market", "risk 2", "risk 3"],
        "financial_risks": ["risk specific to this startup's finances", "risk 2", "risk 3"]
    }},
    "success_probability": {{
        "percentage": <0-100 integer>,
        "reason": "2-3 sentence explanation of why this probability, referencing specific aspects of the idea"
    }},
    "recommendation": {{
        "decision": "Go" or "Pivot" or "Drop",
        "explanation": "2-3 sentence explanation of why this recommendation, specific to this startup",
        "action_steps": [
            "specific actionable step 1",
            "specific actionable step 2",
            "specific actionable step 3",
            "specific actionable step 4"
        ]
    }}
}}

Return ONLY the JSON object. No other text."""


BUSINESS_PLANNING_PROMPT = """You are a business strategist and financial analyst. Based on the startup idea details below, generate a complete business plan with four reports: Business Model Canvas, Lean Canvas, Revenue Forecast (1-3 Years), and Pricing Strategy. Every item must be specific to this startup — no generic placeholders.

STARTUP DETAILS:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}
- Target Users: {target_users}
- Industry: {industry}
- MVP Features: {mvp_features}
- Competitors: {competitors}
- Market Demand Score (0-10): {market_demand}
- Uniqueness Score (0-10): {uniqueness}
- Feasibility Score (0-10): {feasibility}
- Revenue Potential Score (0-10): {revenue_potential}
- Key Risks: {risks}
- Monetization Model: {monetization_model}
- Revenue Model Type: {revenue_model_type}

Return a JSON object with this exact structure:
{{
    "business_model_canvas": {{
        "customer_segments": ["specific segment 1", "segment 2", "segment 3"],
        "value_proposition": "Clear value proposition tailored to this startup (1-2 sentences)",
        "channels": ["channel 1", "channel 2", "channel 3"],
        "customer_relationships": "How the startup builds relationships with customers (1-2 sentences)",
        "revenue_streams": ["revenue stream 1", "stream 2", "stream 3"],
        "key_resources": ["resource 1", "resource 2", "resource 3", "resource 4"],
        "key_activities": ["activity 1", "activity 2", "activity 3"],
        "key_partners": ["partner 1", "partner 2", "partner 3"],
        "cost_structure": ["cost 1", "cost 2", "cost 3", "cost 4"]
    }},
    "lean_canvas": {{
        "problem": ["top problem 1", "problem 2", "problem 3"],
        "customer_segments": ["early adopter 1", "early adopter 2", "early adopter 3"],
        "unique_value_proposition": "Single clear message that makes this startup different (1 sentence)",
        "solution": ["solution component 1", "component 2", "component 3"],
        "channels": ["channel 1", "channel 2", "channel 3"],
        "revenue_streams": ["stream 1", "stream 2"],
        "cost_structure": ["cost 1", "cost 2", "cost 3"],
        "key_metrics": ["metric 1", "metric 2", "metric 3", "metric 4", "metric 5"],
        "unfair_advantage": "Something hard to copy about this startup (1 sentence)"
    }},
    "revenue_forecast": {{
        "year_1": {{"total_revenue": 0, "monthly_revenue": [0,0,0,0,0,0,0,0,0,0,0,0], "estimated_customers": 0, "avg_revenue_per_customer": 0, "growth_rate": "e.g. 15% monthly"}},
        "year_2": {{"total_revenue": 0, "monthly_revenue": [0,0,0,0,0,0,0,0,0,0,0,0], "estimated_customers": 0, "avg_revenue_per_customer": 0, "growth_rate": "e.g. 10% monthly"}},
        "year_3": {{"total_revenue": 0, "monthly_revenue": [0,0,0,0,0,0,0,0,0,0,0,0], "estimated_customers": 0, "avg_revenue_per_customer": 0, "growth_rate": "e.g. 8% monthly"}},
        "best_case": {{"year_1_revenue": 0, "year_2_revenue": 0, "year_3_revenue": 0, "assumptions": "Key assumption driving best case (1 sentence)"}},
        "expected_case": {{"year_1_revenue": 0, "year_2_revenue": 0, "year_3_revenue": 0, "assumptions": "Key assumption driving expected case (1 sentence)"}},
        "worst_case": {{"year_1_revenue": 0, "year_2_revenue": 0, "year_3_revenue": 0, "assumptions": "Key assumption driving worst case (1 sentence)"}},
        "growth_assumptions": ["assumption 1", "assumption 2", "assumption 3"]
    }},
    "pricing_strategy": {{
        "recommended_model": "Subscription / One-time / Freemium / Commission / Usage-based / Marketplace",
        "tiers": [
            {{"name": "Free / Basic", "price": 0, "features": ["feature 1", "feature 2"], "target_customers": "who this tier is for"}},
            {{"name": "Pro / Premium", "price": 29, "features": ["feature 1", "feature 2", "feature 3"], "target_customers": "who this tier is for"}},
            {{"name": "Enterprise / Growth", "price": 99, "features": ["feature 1", "feature 2", "feature 3", "feature 4"], "target_customers": "who this tier is for"}}
        ],
        "competitor_pricing": [
            {{"competitor_name": "Competitor X", "model": "Subscription", "price_range": "$29-$99/mo"}},
            {{"competitor_name": "Competitor Y", "model": "Freemium", "price_range": "$0-$50/mo"}}
        ],
        "justification": "Why this pricing model fits this specific startup (2-3 sentences)",
        "monetization_recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
    }}
}}

Scoring: All revenue numbers should be realistic for a startup in this industry and stage. Base pricing on competitor benchmarks and the startup's target customer willingness to pay.
Return ONLY the JSON object. No other text."""


CUSTOMER_INSIGHTS_PROMPT = """You are a customer research analyst and UX strategist. Based on the startup idea details below, generate a comprehensive customer insights report with four sections: Customer Personas, Ideal Customer Profile, Pain Point Analysis, and Customer Journey Map. Every item must be specific to this startup — no generic placeholders.

STARTUP DETAILS:
- Name: {startup_name}
- Pitch: {pitch}
- Problem: {problem}
- Solution: {solution}
- Target Users: {target_users}
- Industry: {industry}
- MVP Features: {mvp_features}
- Competitors: {competitors}
- Market Demand Score (0-10): {market_demand}
- Uniqueness Score (0-10): {uniqueness}
- Key Risks: {risks}
- Monetization Model: {monetization_model}

Return a JSON object with this exact structure:
{{
    "personas": [
        {{
            "name": "Persona Name",
            "age": "25-34",
            "occupation": "Job title / role",
            "location": "City or region",
            "goals": ["goal 1", "goal 2", "goal 3"],
            "challenges": ["challenge 1", "challenge 2"],
            "motivations": ["motivation 1", "motivation 2"],
            "buying_behavior": "How this persona makes purchasing decisions (1-2 sentences)",
            "preferred_channels": ["channel 1", "channel 2", "channel 3"]
        }},
        {{
            "name": "Persona Name 2",
            "age": "35-44",
            "occupation": "Job title / role",
            "location": "City or region",
            "goals": ["goal 1", "goal 2"],
            "challenges": ["challenge 1", "challenge 2", "challenge 3"],
            "motivations": ["motivation 1", "motivation 2", "motivation 3"],
            "buying_behavior": "How this persona makes purchasing decisions (1-2 sentences)",
            "preferred_channels": ["channel 1", "channel 2"]
        }}
    ],
    "ideal_customer_profile": {{
        "target_audience": "Clear description of the ideal target audience (2-3 sentences)",
        "industry": "Primary industry or industries",
        "company_size": "Company size if B2B, otherwise N/A",
        "demographics": "Age range, income level, education, location (2-3 sentences)",
        "interests": ["interest 1", "interest 2", "interest 3", "interest 4"],
        "budget": "Typical budget range for this solution",
        "buying_intent": "High / Medium / Low — with explanation (1 sentence)",
        "decision_makers": ["decision-maker role 1", "role 2", "role 3"],
        "primary_use_cases": ["use case 1", "use case 2", "use case 3", "use case 4"]
    }},
    "pain_point_analysis": [
        {{
            "pain_point": "Specific pain point description",
            "existing_solutions": "What customers currently use to address this",
            "why_they_fail": "Why existing solutions fall short (1-2 sentences)",
            "startup_solution": "How this startup specifically solves this pain point (1-2 sentences)",
            "priority": "High" or "Medium" or "Low"
        }},
        {{
            "pain_point": "Pain point 2",
            "existing_solutions": "Current solutions",
            "why_they_fail": "Why they fall short",
            "startup_solution": "How this startup solves it",
            "priority": "High" or "Medium" or "Low"
        }},
        {{
            "pain_point": "Pain point 3",
            "existing_solutions": "Current solutions",
            "why_they_fail": "Why they fall short",
            "startup_solution": "How this startup solves it",
            "priority": "High" or "Medium" or "Low"
        }}
    ],
    "customer_journey": {{
        "awareness": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2", "action 3"], "pain_points": ["pain point 1", "pain point 2"], "emotions": ["emotion 1", "emotion 2"], "opportunities": ["opportunity 1", "opportunity 2"]}},
        "consideration": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2"], "pain_points": ["pain point 1", "pain point 2"], "emotions": ["emotion 1", "emotion 2"], "opportunities": ["opportunity 1", "opportunity 2"]}},
        "decision": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2", "action 3"], "pain_points": ["pain point 1", "pain point 2", "pain point 3"], "emotions": ["emotion 1", "emotion 2", "emotion 3"], "opportunities": ["opportunity 1", "opportunity 2"]}},
        "purchase": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2"], "pain_points": ["pain point 1"], "emotions": ["emotion 1", "emotion 2"], "opportunities": ["opportunity 1"]}},
        "onboarding": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2", "action 3"], "pain_points": ["pain point 1", "pain point 2"], "emotions": ["emotion 1", "emotion 2"], "opportunities": ["opportunity 1", "opportunity 2"]}},
        "retention": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2"], "pain_points": ["pain point 1", "pain point 2"], "emotions": ["emotion 1"], "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"]}},
        "referral": {{"customer_goals": "What the customer wants at this stage (1 sentence)", "actions": ["action 1", "action 2"], "pain_points": ["pain point 1"], "emotions": ["emotion 1", "emotion 2"], "opportunities": ["opportunity 1", "opportunity 2"]}}
    }}
}}

Rules: Personas must feel like real people with specific names, jobs, and locations relevant to this startup's industry. Pain points must be specific to the problem this startup solves — not generic frustrations. Journey stages should reflect realistic customer behavior for this type of product.
Return ONLY the JSON object. No other text."""
