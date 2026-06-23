from app.services.gemini_service import generate_with_gemini
from app.prompts.prompts import (
    SKILL_ANALYSIS_PROMPT,
    STARTUP_GENERATION_PROMPT,
    FULL_PLAN_PROMPT,
)


def _stringify_profile(profile: dict) -> dict:
    """Convert list fields to comma-separated strings for prompt formatting."""
    result = dict(profile)
    for key in ("skills", "interests"):
        if isinstance(result.get(key), list):
            result[key] = ", ".join(result[key])
    return result


async def analyze_profile(profile: dict) -> dict:
    data = _stringify_profile(profile)
    prompt = SKILL_ANALYSIS_PROMPT.format(**data)
    return await generate_with_gemini(prompt)


async def generate_startup_ideas(profile: dict) -> dict:
    data = _stringify_profile(profile)
    prompt = STARTUP_GENERATION_PROMPT.format(**data)
    return await generate_with_gemini(prompt)


async def generate_full_plan(profile: dict, idea: dict) -> dict:
    data = {**_stringify_profile(profile), **idea}
    if isinstance(data.get("target_users"), list):
        data["target_users"] = ", ".join(data["target_users"])
    prompt = FULL_PLAN_PROMPT.format(**data)
    return await generate_with_gemini(prompt)
